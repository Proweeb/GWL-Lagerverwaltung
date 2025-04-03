import React, { useState, useEffect } from "react";
import { Text, View, Button,  StyleSheet } from "react-native";
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
    <View style={{flex:1,backgroundColor: styles.backgroundColor }}>
      <View style={localStyles.settingsContainer}>
        <Text style={localStyles.settingsTitle}>Einstellungen</Text>

        <View style={localStyles.settingSection}>
          <Text style={localStyles.settingLabel}>Trigger DB:</Text>
          <View style={localStyles.pickerContainer}>
            <Picker
              selectedValue={settings.TriggerDB}
              onValueChange={(value) => updateSetting("TriggerDB", value)}
              style={localStyles.picker}
              dropdownIconColor={styles.textColor}
              itemStyle={localStyles.pickerItem}
            >
              {triggerOptions.map((option) => (
                <Picker.Item 
                  key={option} 
                  label={option} 
                  value={option}
                  color={styles.textColor}
                  style={localStyles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={localStyles.settingSection}>
          <Text style={localStyles.settingLabel}>Trigger Track List:</Text>
          <View style={localStyles.pickerContainer}>
            <Picker
              selectedValue={settings.TriggerTrackList}
              onValueChange={(value) => updateSetting("TriggerTrackList", value)}
              style={localStyles.picker}
              dropdownIconColor={styles.textColor}
              itemStyle={localStyles.pickerItem}
            >
              {triggerOptions.map((option) => (
                <Picker.Item 
                  key={option} 
                  label={option} 
                  value={option}
                  color={styles.textColor}
                  style={localStyles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>

        <Button
          title="Auf Standardwerte zurücksetzen"
          onPress={() => updateSetting("TriggerDB", "wöchentlich")}
          color={localStyles.primaryColor}
        />
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    padding: 20,
    flex: 1,
  },
  settingsTitle: {
   
    fontWeight: "bold",
    marginBottom: 20,
    color: styles.textColor,
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: styles.textColor,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: styles.borderColor,
    borderRadius: 8,
    backgroundColor: styles.backgroundColor,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    padding: 10,
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
  },
});
