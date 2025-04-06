import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "../../components/styles";

import ActionGrid from "../../components/utils/ActionGrid";
import InventoryWidget from "../../components/utils/InventoryWidget";
import HomeWidget from "../../components/utils/HomeWidget/homeWidget";
import NotificationsWidget from "../../components/oneTimeUse/NotifcationsWidget";
import {
  checkExpiredItems,
  sendExpiryNotification,
} from "../../components/utils/Functions/expiryCheck";
import ConfirmPopup from "../../components/Modals/ConfirmPopUp";
import {
  checkBackupNeeded,
  performBackup,
} from "../../components/utils/Functions/backupCheck";
import { ToastMessages } from "../../components/enum";
import { useIsFocused } from "@react-navigation/native";
const actions = [
  [
    {
      screen: "ArtikelEinlagernNavigator",
      iconName: "cart-plus", // Represents storing an item
      iconType: "MaterialCommunityIcons",
      label: "Art.-Einlagern",
      route: "ArtikelEinlagernNavigator",
    },
    {
      screen: "ArtikelNachfüllenNavigator",
      iconName: "cart-heart", // Represents adding/refilling items
      iconType: "MaterialCommunityIcons",
      label: "Art.-Nachfüllen ",
      route: "ArtikelNachfüllenNavigator",
    },

    {
      screen: "ArtikelEntnehmenNavigator",
      iconName: "cart-minus", // Represents taking an item out
      iconType: "MaterialCommunityIcons",
      label: "Art.-Entnehmen",
      route: "ArtikelEntnehmenNavigator",
    },
  ],
  [
    {
      screen: "LagerNavigator",
      iconName: "warehouse", // Represents a warehouse
      iconType: "MaterialCommunityIcons",
      label: "Lager-Verwalten",
      route: "LagerNavigator",
    },
    {
      screen: "PlatzHinzufügenNavigator",
      iconName: "package-variant-closed", // Represents adding a storage location
      iconType: "MaterialCommunityIcons",
      label: "LP-Hinzufügen",
      route: "PlatzHinzufügenNavigator",
    },
    {
      screen: "ArtikelPlatzHinzufügenNavigator",
      iconName: "package-variant", // Represents assigning an item to a place
      iconType: "MaterialCommunityIcons",
      label: "Art. & LP-Ergänzen",
      route: "ArtikelPlatzHinzufügenNavigator",
    },
  ],
];

