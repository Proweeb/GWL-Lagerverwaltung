import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../../components/styles.js";
import ArtikelVorschau from "../../../components/oneTimeUse/ArtikelVorschau.js";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
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
import { ToastMessages, EmailBodies, logTypes } from "../../../components/enum.js";
import * as Progress from "react-native-progress";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { composeEmailWithDefault } from '../../../components/utils/Functions/emailUtils';

const PreviewScreen = ({ changedMenge, setChangedMenge }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [artikelList, setArtikelList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingBar, setLoadingBar] = useState();
  const [loadingVisible, setLoadingVisible] = useState(false);

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
        { beschreibung: logTypes.EndeInventur },
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

      await handleSendEmail(fileUri);
    } catch (error) {
      console.error("Fehler beim Exportieren per E-Mail:", error);
     Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.EXPORT_ERROR
      });
    }
  };

  const handleSendEmail = async (fileUri) => {
    try {
      await composeEmailWithDefault({
        subject: "Inventur Export",
        body: EmailBodies.INVENTUR_EXPORT,
        attachments: [fileUri]
      });
      Toast.show({
        type: "success",
        text1: "Email wurde gesendet",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.SEND_EMAIL_ERROR
      });
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
          await ArtikelBesitzerService.inventurUpdateArtikelBesitzerByGwIdAndRegalId(
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

  const handleGesamtmenge = async () => {
    try {
      for (const item of artikelList) {
        // Process items sequentially instead of in parallel
        const artikel_id = item._raw.gw_id;
        const artikel = await item.artikel.fetch();

        // Use database.read() for read operations
        const artikelBesitzer = await database.read(async () => {
          return await database
            .get("artikel_besitzer")
            .query(Q.where("gw_id", artikel_id))
            .fetch();
        });

        let menge = 0;
        for (const besitzer of artikelBesitzer) {
          menge += Number(besitzer.menge);
        }
        await ArtikelService.updateInventurArtikel(artikel.gwId, {
          menge: menge,
        });
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mengen:", error);
      Alert.alert("Mengen konnten nicht aktualisiert werden.");
    }
  };

  const handleConfirm = async () => {
    setLoadingVisible(true);
    try {
      await handleUpdateMenge();
      setLoadingBar(0.4);
      await handleGesamtmenge();
      setLoadingBar(1);
      await handleExportToEmail();
      setChangedMenge({});

      Toast.show({
        type: "success",
        text1: ToastMessages.ERFOLG,
        text2: ToastMessages.INVENTUR_ABGESCHLOSSEN,
        position: "bottom",
      });

      navigation.navigate("Tabs", {
        screen: "Inventur",
        params: { screen: "startinventur" },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.INVENTUR_NICHT_ABGESCHLOSSEN + " " + error,
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
          marginBottom: 5,
        }}
      >
        <ActionButton
          isDone={false}
          CancelCallBack={() =>
            navigation.navigate("Tabs", {
              screen: "Inventur",
              params: { screen: "inventurscreen" },
            })
          }
        />
        <View style={{ width: 25 }}></View>
        <ActionButton
          isDone={true}
          FertigCallBack={() => setModalVisible(true)}
        />
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {loadingVisible ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Progress.Bar
              progress={loadingBar}
              width={widthPercentageToDP(80)}
              height={8}
              color="#dcebf9"
            />
          </View>
        ) : (
          <ConfirmPopup
            colorCallback={handleConfirm}
            greyCallback={() => {
              Toast.show({
                type: "warning",
                text1: ToastMessages.WARNING,
                text2: ToastMessages.INVENTURLISTE_NICHT_GESENDET,
                position: "bottom",
              });
              setModalVisible(false);
            }}
            text={"Sind Sie sicher, dass Sie die Inventur abschließen möchten?"}
          />
        )}
      </Modal>
    </View>
  );
};

export default PreviewScreen;
