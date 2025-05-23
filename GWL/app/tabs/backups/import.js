import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import * as XLSX from "xlsx";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import { styles } from "../../../components/styles";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import LogService from "../../../database/datamapper/LogHelper";
import {
  stringToDate,
  parseCustomDate,
} from "../../../components/utils/Functions/parseDate";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from react-navigation
import { database } from "../../../database/database";
import { FlashList } from "@shopify/flash-list";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import { logTypes } from "../../../components/enum";
import ConfirmPopup from "../../../components/Modals/ConfirmPopUp";
import Toast from "react-native-toast-message";
import * as Progress from "react-native-progress";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { ToastMessages, EmailBodies } from "../../../components/enum";
import { composeEmailWithDefault } from "../../../components/utils/Functions/emailUtils";

const ImportScreen = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle file picker for Excel files
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      if (result.canceled) return;
      setSelectedFile(result.assets[0]);
      parseExcel(result.assets[0]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.DATEIFEHLER,
        position: "bottom",
        autoHide: false,
      });
    }
  };

  // Parse the selected Excel file
  const parseExcel = async (file) => {
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        let allSheetsData = {};
        let allErrors = [];

        console.log("=== DEBUG: Excel Parsing ===");
        console.log("Found sheets:", workbook.SheetNames);

        const validateNumber = (value, fieldName, rowIndex, sheetName) => {
          const num = Number(value);
          if (isNaN(num)) {
            allErrors.push({
              sheet: sheetName,
              row: rowIndex + 1,
              field: fieldName,
              value: value,
              error: `Muss eine Zahl sein`,
            });
            return false;
          }
          return true;
        };

        const validateDate = (value, fieldName, rowIndex, sheetName) => {
          try {
            // Normalize the date string to use dots as separators
            const normalizedDate = value.replace(/\//g, ".");

            // Try both date formats
            const date1 = stringToDate(normalizedDate, "dd.MM.yyyy", ".");
            const date2 = stringToDate(normalizedDate, "d.M.yyyy", ".");

            if (!isNaN(date1.getTime()) || !isNaN(date2.getTime())) {
              return true;
            }

            allErrors.push({
              sheet: sheetName,
              row: rowIndex + 1,
              field: fieldName,
              value: value,
              error: `Ungültiges Datum`,
            });
            return false;
          } catch (error) {
            allErrors.push({
              sheet: sheetName,
              row: rowIndex + 1,
              field: fieldName,
              value: value,
              error: `Ungültiges Datumsformat (erwartet: dd.MM.yyyy oder d.M.yyyy oder d/M/yyyy)`,
            });
            return false;
          }
        };

        const validateRequired = (value, fieldName, rowIndex, sheetName) => {
          if (!value || value.trim() === "") {
            allErrors.push({
              sheet: sheetName,
              row: rowIndex + 1,
              field: fieldName,
              value: value,
              error: `Pflichtfeld`,
            });
            return false;
          }
          return true;
        };

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          console.log(`Processing sheet: ${sheetName}`);

          let parsedData = XLSX.utils.sheet_to_json(sheet);
          console.log(
            `Raw parsed data for ${sheetName}:`,
            JSON.stringify(parsedData, null, 2)
          );

          if (parsedData.length > 0) {
            try {
              parsedData = parsedData.map((row, index) => {
                const processedRow = { ...row };

                // Convert all values to strings first
                Object.entries(row).forEach(([key, value]) => {
                  processedRow[key] = String(value);
                });

                // Validate fields based on sheet type
                switch (sheetName) {
                  case "Regale":
                    validateRequired(
                      processedRow["Regal ID"],
                      "Regal ID",
                      index,
                      sheetName
                    );
                    validateRequired(
                      processedRow["Regal Name"],
                      "Regal Name",
                      index,
                      sheetName
                    );
                    validateRequired(
                      processedRow["Fach Name"],
                      "Fach Name",
                      index,
                      sheetName
                    );
                    if (processedRow["Erstellt am"]) {
                      validateDate(
                        processedRow["Erstellt am"],
                        "Erstellt am",
                        index,
                        sheetName
                      );
                    }
                    break;

                  case "Artikel":
                    validateRequired(
                      processedRow["GWID"],
                      "GWID",
                      index,
                      sheetName
                    );
                    validateRequired(
                      processedRow["Firmen ID"],
                      "Firmen ID",
                      index,
                      sheetName
                    );
                    if (processedRow["Gesamtmenge"]) {
                      validateNumber(
                        processedRow["Gesamtmenge"],
                        "Gesamtmenge",
                        index,
                        sheetName
                      );
                    }
                    if (processedRow["Mindestmenge"]) {
                      validateNumber(
                        processedRow["Mindestmenge"],
                        "Mindestmenge",
                        index,
                        sheetName
                      );
                    }
                    if (processedRow["Ablaufdatum"]) {
                      console.log(processedRow["Ablaufdatum"]);
                      validateDate(
                        processedRow["Ablaufdatum"],
                        "Ablaufdatum",
                        index,
                        sheetName
                      );
                    }
                    break;

                  case "Lagerplan":
                    validateRequired(
                      processedRow["Regal ID"],
                      "Regal ID",
                      index,
                      sheetName
                    );
                    validateRequired(
                      processedRow["GWID"],
                      "GWID",
                      index,
                      sheetName
                    );
                    if (processedRow["Menge"]) {
                      validateNumber(
                        processedRow["Menge"],
                        "Menge",
                        index,
                        sheetName
                      );
                    }
                    if (processedRow["Zuletzt aktualisiert"]) {
                      validateDate(
                        processedRow["Zuletzt aktualisiert"],
                        "Zuletzt aktualisiert",
                        index,
                        sheetName
                      );
                    }
                    break;
                }

                return processedRow;
              });
              allSheetsData[sheetName] = parsedData;
            } catch (error) {
              console.error(`Error processing sheet ${sheetName}:`, error);
              allErrors.push({
                sheet: sheetName,
                row: "All",
                field: "General",
                value: "",
                error: error.message,
              });
            }
          }
        });

        // If there are any errors, display them all at once
        if (allErrors.length > 0) {
          const errorMessage = allErrors
            .map(
              (error) =>
                `Blatt: ${error.sheet}\n` +
                `Zeile: ${error.row}\n` +
                `Feld: ${error.field}\n` +
                `Wert: ${error.value}\n` +
                `Fehler: ${error.error}\n` +
                "-------------------"
            )
            .join("\n\n");

          setValidationErrors(allErrors);
          setModalVisible(true);
          return;
        }

        console.log("=== END Excel Parsing DEBUG ===");

        if (Object.keys(allSheetsData).length > 0) {
          setJsonData(allSheetsData);
        } else {
          Toast.show({
            type: "error",
            text1: ToastMessages.ERROR,
            text2: ToastMessages.NO_DATEI,
            position: "bottom",
            autoHide: false,
          });
        }
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Excel parsing error:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.VERARBEITUNGSFEHLER,
        position: "bottom",
        autoHide: false,
      });
    }
  };

  const createBackupFile = async () => {
    try {
      const regale = await RegalService.getAllRegal();
      const artikel = await ArtikelService.getAllArtikel();
      const artikelBesitzer =
        await ArtikelBesitzerService.getAllArtikelOwners();

      if (!regale.length && !artikel.length && !artikelBesitzer.length) {
        throw new Error("Keine Daten zum Exportieren vorhanden.");
      }

      // Format "Regale" sheet data
      const regalSheetData = regale.map((r) => ({
        "Regal ID": r.regalId,
        "Regal Name": r.regalName,
        "Fach Name": r.fachName,
        "Erstellt am": new Date(r.createdAt).toLocaleDateString("de-DE"),
      }));
      const regalSheet = XLSX.utils.json_to_sheet(regalSheetData);

      // Format "Artikel" sheet data
      const artikelSheetData = artikel.map((a) => ({
        GWID: a.gwId,
        "Firmen ID": a.firmenId,
        Beschreibung: a.beschreibung,
        Gesamtmenge: a.menge,
        Mindestmenge: a.mindestMenge,
        Kunde: a.kunde,
        Ablaufdatum: a.ablaufdatum
          ? new Date(a.ablaufdatum).toLocaleDateString("de-DE")
          : "",
      }));
      const artikelSheet = XLSX.utils.json_to_sheet(artikelSheetData);

      // Format "Lagerplan" sheet data
      const lagerplanSheetData = await Promise.all(
        artikelBesitzer.map(async (ab) => {
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

      // Define backup file name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFileName = `backup_${timestamp}.xlsx`;
      const fileUri = FileSystem.documentDirectory + backupFileName;

      // Convert workbook to base64 and save
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });

      await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return fileUri;
    } catch (error) {
      console.error("Fehler beim Erstellen des Backups:", error);
      throw error;
    }
  };

  const sendBackupEmail = async () => {
    try {
      const backupFileUri = await createBackupFile();

      await composeEmailWithDefault({
        subject: `Datenbank Backup ${new Date().toLocaleDateString("de-DE")}`,
        body: EmailBodies.DATABASE_BACKUP + EmailBodies.SIGNATURE,
        attachments: [backupFileUri],
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.SEND_EMAIL_ERROR,
      });
      return false;
    }
  };

  const handleImport = async () => {
    if (!jsonData) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.NO_DATA_FOR_IMPORT,
        position: "bottom",
        autoHide: false,
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmImport = async () => {
    try {
      setShowConfirm(false); // Close the confirmation popup
      setIsImporting(true);
      setImportProgress(0);

      // First try to send backup email
      await sendBackupEmail();

      // Then proceed with import
      console.log("=== DEBUG: Full JSON Data Structure ===");
      console.log("Available sheets:", Object.keys(jsonData));
      console.log("Regale data:", JSON.stringify(jsonData.Regale, null, 2));
      console.log("Artikel data:", JSON.stringify(jsonData.Artikel, null, 2));
      console.log("=== END DEBUG ===");

      console.log("Backup der aktuellen Datenbank wird erstellt...");
      setImportProgress(5);
      const backup = await backupDatabase();

      setImportProgress(10);

      console.log("Bestehende Datenbank wird gelöscht...");
      setImportProgress(15);

      console.log("Log erstellt für Import");
      await DBdeleteAllData();
      await LogService.createLog(
        { beschreibung: logTypes.StartImportDB },
        null,
        null
      );

      console.log("Neue Datenbank wird erstellt und Daten importiert...");
      setImportProgress(20);
      await insertData(jsonData);

      console.log("Log erstellt für Import");
      setImportProgress(95);
      await LogService.createLog(
        { beschreibung: logTypes.ImportDB },
        null,
        null
      );

      console.log("Daten erfolgreich importiert!");
      Toast.show({
        type: "success",
        text1: ToastMessages.ERFOLG,
        text2: ToastMessages.DATA_SUCCESS,
        position: "bottom",
        autoHide: true,
      });

      setSelectedFile(null);
      setJsonData(null);
    } catch (error) {
      console.error("Fehler beim Import:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: error.message,
        position: "bottom",
        autoHide: false,
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  // Backup existing database data
  const DBdeleteAllData = async () => {
    try {
      await database.write(async () => {
        // Delete all existing records from tables
        const tables = ["artikel", "regale", "artikel_besitzer"];
        const allRecords = await Promise.all(
          tables.map((table) => database.get(table).query().fetch())
        );

        await database.batch([
          ...allRecords
            .flat()
            .map((record) => record.prepareDestroyPermanently()),
        ]);
      });
    } catch (error) {
      console.error("Fehler beim Backup:", error);
      throw new Error("DatenBank Löschen");
    }
  };

  const backupDatabase = async () => {
    try {
      console.log("Here");
      const regale = await RegalService.getAllRegal();
      const artikel = await ArtikelService.getAllArtikel();
      const artikelBesitzer =
        await ArtikelBesitzerService.getAllArtikelOwners();
      return { regale, artikel, artikelBesitzer };
    } catch (error) {
      console.error("Fehler beim Backup:", error);
      throw new Error("Backup fehlgeschlagen");
    }
  };
  // Insert new data into the database
  const insertData = async (data) => {
    try {
      if (!data || typeof data !== "object") {
        throw new Error(`Invalid data structure: ${JSON.stringify(data)}`);
      }

      // Import Regale
      if (!Array.isArray(data.Regale)) {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.REGAL_NOT_FOUND,
          position: "bottom",
          autoHide: false,
        });
      } else {
        console.log(`Processing ${data.Regale.length} Regale records`);
        const regalProgressStep = 15 / data.Regale.length; // 15% for Regale
        for (let i = 0; i < data.Regale.length; i++) {
          const regal = data.Regale[i];
          try {
            // Convert Excel column names to database field names
            const regalData = {
              regalId: String(regal["Regal ID"] || "").trim(),
              regalName: String(regal["Regal Name"] || "").trim(),
              fachName: String(regal["Fach Name"] || "").trim(),
              erstelltAm: regal["Erstellt am"]
                ? stringToDate(
                    regal["Erstellt am"],
                    "dd.MM.yyyy",
                    "."
                  ).getTime()
                : new Date().getTime(),
            };

            // Validate required fields
            if (!regalData.regalId) {
              throw new Error(
                `Regal ID ist erforderlich: ${JSON.stringify(regal)}`
              );
            }
            if (!regalData.regalName) {
              throw new Error(
                `Regal Name ist erforderlich: ${JSON.stringify(regal)}`
              );
            }
            if (!regalData.fachName) {
              throw new Error(
                `Fach Name ist erforderlich: ${JSON.stringify(regal)}`
              );
            }

            console.log("Importing Regal:", regalData);
            await RegalService.createRegal(regalData);
            setImportProgress(20 + (i + 1) * regalProgressStep);
          } catch (error) {
            console.error(
              `Fehler beim Import von Regal: ${JSON.stringify(regal)}`,
              error
            );
            throw new Error(
              `Fehler beim Import von Regal ${regal["Regal ID"]}: ${error.message}`
            );
          }
        }
      }

      // Import Artikel
      if (!Array.isArray(data.Artikel)) {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.ARTICLE_NOT_FOUND,
          position: "bottom",
          autoHide: false,
        });
      } else {
        console.log(`Processing ${data.Artikel.length} Artikel records`);
        const artikelProgressStep = 25 / data.Artikel.length; // 25% for Artikel
        for (let i = 0; i < data.Artikel.length; i++) {
          const artikel = data.Artikel[i];
          try {
            // Convert Excel column names to database field names and ensure proper types
            const artikelData = {
              gwId: String(artikel["GWID"] || "").trim(),
              firmenId: String(artikel["Firmen ID"] || "").trim(),
              beschreibung: String(artikel["Beschreibung"] || "").trim(),
              menge:
                artikel["Gesamtmenge"] !== undefined &&
                artikel["Gesamtmenge"] !== ""
                  ? Number(artikel["Gesamtmenge"])
                  : 0,
              mindestMenge:
                artikel["Mindestmenge"] !== undefined &&
                artikel["Mindestmenge"] !== ""
                  ? Number(artikel["Mindestmenge"])
                  : 0,
              kunde: String(artikel["Kunde"] || "").trim(),
              ablaufdatum: artikel["Ablaufdatum"]
                ? stringToDate(
                    artikel["Ablaufdatum"].replace(/\//g, "."),
                    "dd.MM.yyyy",
                    "."
                  ).getTime()
                : new Date().getTime(),
            };

            // Validate required fields
            if (!artikelData.gwId) {
              throw new Error(
                `GWID ist erforderlich: ${JSON.stringify(artikel)}`
              );
            }
            if (!artikelData.firmenId) {
              throw new Error(
                `FirmenID ist erforderlich: ${JSON.stringify(artikel)}`
              );
            }

            // Validate numeric fields
            if (isNaN(artikelData.menge)) {
              throw new Error(
                `Ungültige Gesamtmenge für Artikel ${artikelData.gwId}: ${artikel["Gesamtmenge"]}`
              );
            }
            if (isNaN(artikelData.mindestMenge)) {
              throw new Error(
                `Ungültige Mindestmenge für Artikel ${artikelData.gwId}: ${artikel["Mindestmenge"]}`
              );
            }

            console.log("Importing Artikel:", artikelData);

            await ArtikelService.createArtikelImport(artikelData);
            setImportProgress(35 + (i + 1) * artikelProgressStep);
          } catch (error) {
            console.error(
              `Fehler beim Import von Artikel: ${JSON.stringify(artikel)}`,
              error
            );
            throw new Error(
              `Fehler beim Import von Artikel ${artikel["GWID"]}: ${error.message}`
            );
          }
        }
      }

      // Artikel Besitzer
      if (!Array.isArray(data.Lagerplan)) {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.NO_LAGERPLAN,
          position: "bottom",
          autoHide: false,
        });
      } else {
        console.log(`Processing ${data.Lagerplan.length} Lagerplan records`);
        const lagerplanProgressStep = 35 / data.Lagerplan.length; // 35% for Lagerplan
        for (let i = 0; i < data.Lagerplan.length; i++) {
          const relation = data.Lagerplan[i];
          try {
            // Convert Excel column names to database field names
            const lagerplanData = {
              regalId: String(relation["Regal ID"] || "").trim(),
              gwId: String(relation["GWID"] || "").trim(),
              menge:
                relation["Menge"] !== undefined && relation["Menge"] !== ""
                  ? Number(relation["Menge"])
                  : 0,
              erstelltAm: relation["Zuletzt aktualisiert"]
                ? stringToDate(
                    relation["Zuletzt aktualisiert"].replace(/\//g, "."),
                    "dd.MM.yyyy",
                    "."
                  ).getTime()
                : new Date().getTime(),
            };

            // Validate required fields
            if (!lagerplanData.regalId) {
              throw new Error(
                `Regal ID ist erforderlich im Lagerplan: ${JSON.stringify(
                  relation
                )}`
              );
            }
            if (!lagerplanData.gwId) {
              throw new Error(
                `GWID ist erforderlich im Lagerplan: ${JSON.stringify(
                  relation
                )}`
              );
            }

            // Validate numeric fields
            if (isNaN(lagerplanData.menge)) {
              throw new Error(
                `Ungültige Menge im Lagerplan für Artikel ${lagerplanData.gwId}: ${relation["Menge"]}`
              );
            }

            console.log("Importing Lagerplan:", lagerplanData);
            await ArtikelBesitzerService.createArtikelOwner(
              lagerplanData,
              lagerplanData.gwId,
              lagerplanData.regalId
            );
            setImportProgress(60 + (i + 1) * lagerplanProgressStep);
          } catch (error) {
            console.error(
              `Fehler beim Import von Lagerplan: ${JSON.stringify(relation)}`,
              error
            );
            throw new Error(
              `Fehler beim Import von Lagerplan für Artikel ${relation["GWID"]}: ${error.message}`
            );
          }
        }
      }
    } catch (error) {
      console.error("Import error:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: error.message,
        position: "bottom",
        autoHide: false,
      });
      throw error;
    }
  };

  // Reset state when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setSelectedFile(null);
      setJsonData(null);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        Excel Datei Importieren
      </Text>
      <View style={styles.card}>
        <View style={styles.fileBox}>
          <Text numberOfLines={1} style={styles.fileText}>
            {selectedFile ? selectedFile.name : "Keine Datei ausgewählt"}
          </Text>
        </View>
        <TouchableOpacity style={styles.buttonWhite} onPress={pickFile}>
          <Text numberOfLines={1} style={styles.buttonText}>
            Hochladen
          </Text>
        </TouchableOpacity>
        {!isImporting && (
          <TouchableOpacity
            style={[
              styles.buttonBlue,
              !jsonData && { backgroundColor: "#d9d9d9" },
            ]}
            onPress={handleImport}
            disabled={!jsonData}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.buttonTextLightBlue,
                !jsonData && { color: "#AFAFAF" },
              ]}
            >
              Importieren
            </Text>
          </TouchableOpacity>
        )}
        {isImporting && (
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={importProgress / 100}
              color="#dcebf9"
              width={widthPercentageToDP(80)}
              height={8}
            />
            <Text style={styles.progressText}>
              {Math.round(importProgress).toFixed(0)}%
            </Text>
          </View>
        )}
      </View>

      {selectedFile && jsonData && !isImporting && (
        <ScrollView style={styles.scrollContainer}>
          {/* Artikel Vorschau */}
          <View style={localStyles.previewSection}>
            <Text numberOfLines={1} style={styles.subHeader}>
              Artikel Vorschau
            </Text>
            <View style={localStyles.table}>
              <View style={[localStyles.row, localStyles.rowBorder]}>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    Beschreibung
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    GWID
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    Firma
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    Menge
                  </Text>
                </View>
              </View>

              <View style={localStyles.tableContainer}>
                <FlashList
                  nestedScrollEnabled={true}
                  data={jsonData.Artikel || []}
                  renderItem={({ item }) => (
                    <View style={[localStyles.row, localStyles.rowBorder]}>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.name}>
                          {item["Beschreibung"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["GWID"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["FirmenID"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["Gesamtmenge"]}
                        </Text>
                      </View>
                    </View>
                  )}
                  estimatedItemSize={35}
                />
              </View>
            </View>
          </View>

          {/* Regale Vorschau */}
          <View style={localStyles.previewSection}>
            <Text numberOfLines={1} style={styles.subHeader}>
              Regale Vorschau
            </Text>
            <View style={localStyles.table}>
              <View style={[localStyles.row, localStyles.rowBorder]}>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    RegalID
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    Regal Name
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    Fach Name
                  </Text>
                </View>
              </View>

              <View style={localStyles.tableContainer}>
                <FlashList
                  nestedScrollEnabled={true}
                  data={jsonData.Regale || []}
                  renderItem={({ item }) => (
                    <View style={[localStyles.row, localStyles.rowBorder]}>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["Regal ID"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.name}>
                          {item["Regal Name"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["Fach Name"]}
                        </Text>
                      </View>
                    </View>
                  )}
                  estimatedItemSize={35}
                />
              </View>
            </View>
          </View>

          {/* Lagerplan Vorschau */}
          <View style={localStyles.previewSection}>
            <Text numberOfLines={1} style={styles.subHeader}>
              Lagerplan Vorschau
            </Text>
            <View style={localStyles.table}>
              <View style={[localStyles.row, localStyles.rowBorder]}>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    RegalID
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    GWID
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.tableContent}>
                    Menge
                  </Text>
                </View>
              </View>

              <View style={localStyles.tableContainer}>
                <FlashList
                  nestedScrollEnabled={true}
                  data={jsonData.Lagerplan || []}
                  renderItem={({ item }) => (
                    <View style={[localStyles.row, localStyles.rowBorder]}>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["Regal ID"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["GWID"]}
                        </Text>
                      </View>
                      <View style={localStyles.cell}>
                        <Text numberOfLines={1} style={localStyles.cellText}>
                          {item["Menge"]}
                        </Text>
                      </View>
                    </View>
                  )}
                  estimatedItemSize={35}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirm}
        statusBarTranslucent={true}
        onRequestClose={() => setShowConfirm(false)}
      >
        <ConfirmPopup
          greenMode={true}
          text={
            "Achtung: \nBeim Importieren werden alle aktuellen Daten gelöscht und ersetzt.\n Möchten Sie fortfahren?"
          }
          greyCallback={() => setShowConfirm(false)}
          colorCallback={handleConfirmImport}
        />
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ConfirmPopup
          text={validationErrors
            .map(
              (error) =>
                `Blatt: ${error.sheet}\n` +
                `Zeile: ${error.row}\n` +
                `Feld: ${error.field}\n` +
                `Wert: ${error.value}\n` +
                `Fehler: ${error.error}\n` +
                "-------------------"
            )
            .join("\n\n")}
          greyCallback={() => setModalVisible(false)}
          colorCallback={() => {
            setSelectedFile(null);
            setJsonData(null);
            setModalVisible(false);
          }}
          greenMode={false}
          confirmText="Erneut Hochladen"
        />
      </Modal>
    </View>
  );
};

export default ImportScreen;

// Local Styles
const localStyles = StyleSheet.create({
  table: {
    borderRadius: 20,
    backgroundColor: "#F8F8FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: "100%",
    marginBottom: 20,
    padding: 5,
    flex: 1,
  },
  tableContent: {
    color: "#AFAFAF",
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 2,
    height: 35,
  },
  cell: {
    fontSize: 12,
    color: "#AFAFAF",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: 60,
  },
  rowBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
  },
  name: {
    fontSize: 12,
    color: "#333",
    textAlign: "left",
  },
  cellText: {
    fontSize: 12,
    color: "#AFAFAF",
    textAlign: "center",
  },
  tableContainer: {
    height: 200,
    width: "100%",
  },
  previewSection: {
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },
  progressText: {
    marginTop: 5,
    color: "#30A6DE",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