export default function HomeScreen() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showExpiryConfirm, setShowExpiryConfirm] = useState(false);
  const [expiredItems, setExpiredItems] = useState(null);
  const [showBackupConfirm, setShowBackupConfirm] = useState(false);
  const [backupTypes, setBackupTypes] = useState([]);
  const isFocused = useIsFocused();
  const [settings, setSettings] = useState({
    backUpDBReminder: "Alle 3 Wochen",
    backupLogsReminder: "Alle 3 Wochen",
    lastBackupDB: null,
    lastBackupLogs: null,
  });

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem("settings");
      let parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};

      // Initialize last backup dates if they're null
      if (!parsedSettings.lastBackupDB) {
        parsedSettings.lastBackupDB = new Date().toISOString();
      }
      if (!parsedSettings.lastBackupLogs) {
        parsedSettings.lastBackupLogs = new Date().toISOString();
      }

      setSettings(parsedSettings);

      // Check for needed backups after settings are loaded
      const checkBackups = async () => {
        try {
          const needsDB = await checkBackupNeeded(
            parsedSettings.backUpDBReminder,
            parsedSettings.lastBackupDB
          );
          const needsLogs = await checkBackupNeeded(
            parsedSettings.backupLogsReminder,
            parsedSettings.lastBackupLogs
          );

          const types = [];
          if (needsDB) types.push("DB");
          if (needsLogs) types.push("Logs");

          if (types.length > 0) {
            setBackupTypes(types);
            setShowBackupConfirm(true);
          }
        } catch (error) {
          console.error("Error checking backups:", error);
        }
      };

      checkBackups();
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Cleanup listeners when component unmounts
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const checkForExpiredItems = async () => {
      const items = await checkExpiredItems();
      if (items && items.length > 0) {
        setExpiredItems(items);
        setShowExpiryConfirm(true);
      }
    };

    checkForExpiredItems();
    loadSettings();
  }, [isFocused]);

  const handleExpiryConfirm = async () => {
    try {
      await sendExpiryNotification(expiredItems);
      setShowExpiryConfirm(false);
      Toast.show({
        type: "success",
        text1: ToastMessages.ERFOLG,
        text2: ToastMessages.EXPIRED_ITEMS_SENT,
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.SEND_EMAIL_ERROR,
        position: "bottom",
      });
    }
  };

  const handleBackupConfirm = async (confirmed) => {
    setShowBackupConfirm(false);
    if (!confirmed) return;

    try {
      const newSettings = { ...settings };
      let backupPerformed = false;

      if (backupTypes.length > 0) {
        await performBackup(backupTypes.map((type) => type.toLowerCase()));

        if (backupTypes.includes("DB")) {
          newSettings.lastBackupDB = new Date().toISOString();
        }
        if (backupTypes.includes("Logs")) {
          newSettings.lastBackupLogs = new Date().toISOString();
        }

        backupPerformed = true;
      }

      if (backupPerformed) {
        setSettings(newSettings);
        await AsyncStorage.setItem("settings", JSON.stringify(newSettings));

        Toast.show({
          type: "success",
          text1: ToastMessages.ERFOLG,
          text2: ToastMessages.BACKUP_SUCCESS,
          position: "bottom",
        });
      }
    } catch (error) {
      console.error("Error performing backup:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.BACKUP_ERROR,
        position: "bottom",
      });
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: 20,

          backgroundColor: styles.backgroundColor,
        },
        Dimensions.get("screen").width > 599 && {
          paddingHorizontal: 100,
        },
      ]}
    >
      <HomeWidget
        flexValue={0.9}
        containerFlex={0.7}
        title={"Ablaufwarnung"}
        containerStyle={[{ alignItems: "center", flex: 1, width: "100%" }]}
      >
        {!keyboardVisible && <NotificationsWidget />}
      </HomeWidget>
      <HomeWidget
        flexValue={0.95}
        containerFlex={1}
        title={"Aktionen"}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <ActionGrid actions={actions} />
      </HomeWidget>
      <HomeWidget
        flexValue={0.8}
        containerFlex={1}
        title={"Lagerbewegungen"}
        containerStyle={{
          padding: 0,
          paddingVertical: Dimensions.get("screen").height < 800 ? 20 : 25,
          paddingHorizontal: 35,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <InventoryWidget></InventoryWidget>
      </HomeWidget>

      <Modal
        visible={showExpiryConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExpiryConfirm(false)}
      >
        <ConfirmPopup
          text={`Es wurden ${expiredItems?.length} Artikel mit erreichtem Ablaufdatum gefunden. Soll eine E-Mail-Benachrichtigung versendet werden?`}
          greyCallback={() => setShowExpiryConfirm(false)}
          colorCallback={handleExpiryConfirm}
        />
      </Modal>

      <Modal
        visible={showBackupConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBackupConfirm(false)}
        statusBarTranslucent={true}
      >
        <ConfirmPopup
          title="Backup erforderlich"
          text={`Es ist Zeit für ${
            backupTypes.length > 1 ? "folgende Backups" : "ein Backup"
          }:${backupTypes
            .map(
              (type) =>
                `\n- ${type === "DB" ? "Datenbank" : "Protokoll"} Backup`
            )
            .join("")}\n\nMöchten Sie jetzt die Backups erstellen?`}
          colorCallback={() => handleBackupConfirm(true)}
          greyCallback={() => handleBackupConfirm(false)}
        />
      </Modal>
    </View>
  );
}
