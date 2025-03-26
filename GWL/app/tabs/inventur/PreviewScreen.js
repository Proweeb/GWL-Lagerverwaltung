import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
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
import ConfirmPopup from "../../../components/utils/Modals/ConfirmPopUp.js";
import { database } from "../../../database/database.js";
import { Q } from "@nozbe/watermelondb/index.js";

const PreviewScreen = ({ changedMenge, setChangedMenge }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [artikelList, setArtikelList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  console.log(changedMenge);

  // useEffect(() => {
  //   if (gwId === "") {
  //     handleSearch();
  //   }
  // }, [gwId]); // Runs when `gwId` changes

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

      // Fetch data asynchronously and ensure it completes before proceeding
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

      // Convert data to Excel
      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Data");

      // Convert Excel data to Base64
      const excelOutput = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      // Create file path
      const formattedDate = new Date()
        .toLocaleString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(/[: ]/g, "_"); // Format file name to avoid illegal characters

      const fileName = `Inventur_${formattedDate}.xlsx`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write file to system
      await FileSystem.writeAsStringAsync(fileUri, excelOutput, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Ensure MailComposer is available
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Fehler", "E-Mail kann nicht gesendet werden.");
        return;
      }

      // Send email with attachment
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

        const combinedId = `${artikel_id}${regal_id}`; // Construct key
        if (changedMenge[combinedId]) {
          const newMenge = changedMenge[combinedId];
          await ArtikelBesitzerService.updateArtikelBesitzerByGwIdAndRegalId(
            {
              menge: Number(newMenge),
            },
            regal.regalId,
            artikel.gwId
          );
        }
      });

      await Promise.all(updates);

      // Refresh the list
      const artikelData = await ArtikelBesitzerService.getAllArtikelOwners();
      setArtikelList(artikelData);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mengen:", error);
      Alert.alert("Mengen konnten nicht aktualisiert werden.");
    }
  };

  const handleGesamtmenge = async () => {
    try {
      const updates = artikelList.map(async (item) => {
        const artikel_id = item._raw.gw_id;
        const artikel = await item.artikel.fetch();
        const artikelBesitzer = await database
          .get("artikel_besitzer")
          .query(Q.where("gw_id", artikel_id)) // Ensure "gwId" matches your schema
          .fetch();
        console.log(artikelBesitzer);
        let menge = 0;
        for (let i = 0; i < artikelBesitzer.length; i++) {
          menge += Number(artikelBesitzer[i].menge);
        }
        await ArtikelService.updateInventurArtikel(artikel.gwId, {
          menge: menge,
        });
      });
      await Promise.all(updates);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mengen:", error);
      Alert.alert("Mengen konnten nicht aktualisiert werden.");
    }
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    await handleUpdateMenge();
    await handleGesamtmenge();
    handleExportToEmail();
    setChangedMenge({});
    navigation.navigate("Tabs", {
      screen: "Inventur",
      params: { screen: "startinventur" },
    });
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
        ></ZurückButton>
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
          greyCallback={() => setModalVisible(false)}
          text={"Sind Sie sicher, dass Sie die Inventur abschließen möchten?"}
        ></ConfirmPopup>
      </Modal>
    </View>
  );
};
export default PreviewScreen;
