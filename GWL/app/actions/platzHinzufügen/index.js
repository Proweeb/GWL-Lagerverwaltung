import { Text, View, TextInput, Button, Alert, TouchableOpacity} from "react-native";
import React, { useState } from "react";
import RegalService from "../../../database/datamapper/RegalHelper";



export default function IndexScreen() {
  const [name, setName] = useState("");
  const [fach, setFach] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    try {
      if (!name || !fach || !code) {
        Alert.alert("Fehlende Angaben", "Bitte fülle alle Felder aus, bevor du speicherst.");
        return;
      }

      const regalData = {
        regalId: code,
        fachName: fach,
        regalName: name,
      };

      await RegalService.createRegal(regalData);
      Alert.alert("Erfolgreich gespeichert!", `Das Regal wurde mit folgenden Daten angelegt:\n\n📌 Name: ${name}\n📦 Fach: ${fach}\n🔢 Code: ${code}`);

      console.log("Regal erfolgreich erstellt.");
      const regal = await RegalService.getRegalById(code);
      console.log(regal);
    } catch (error) {
      console.error("Fehler beim Speichern des Regals: ", error);
      Alert.alert("Speicherung fehlgeschlagen", "Das Regal konnte nicht gespeichert werden. Bitte überprüfe deine Eingaben und versuche es erneut.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Profile Form</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width: "100%", marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1, width: "100%", marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Enter Fach"
        value={fach}
        onChangeText={setFach}
      />
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
          placeholder="Enter Code"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          onPress={() => router.push("/(scan)/barcode")}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#87CEEB",
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

