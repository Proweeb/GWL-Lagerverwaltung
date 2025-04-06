import { Text, TouchableOpacity, View, Pressable } from "react-native";
import { styles } from "../../../components/styles";
import { useState, useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import Toast from "react-native-toast-message";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
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
  const [entnahmeMenge, setEntnahmeMenge] = useState(0);
  const [ausgabeMenge, setAusgabeMenge] = useState(menge);
  const [foundArticle, setFoundArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await ArtikelService.getArtikelById(gwId);
        setFoundArticle(article);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.ARTICLE_NOT_FOUND,
          position: "bottom",
        });
      }
    };
    fetchArticle();
  }, [gwId]);

  useEffect(() => {
    setAusgabeMenge(Number(menge) - Number(entnahmeMenge));
  }, [entnahmeMenge, menge]);

  const showLowMenge = async () => {
    if (!foundArticle) return;

    if (menge === 0) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.ARTICLE_EMPTY + " " + foundArticle.beschreibung,
        position: "bottom",
        autoHide: false,
        topOffset: 50,
        swipeable: true,
      });
    } else if (menge <= foundArticle.mindestMenge) {
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
          .replace("{gwId}", foundArticle.gwId)
          .replace("{menge}", menge)
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

      if (entnahmeMenge === "") {
        setEntnahmeMenge(0);
      } else {
        await ArtikelBesitzerService.updateArtikelBesitzerMengeByGwIdAndRegalId(
          { menge: entnahmeMenge * -1 },
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
            (Number(menge) - Number(entnahmeMenge)),
          position: "bottom",
        });

        setRegalId("");
        setGwId("");
        showLowMenge();
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
      setEntnahmeMenge("");
      return;
    }

    const newValue = Number(cleanedText);
    if (newValue > menge) {
      setEntnahmeMenge(Number(menge));
    } else {
      setEntnahmeMenge(newValue);
    }
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
            Entnahmemenge:
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
              if (Number(entnahmeMenge) > 0) {
                setEntnahmeMenge(Number(entnahmeMenge) - 1);
              }
            }}
            style={siteStyles.touchableStyle}
          >
            <Feather name="minus" size={50} color="white" />
          </TouchableOpacity>

          <TextInput
            style={siteStyles.inputStyle}
            value={String(entnahmeMenge)}
            onChangeText={handleMengeChange}
            inputMode="numeric"
          />

          <TouchableOpacity
            onPress={() => {
              if (
                Number(menge) !== 0 &&
                Number(entnahmeMenge) < Number(menge)
              ) {
                setEntnahmeMenge(Number(entnahmeMenge) + 1);
              }
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
