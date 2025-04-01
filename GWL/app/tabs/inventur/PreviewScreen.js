import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../../components/styles.js";
import ArtikelVorschau from "../../../components/oneTimeUse/ArtikelVorschau.js";
import ZurückButton from "../../../components/oneTimeUse/ZurückButton.js";
import FertigButton from "../../../components/utils/FertigButton.js";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import { useNavigation } from "@react-navigation/native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
import XLSX from "xlsx";
import LogService from "../../../database/datamapper/LogHelper.js";
import ConfirmPopup from "../../../components/Modals/ConfirmPopUp.js";
import { database } from "../../../database/database.js";
import { Q } from "@nozbe/watermelondb/index.js";
import Toast from "react-native-toast-message";

const PreviewScreen = ({ changedMenge, setChangedMenge }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [artikelList, setArtikelList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const artikelData = await ArtikelBesitzerService.getAllArtikelOwners();
        setArtikelList(artikelData);
      } catch (error) {
        console.error("Fehler beim Laden der Artikel:", error);
      }
    };
    fetchArtikel();
  }, []);

  const handleExportToEmail = async () => {
    try {
      await LogService.createLog(
        { beschreibung: "Inventurliste gesendet" },
        null,
        null
      );

      const dataForExcel = await Promise.all(
        artikelList.map(async (item) => {
          const artikel = await item.artikel.fetch();
          const regal = await item.regal.fetch();
          return {
            ID: artikel.gwId,
            Beschreibung: artikel.beschreibung,
            Regal: regal.regalId,
            Ist: changedMenge[item._raw.gw_id + "" + regal.id] || item.menge,
            Datum: new Date().toLocaleString("de-DE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
          };
        })
      );

      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Data");
      const excelOutput = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const formattedDate = new Date()
        .toLocaleString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/[: ]/g, "_");

      const fileName = `Inventur_${formattedDate}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, excelOutput, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Fehler", "E-Mail kann nicht gesendet werden.");
        return;
      }

      await MailComposer.composeAsync({
        subject: "Inventur Export",
        body: "Hier ist die exportierte Inventur-Datei.",
        attachments: [fileUri],
      });
    } catch (error) {
      console.error("Fehler beim Exportieren per E-Mail:", error);
      Alert.alert("Fehler", "Beim Export ist ein Problem aufgetreten.");
    }
  };

  const handleUpdateMenge = async () => {
    try {
      const updates = artikelList.map(async (item) => {
        const artikel_id = item._raw.gw_id;
        const regal_id = item._raw.regal_id;
        const artikel = await item.artikel.fetch();
        const regal = await item.regal.fetch();

        const combinedId = `${artikel_id}${regal_id}`;
        if (changedMenge[combinedId]) {
          const newMenge = changedMenge[combinedId];
          await ArtikelBesitzerService.updateArtikelBesitzerByGwIdAndRegalId(
            { menge: Number(newMenge) },
            regal.regalId,
            artikel.gwId
          );
        }
      });

      await Promise.all(updates);
      const artikelData = await ArtikelBesitzerService.getAllArtikelOwners();
      setArtikelList(artikelData);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mengen:", error);
      Alert.alert("Mengen konnten nicht aktualisiert werden.");
    }
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    try {
      await handleUpdateMenge();
      await handleExportToEmail();
      setChangedMenge({});

      Toast.show({
        type: "success",
        text1: "Inventur",
        text2: "Inventur erfolgreich abgeschlossen.",
        position: "bottom",
      });

      navigation.navigate("Tabs", {
        screen: "Inventur",
        params: { screen: "startinventur" },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Inventur",
        text2: "Fehler beim Abschließen der Inventur: " + error,
        position: "bottom",
      });
    }
  };

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        flex: 1,
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1 }}>
        <ArtikelVorschau
          artikelList={artikelList}
          changedMenge={changedMenge}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ZurückButton
          onPress={() =>
            navigation.navigate("Tabs", {
              screen: "Inventur",
              params: { screen: "inventurscreen" },
            })
          }
        />
        <FertigButton onPress={() => setModalVisible(true)} />
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ConfirmPopup
          colorCallback={handleConfirm}
          greyCallback={() => {
            Toast.show({
              type: "warning",
              text1: "Inventur",
              text2: "Inventur wurde abgebrochen.",
              position: "bottom",
            });
            setModalVisible(false);
          }}
          text={"Sind Sie sicher, dass Sie die Inventur abschließen möchten?"}
        />
      </Modal>
    </View>
  );
};

export default PreviewScreen;
