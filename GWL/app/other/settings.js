import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from "react-native";
import { database } from "../../database/database";
import { styles } from "../../components/styles";
import Toast from "react-native-toast-message";
import Options from "../../components/Modals/Options";
import { ToastMessages } from "../../components/enum"

const defaultSettings = {
  email: "",
  backUpDBReminder: "Alle 3 Wochen",
  backupLogsReminder: "Alle 3 Wochen",
  lastBackupDB: null,
  lastBackupLogs: null,
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState(defaultSettings);
  const [showOptions, setShowOptions] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const reminderOptions = [
    "Täglich",
    "Alle 2 Wochen",
    "Alle 3 Wochen",
    "Monatlich",
    "Alle 3 Monate",
    "Nie",

  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedSettings = await database.localStorage.get("settings");
        let parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};
        const updatedSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(updatedSettings);

        if (JSON.stringify(updatedSettings) !== JSON.stringify(parsedSettings)) {
          await database.localStorage.set("settings", JSON.stringify(updatedSettings));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await database.localStorage.set("settings", JSON.stringify(newSettings));
  };

  const handleReset = async () => {
    await database.localStorage.set("settings", JSON.stringify(defaultSettings));
    setSettings(defaultSettings);
    Toast.show({
      type:"success",
      text1:ToastMessages.ERFOLG,
      text2: ToastMessages.SETTINGS_RESET,
      position:"bottom"
    });
  };

  const handleSave = async () => {
    try {
      await database.localStorage.set("settings", JSON.stringify(settings));
      Toast.show({
        type: 'success',
        text1:ToastMessages.ERFOLG,
        text2: ToastMessages.SETTINGS_SAVED,
           position:"bottom"
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.SETTINGS_ERROR,
           position:"bottom"
      });
    }
  };

  const handleOpenOptions = (settingType) => {
    setCurrentSetting(settingType);
    setShowOptions(true);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value) => {
    setIsValidEmail(validateEmail(value));
    updateSetting("email", value);
  };

  const formatDate = (date) => {
    if (!date) return "Noch keine Erinnerung";
    return new Date(date).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={localStyles.container}>

      
      <View style={localStyles.section}>
        <Text style={localStyles.sectionTitle}>Allgemein</Text>
        
        <View style={localStyles.inputContainer}>
          <Text style={localStyles.label}>E-Mail</Text>
          <TextInput
            style={[
              localStyles.input,
              !isValidEmail && settings.email && { color: 'red' }
            ]}
            value={settings.email}
            onChangeText={handleEmailChange}
            placeholder="E-Mail eingeben"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        <View style={localStyles.inputContainer}>
          <Text style={localStyles.label}>Datenbank-Backup Erinnerung</Text>
          <TouchableOpacity 
            style={localStyles.input}
            onPress={() => handleOpenOptions("backUpDBReminder")}
          >
            <Text>{settings.backUpDBReminder}</Text>
          </TouchableOpacity>
          <Text style={localStyles.lastBackup}>
            Letzte Erinnerung: {formatDate(settings.lastBackupDB)}
          </Text>
        </View>

        <View style={localStyles.inputContainer}>
          <Text style={localStyles.label}>Protokoll-Backup Erinnerung</Text>
          <TouchableOpacity 
            style={localStyles.input}
            onPress={() => handleOpenOptions("backupLogsReminder")}
          >
            <Text>{settings.backupLogsReminder}</Text>
          </TouchableOpacity>
          <Text style={localStyles.lastBackup}>
            Letzte Erinnerung: {formatDate(settings.lastBackupLogs)}
          </Text>
        </View>

        <View style={localStyles.buttonContainer}>
          <TouchableOpacity 
            style={[localStyles.button, localStyles.resetButton]} 
            onPress={handleReset}
          >
            <Text style={[localStyles.buttonText, {color:"#323232"}]}>Zurücksetzen</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[localStyles.button, localStyles.saveButton]} 
            onPress={handleSave}
          >
            <Text style={[localStyles.buttonText, {color:styles.lightBlue}]}>Speichern</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
        statusBarTranslucent={true}
      >
        <Options
          options={reminderOptions}
          setSelected={(option) => {
            if (currentSetting) {
              updateSetting(currentSetting, option);
            }
            setShowOptions(false);
          }}
          onClose={() => setShowOptions(false)}
        />
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styles.backgroundColor,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    backgroundColor: styles.backgroundColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#666',
  },
  input: {
    backgroundColor: styles.white,
    elevation: 5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 45,
    justifyContent: 'center',
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: styles.white,
  },
  picker: {
    backgroundColor: styles.backgroundColor,
  },
  pickerItem: {
    fontSize: 16,
    backgroundColor: styles.white,
  },
  buttonContainer: {
    marginTop:15,
    gap: 8,
  },
  button: {
    padding: 9,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#D9D9D9',
    elevation: 0,
   
  },
  saveButton: {
    backgroundColor: styles.lightLightBlue,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  lastBackup: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic'
  },
});
