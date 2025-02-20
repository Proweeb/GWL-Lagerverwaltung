import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { Component, useState } from "react";
import RegalService from "../../../database/datamapper/RegalHelper";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../components/styles";
import TextInputField from "../artikelEinlagern/textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useEffect } from "react";

export default function IndexScreen() {
  const [name, setName] = useState("");
  const [fach, setFach] = useState("");
  const [code, setCode] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      if (!name || !fach || !code) {
        Alert.alert(
          "Fehlende Angaben",
          "Bitte fülle alle Felder aus, bevor du speicherst."
        );
        return;
      }

      const regalData = {
        regalId: code,
        fachName: fach,
        regalName: name,
      };

      await RegalService.createRegal(regalData);
      Alert.alert(
        "Erfolgreich gespeichert!",
        `Das Regal wurde mit folgenden Daten angelegt:\n\n📌 Name: ${name}\n📦 Fach: ${fach}\n🔢 Code: ${code}`
      );
      navigation.navigate("Home");
      console.log("Regal erfolgreich erstellt.");
      const regal = await RegalService.getRegalById(code);
      console.log(regal);
    } catch (error) {
      console.error("Fehler beim Speichern des Regals: ", error);
      Alert.alert(
        "Speicherung fehlgeschlagen",
        "Das Regal konnte nicht gespeichert werden. Bitte überprüfe deine Eingaben und versuche es erneut."
      );
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
      <Text style={{ fontSize: RFPercentage(1.8), marginBottom: 5 }}>
        Regal Name
      </Text>
      <View style={{ marginBottom: 10 }}>
        <TextInput style={inputStyle} value={name} onChangeText={setName} />
      </View>

      <Text style={{ fontSize: RFPercentage(1.8), marginBottom: 5 }}>
        Fach Name
      </Text>
      <View style={{ marginBottom: 10 }}>
        <TextInput style={inputStyle} value={fach} onChangeText={setFach} />
      </View>

      <Text style={{ fontSize: RFPercentage(1.8), marginBottom: 5 }}>
        RegalID
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <View style={{ flex: 1 }}>
          <TextInput style={inputStyle} value={code} onChangeText={setCode} />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Scan", {
              onScan: (code) => {
                setCode(code);
              },
            });
          }}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#ffffff",
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
        >
          <Text style={{ color: "black", fontSize: 20 }}>[III]</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#dcebf9",
            padding: 10,
            borderRadius: 5,
            height: 50,
            width: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#30A6DE", fontSize: 20 }}>Fertig</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
