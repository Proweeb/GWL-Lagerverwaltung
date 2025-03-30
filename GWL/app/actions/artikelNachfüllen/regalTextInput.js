import { Text, View, ScrollView, Keyboard } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { Alert } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import RegalService from "../../../database/datamapper/RegalHelper.js";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RegalTextInput({
  regalId,
  setRegalId,
  setRegalIdValid,
  regalIdValid,
}) {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={{ fontSize: RFPercentage(1.8) }}>Regal-ID*</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInputField
            value={regalId}
            onChangeText={(text) => {
              const regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

              // Überprüfen, ob das Format gültig ist
              if (regex.test(text)) {
                setRegalIdValid(true); // Gültig
              } else {
                setRegalIdValid(false); // Ungültig
                Toast.show({
                  type: "warning",
                  text1: "Regal",
                  text2: "RegalID hat das falsche Format",
                  position: "bottom",
                });
              }

              setRegalId(text); // Text setzen
            }}
            textColor={regalIdValid ? "black" : "red"} // Textfarbe ändern, wenn ungültig
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Scan\\Barcode", {
              onScan: (code) => {
                setRegalId(code);
              },
            });
          }}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: styles.white,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons
            name={"barcode-scan"}
            size={25}
            color={"black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
