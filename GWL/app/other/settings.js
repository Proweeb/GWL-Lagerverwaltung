import React, { useState, useEffect } from "react";
import { Text, View, Button,  StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { database } from "../../database/database";
import { styles } from "../../components/styles";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";

const defaultSettings = {
  TriggerDB: "wöchentlich",
  LastSendDB: Date.now(),
  TriggerTrackList: "wöchentlich",
  LastSendTrackList: Date.now(),
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState(defaultSettings);
  const triggerOptions = [
    "Alle 3 Wochen",
    "Alle 2 Wochen",
    "Monatlich",
    "Alle 2 Monate",
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
      
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
  
  };

  return (
    <View style={{flex:1,backgroundColor: styles.backgroundColor }}>
      <View style={localStyles.settingsContainer}>
     
 
    
        <View style={localStyles.settingSection}>
    
        <Text style={{ fontSize: RFPercentage(1.8) }}>Wann soll die Datenbank verschickt werden?</Text>
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

          <View style={localStyles.internalDivider} />

          <Text style={{ fontSize: RFPercentage(1.8) }}>Wann soll die Trackliste verschickt werden?</Text>
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
       <View style={localStyles.buttonContainer}>
        <Button  
          title="Auf Standardwerte zurücksetzen"
          onPress={() => updateSetting("TriggerDB", "wöchentlich")}
          color={styles.blue}
        />
       </View>
        </View>

        
     
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: styles.textColor,
  },
  settingSection: {
    marginBottom: 20,
    backgroundColor: styles.backgroundColor,
    padding: 15,
    borderRadius: 10,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: styles.textColor,

  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: styles.white,
   
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: styles.white,
    color: styles.textColor,
  },
  pickerItem: {
    fontSize: 16,
    padding: 10,
    backgroundColor: styles.white,
    color: styles.textColor,
  },
  divider: {
    height: 2,
    backgroundColor: styles.primaryColor,
    marginVertical: 20,
    opacity: 0.5,
  },
  primaryColor: {
    backgroundColor: styles.primaryColor,
  },
  internalDivider: {
    height: 1,
    backgroundColor: styles.borderColor,
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
