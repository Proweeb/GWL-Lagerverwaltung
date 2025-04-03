import React, { useState, useEffect } from "react";
import { Text, View, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { database } from "../../database/database";
import { styles } from "../../components/styles";
import Toast from "react-native-toast-message";

const defaultSettings = {
  TriggerDB: "wöchentlich",
  LastSendDB: Date.now(),
  TriggerTrackList: "wöchentlich",
  LastSendTrackList: Date.now(),
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState(defaultSettings);
  const triggerOptions = [
    "dreiwöchentlich",
    "zweiwöchentlich",
    "monatlich",
    "zweimonatlich",
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log(await database.localStorage);
        const storedSettings = await database.localStorage.get("settings");
        let parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};

        // Ensure all necessary properties exist
        const updatedSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(updatedSettings);

        // Save back if anything was missing
        if (
          JSON.stringify(updatedSettings) !== JSON.stringify(parsedSettings)
        ) {
          await database.localStorage.set(
            "settings",
            JSON.stringify(updatedSettings)
          );
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value, LastSendDB: Date.now() };
    setSettings(newSettings);
    await database.localStorage.set("settings", JSON.stringify(newSettings));
    Toast.show({
      text1: "Erfolgreich",
      text2: "Erfolgreich Einstellungen geändert",
    });
  };

  return (
    <View style={{ backgroundColor: styles.backgroundColor, flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Einstellungen</Text>

        <Text style={{ marginTop: 10 }}>Trigger DB:</Text>
        <Picker
          selectedValue={settings.TriggerDB}
          onValueChange={(value) => updateSetting("TriggerDB", value)}
          style={{ height: 50, width: 200 }}
        >
          {triggerOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>

        <Text style={{ marginTop: 10 }}>Trigger Track List:</Text>
        <Picker
          selectedValue={settings.TriggerTrackList}
          onValueChange={(value) => updateSetting("TriggerTrackList", value)}
          style={{ height: 50, width: 200 }}
        >
          {triggerOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>

        <Button
          title="Auf Standardwerte zurücksetzen"
          onPress={() => updateSetting("TriggerDB", "wöchentlich")}
        />
      </View>
    </View>
  );
}
