import { Text, TouchableOpacity, View, Pressable } from "react-native";
import { styles } from "../../../components/styles";
import { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import Toast from "react-native-toast-message";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import { ToastMessages, EmailBodies } from "../../../components/enum";
import { composeEmailWithDefault } from "../../../components/utils/Functions/emailUtils";

export default function OverviewWithQuantity({
  menge,
  setShowMengeOverview,
  gwId,
  regalId,
  setRegalId,
  setGwId,
}) {
  const [nachfüllmenge, setNachfüllmenge] = useState(0);
  const [ausgabeMenge, setAusgabeMenge] = useState(menge);
  const [foundArticle, setFoundArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await ArtikelService.getArtikelById(gwId);
        setFoundArticle(article);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, [gwId]);

  useEffect(() => {
    setAusgabeMenge(Number(menge) + Number(nachfüllmenge));
  }, [nachfüllmenge, menge]);

  const showLowMenge = async () => {
    if (!foundArticle) return;

    const newMenge = Number(menge) + Number(nachfüllmenge);
    if (newMenge <= foundArticle.mindestMenge) {
      Toast.show({
        type: "warning",
        text1: ToastMessages.WARNING,
        text2:
          ToastMessages.ARTICLE_ALMOST_EMPTY + " " + foundArticle.beschreibung,
        position: "bottom",
        autoHide: false,
        topOffset: 50,
        swipeable: true,
      });

      // Wait for 1 second before sending email
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Send email notification for low stock
      try {
        let body = EmailBodies.SINGLE_LOW_STOCK.replace(
          "{beschreibung}",
          foundArticle.beschreibung
        )
          .replace("{gwId}", gwId)
          .replace("{menge}", newMenge)
          .replace("{mindestMenge}", foundArticle.mindestMenge);

        body += EmailBodies.SIGNATURE;

        await composeEmailWithDefault({
          subject: `Niedriger Lagerbestand: ${foundArticle.beschreibung}`,
          body,
        });
      } catch (error) {
        console.error("Error sending email:", error);
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.SEND_EMAIL_ERROR,
        });
      }
    }
  };

  const handleFertig = async () => {
    try {
      setShowMengeOverview(false);

      if (nachfüllmenge === "") {
        setNachfüllmenge(0);
      } else {
        await ArtikelBesitzerService.updateArtikelBesitzerMengeByGwIdAndRegalId(
          { menge: nachfüllmenge },
          regalId,
          gwId
        );

        Toast.show({
          type: "success",
          text1: ToastMessages.ERFOLG,
          text2:
            ToastMessages.ARTICLE_UPDATED +
            " " +
            foundArticle.beschreibung +
            ": " +
            (Number(menge) + Number(nachfüllmenge)),
          position: "bottom",
        });

        // Check if stock is still low after refill
        await showLowMenge();

        setRegalId("");
        setGwId("");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.ARTICLE_UPDATED_ERROR,
        position: "bottom",
      });
    }
  };

  const handleMengeChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");

    if (cleanedText === "") {
      setNachfüllmenge("");
      return;
    }

    const newValue = Number(cleanedText);
    setNachfüllmenge(newValue);
  };

  return (
    <Pressable
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        flex: 1,
        opacity: 0.8,
      }}
      onPress={() => setShowMengeOverview(false)}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View>
          <Text style={[siteStyles.textStyle, { color: "white" }]}>
            Aktuelle Menge vom Artikel: {ausgabeMenge}
          </Text>
        </View>

        <View>
          <Text
            style={[
              siteStyles.textStyle,
              { color: "white", marginTop: "25%", fontSize: RFPercentage(2.5) },
            ]}
          >
            Nachfüllmenge:
          </Text>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (Number(nachfüllmenge) > 0) {
                setNachfüllmenge(Number(nachfüllmenge) - 1);
              }
            }}
            style={siteStyles.touchableStyle}
          >
            <Feather name="minus" size={50} color="white" />
          </TouchableOpacity>

          <TextInput
            style={siteStyles.inputStyle}
            value={String(nachfüllmenge)}
            onChangeText={handleMengeChange}
            inputMode="numeric"
          />

          <TouchableOpacity
            onPress={() => {
              setNachfüllmenge(Number(nachfüllmenge) + 1);
            }}
            style={siteStyles.touchableStyle}
          >
            <Feather name="plus" size={50} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: "center",
            width: "100%",
            marginTop: "25%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#dcebf9",
              padding: 10,
              borderRadius: 5,
              height: "auto",
              width: "auto",
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
            }}
            onPress={handleFertig}
          >
            <Text style={{ fontSize: RFPercentage(3.5) }}>Fertig</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

export const siteStyles = {
  inputStyle: {
    padding: 5,
    backgroundColor: styles.white,
    fontSize: RFPercentage(8),
    width: "40%",
    textAlign: "center",
    borderRadius: 20,
    elevation: 5,
  },
  touchableStyle: {
    padding: 5,
    textAlign: "center",
    marginHorizontal: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontweight: "bold",
    fontSize: RFPercentage(3),
  },
};
