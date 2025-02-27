import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../components/styles";
import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { Pressable } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";

export default function OverviewWithQuantity({
  menge,
  setMenge,
  setShowMengeOverview,
  foundArticle,
}) {
  const [nachfüllmenge, setNachfüllmenge] = useState(0);
  const [showValue, setShowValue] = useState(0);
  const handleFertig = async () => {
    setShowMengeOverview(false);
    if (nachfüllmenge == "") {
      setNachfüllmenge(0);
    }
    await ArtikelService.updateArtikel(foundArticle.gwId, {
      gwId: foundArticle.gwId,
      firmenId: foundArticle.firmenId,
      beschreibung: foundArticle.beschreibung,
      menge: menge + Number(nachfüllmenge),
      mindestMenge: foundArticle.mindestMenge,
      ablaufdatum: foundArticle.ablaufdatum,
      regalId: foundArticle.regalId,
    });
    console.log(
      "Neu geänderte Menge: Gwid: " +
        foundArticle.gwId +
        " Menge: " +
        menge +
        " Beschreibung: " +
        foundArticle.beschreibung
    );
  };
  return (
    <Pressable
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
            Aktuelle Menge vom Artikel: {menge}
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
              setNachfüllmenge(nachfüllmenge - 1);
              setShowValue(nachfüllmenge);
            }}
            style={siteStyles.touchableStyle}
          >
            <Feather name="minus" size={50} color="white" />
          </TouchableOpacity>

          <TextInput
            style={siteStyles.inputStyle}
            value={nachfüllmenge}
            onChangeText={(text) => setNachfüllmenge(text)}
            inputMode={"numeric"}
          ></TextInput>

          <TouchableOpacity
            onPress={() => {
              setNachfüllmenge(nachfüllmenge + 1);
              setShowValue(nachfüllmenge);
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
