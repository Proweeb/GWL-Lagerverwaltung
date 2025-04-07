import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx/xlsx.mjs";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import { styles } from "../../../components/styles";
import Toast from "react-native-toast-message";
import { ToastMessages, EmailBodies } from "../../../components/enum";
import * as Progress from "react-native-progress";
import { widthPercentageToDP } from "react-native-responsive-screen";
import LogService from "../../../database/datamapper/LogHelper";
import { logTypes } from "../../../components/enum";
import { composeEmailWithDefault } from "../../../components/utils/Functions/emailUtils";
XLSX.set_fs(FileSystem);

const ExportScreen = () => {
  const [fileName, setFileName] = useState("");
  const [ExportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const getDefaultFileName = () => {
    if (fileName != "") {
      return fileName + ".xlsx";
    }

    const now = new Date();
    return `export_${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}.xlsx`;
  };

  const exportData = async () => {
    setIsExporting(true);
    try {
      // Fetch all data
      const regale = await RegalService.getAllRegal();
      setExportProgress(10);
      const artikel = await ArtikelService.getAllArtikel();
      setExportProgress(20);
      const artikelBesitzer =
        await ArtikelBesitzerService.getAllArtikelOwners();
      setExportProgress(30);
      if (!regale.length && !artikel.length && !artikelBesitzer.length) {
        Alert.alert("Fehler", "Keine Daten zum Exportieren vorhanden.");
        return;
      }
      setExportProgress(40);
      // Format "Regale" sheet data
      const regalSheetStep = 10 / regale.length;
      const regalSheetData = regale.map((r, index) => {
        return {
          "Regal ID": r.regalId,
          "Regal Name": r.regalName,
          "Fach Name": r.fachName,
          "Erstellt am": new Date(r.createdAt).toLocaleDateString("de-DE"),
        };
      });
      const regalSheet = XLSX.utils.json_to_sheet(regalSheetData);

      // Format "Artikel" sheet data
      const artikelSheetStep = 20 / artikel.length;
      const artikelSheetData = artikel.map((a, index) => {
        return {
          GWID: a.gwId,
          FirmenID: a.firmenId,
          Beschreibung: a.beschreibung,
          Gesamtmenge: a.menge,
          Mindestmenge: a.mindestMenge,
          Kunde: a.kunde,
          Ablaufdatum: a.ablaufdatum
            ? new Date(a.ablaufdatum).toLocaleDateString("de-DE")
            : "",
        };
      });
      const artikelSheet = XLSX.utils.json_to_sheet(artikelSheetData);

      // Format "Lagerplan" sheet data
      const artikelBesitzerStep = 10 / artikelBesitzer.length;
      const lagerplanSheetData = await Promise.all(
        artikelBesitzer.map(async (ab, index) => {
          const artikel = await ab.artikel.fetch();
          const regal = await ab.regal.fetch();

          return {
            Beschreibung: artikel.beschreibung,
            GWID: artikel.gwId,
            "Regal ID": regal.regalId,
            "Regal Name": regal.regalName,
            Menge: ab.menge,
            "Zuletzt aktualisiert": new Date(ab.updatedAt).toLocaleDateString(
              "de-DE"
            ),
          };
        })
      );
      const lagerplanSheet = XLSX.utils.json_to_sheet(lagerplanSheetData);

      // Create workbook and append sheets
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, regalSheet, "Regale");
      XLSX.utils.book_append_sheet(workbook, artikelSheet, "Artikel");
      XLSX.utils.book_append_sheet(workbook, lagerplanSheet, "Lagerplan");
      setExportProgress(85);
      // Define export file name
      const exportFileName = getDefaultFileName();
      const fileUri = FileSystem.documentDirectory + exportFileName;

      // Convert workbook to base64 and save
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });
      setExportProgress(95);
      await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setExportProgress(100), setTimeout(() => {}, 10000);
      // Share the file

      // Toast.show({
      //   type: "success",
      //   text1: "Export",
      //   text2: "Erfolgreich Exportiert",
      // });
      await LogService.createLog(
        { beschreibung: logTypes.ExportDB },
        null,
        null
      );
      try {
        await composeEmailWithDefault({
          subject: `Datenbank Export ${new Date().toLocaleDateString("de-DE")}`,
          body: EmailBodies.DATABASE_EXPORT + EmailBodies.SIGNATURE,
          attachments: [fileUri],
        });
      } catch (error) {
        console.error("Error sending email:", error);
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.SEND_EMAIL_ERROR,
        });
      }
    } catch (error) {
      console.error("Fehler beim Export:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.EXPORT_ERROR,
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Excel Datei Exportieren</Text>
      <View style={styles.card}>
        <View style={styles.fileBox}>
          <TextInput
            placeholder={getDefaultFileName()}
            style={{ textAlign: "center" }}
            value={fileName}
            onChangeText={setFileName}
          />
        </View>
        {!isExporting ? (
          <TouchableOpacity
            style={[styles.buttonBlue, { backgroundColor: styles.lightRed }]}
            onPress={exportData}
          >
            <Text style={[styles.buttonTextLightBlue, { color: "red" }]}>
              Exportieren
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={ExportProgress / 100}
              color={styles.lightRed}
              width={widthPercentageToDP(80)}
              height={8}
            />
            <Text style={styles.progressText}>
              {Math.round(ExportProgress).toFixed(0)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ExportScreen;

// ... rest of the component ...
