import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../components/styles";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import LogService from "../../../database/datamapper/LogHelper";
import Toast from "react-native-toast-message";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import { useEffect } from "react";

export default function OverviewWithQuantity({
  menge,
  setMenge,
  setShowMengeOverview,
  foundArticle,
  foundRegal,
}) {
  const [entnahmeMenge, setEntnahmeMenge] = useState(0);
  const [ausgabeMenge, setAusgabeMenge] = useState(menge);
  const showLowMenge = () => {
    if (menge === 0) {
      console.log("low");
      Toast.show({
        type: "error",
        text1: "Artikel: " + foundArticle.beschreibung,
        text2: "Leer",
        position: "bottom",
        autoHide: false,
        topOffset: 50,
        swipeable: true,
      });

      return 0;
    } else if (menge < foundArticle.mindestMenge) {
      console.log("low");
      Toast.show({
        type: "warning",
        text1: "Artikel: " + foundArticle.beschreibung,
        text2: "Wenig",
        position: "bottom",
        autoHide: false,
        topOffset: 50,
        swipeable: true,
      });
    }
  };

  useEffect(() => {
    setAusgabeMenge(Number(menge) - Number(entnahmeMenge));
  }, [entnahmeMenge]);

  const handleFertig = async () => {
    setShowMengeOverview(false);
    if (entnahmeMenge === "") {
      setEntnahmeMenge(0);
    }

    //Regal Id muss hier noch rein gehören also beim nachfüllen und entnehmen braucht man die RegalID
    await ArtikelBesitzerService.updateArtikelBesitzerMengeByGwIdAndRegalId(
      {
        menge: entnahmeMenge * -1,
      },
      foundRegal.regalId,
      foundArticle.gwId
    );

    Toast.show({
      type: "success",
      text1: "Artikel: " + foundArticle.beschreibung,
      text2: "Neue Menge: " + (Number(menge) - Number(entnahmeMenge)),
      position: "top",
    });
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
      onPress={() => {
        setShowMengeOverview(false);
      }}
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
                //setMenge(Number(menge) + 1);
              }
            }}
            style={siteStyles.touchableStyle}
          >
            <Feather name="minus" size={50} color="white" />
          </TouchableOpacity>

          <TextInput
            style={siteStyles.inputStyle}
            value={String(entnahmeMenge)}
            onChangeText={(text) => {
              const cleanedText = text.replace(/[^0-9]/g, "");

              if (cleanedText === "") {
                setEntnahmeMenge("");
                //setMenge(Number(menge));
                return;
              }

              const newValue = Number(cleanedText);

              if (newValue > menge) {
                setEntnahmeMenge(Number(menge));
                //setMenge(0);
              } else {
                setEntnahmeMenge(newValue);
                //setMenge(Number(menge) - newValue);
              }
            }}
            inputMode={"numeric"}
          />

          <TouchableOpacity
            onPress={() => {
              if (
                Number(menge) !== 0 &&
                Number(entnahmeMenge) < Number(menge)
              ) {
                setEntnahmeMenge(Number(entnahmeMenge) + 1);
                //setMenge(Number(menge) - 1);
              }

              //setShowValue(nachfüllmenge);
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
            onPress={() => {
              handleFertig(), showLowMenge();
            }}
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
