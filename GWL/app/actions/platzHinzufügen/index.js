import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { Component, useState, useEffect } from "react";
import RegalService from "../../../database/datamapper/RegalHelper";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { RFPercentage } from "react-native-responsive-fontsize";

import ActionButton from "../../../components/Buttons/ActionsButton";
import { styles } from "../../../components/styles";
import Toast from "react-native-toast-message";
import RegalTextInput from "../artikelNachfüllen/regalTextInput";
import { ErrorMessages } from "../../../components/enum";

export default function IndexScreen() {
  const [name, setName] = useState("");
  const [fach, setFach] = useState("");
  const [code, setCode] = useState("");
  const [regalIdValid, setRegalIdValid] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (regalIdValid && code) {
      const parts = code.split('.');
      if (parts.length === 2) {
        setFach(parts[1]);
        setName(parts[0]);
      }
    }
  }, [regalIdValid, code]);

  const handleSubmit = async () => {
    try {
      if (!name || !fach || !code) {
        Toast.show({
          type: "error",
          text1: "Fehler",
          text2: "Bitte fülle alle Felder aus, bevor du speicherst.",
          position: "bottom",
        });
        return;
      }

   

      await RegalService.getRegalById(code);
     
      console.log(regal);
    } catch (error) {

      if (error.message ===ErrorMessages.REGAL_NOT_FOUND) {
        const regalData = {
          regalId: code,
          fachName: fach,
          regalName: name,
        };
      await RegalService.createRegal(regalData);
      Toast.show({
        type: "success",
        text1: "Erfolgreich gespeichert!",
        text2: `Das Regal ${code} wurde erfolgreich erstellt`,
        position: "bottom",
      });
      navigation.navigate("Home");
      console.log("Regal erfolgreich erstellt.");
      const regal = await RegalService.getRegalById(code);
      }

      else {
        Toast.show({
          type: "error",
          text1: "Fehler",
          text2: "Regal existiert bereits",
          position: "bottom",
        });
      }
    }
  };
    
  

  const inputStyle = {
    height: 40,
    borderColor: "transparent",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: styles.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        padding: 20,
        backgroundColor: styles.backgroundColor,
      }}
    >
      <Text style={{ fontSize: 16, marginBottom: 30, fontWeight: "bold" }}>
        Lagerung
      </Text>
      <RegalTextInput regalId={code} setRegalId={setCode} setRegalIdValid={setRegalIdValid} regalIdValid={regalIdValid} />
     

      <Text style={{ fontSize: RFPercentage(1.8), marginBottom: 5 }}>
        Regal Name*
      </Text>
      <View style={{ marginBottom: 10 }}>
        <TextInput style={inputStyle} value={name} onChangeText={setName} />
      </View>

      <Text style={{ fontSize: RFPercentage(1.8), marginBottom: 5 }}>
        Fach Name*
      </Text>
      <View style={{ marginBottom: 10 }}>
        <TextInput style={inputStyle} value={fach} onChangeText={setFach} />
      </View>
      <View style={{ marginTop: 50, alignItems: "center" }}>
         <ActionButton FertigCallBack={handleSubmit}  isDone={regalIdValid&&name&&fach}  CancelCallBack={()=>{ if (navigation.canGoBack()) {
                navigation.goBack();
              }}}/>
      </View>
    
    </View>
  );
}
