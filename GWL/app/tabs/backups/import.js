import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import * as XLSX from "xlsx";
import * as DocumentPicker from "expo-document-picker";
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

const ImportScreen = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

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
      Alert.alert("Fehler", "Dateiauswahl fehlgeschlagen");
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

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          let parsedData = XLSX.utils.sheet_to_json(sheet);

          if (parsedData.length > 0) {
            parsedData = parsedData.map((row) =>
              Object.fromEntries(
                Object.entries(row).map(([key, value]) => [key, String(value)])
              )
            );
            allSheetsData[sheetName] = parsedData;
          }
        });

        if (Object.keys(allSheetsData).length > 0) {
          setJsonData(allSheetsData);
        } else {
          Alert.alert("Fehler", "Keine Daten gefunden.");
        }
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      Alert.alert("Fehler", "Datei konnte nicht verarbeitet werden.");
    }
  };

  async function backupLogsBeforeImport() {
    await database.write(async () => {
      const logs = await database.get("logs").query().fetch();
      const accepted = { Entnehmen: true, Einlagern: true };

      // Use Promise.all to resolve asynchronous map operations
      const updates = await Promise.all(
        logs.map(async (log) => {
          const regal = await log.regal.fetch();
          const artikel = await log.artikel.fetch();
          console.log(log.beschreibung);

          return log.prepareUpdate((logRecord) => {
            logRecord.isBackup = true;
            // Only update regalId and gwId if the log.beschreibung is accepted
            if (accepted[log.beschreibung]) {
              logRecord.regalId = regal.regalId;
              logRecord.gwId = artikel.gwId;
            }
          });
        })
      );

      await database.batch(...updates);
    });
  }

  // Handle the import of data into the database
  const handleImport = async () => {
    if (!jsonData) {
      Alert.alert("Fehler", "Es gibt keine Daten zu importieren.");
      return;
    }
    try {
      console.log(JSON.stringify(jsonData));
      console.log("Backup der aktuellen Datenbank wird erstellt...");
      const backup = await backupDatabase();

      console.log("Alte Logs werden auf Backup Mode gesetzt.");
      await backupLogsBeforeImport();

      console.log("Bestehende Datenbank wird gelöscht...");
      await ArtikelService.deleteAllData();
      console.log("Neue Datenbank wird erstellt und Daten importiert...");
      await insertData(jsonData);
      console.log("Daten erfolgreich importiert!");
      Alert.alert("Erfolg", "Daten wurden erfolgreich importiert.");
    } catch (error) {
      console.error("Fehler beim Import:", error);
      Alert.alert("Fehler", "Datenimport fehlgeschlagen.");
    }
  };

  // Backup existing database data
  const backupDatabase = async () => {
    try {
      console.log("Here");
      const regale = await RegalService.getAllRegal();
      const artikel = await ArtikelService.getAllArtikel();
      const logs = await LogService.getAllLogs();
      return { regale, artikel, logs };
    } catch (error) {
      console.error("Fehler beim Backup:", error);
      throw new Error("Backup fehlgeschlagen");
    }
  };

  // Insert new data into the database
  const insertData = async (data) => {
    try {
      for (const regal of data.Regale) {
        regal.regalId = String(regal.regalId);
        console.log("Regal:", regal);
        await RegalService.createRegal(regal);
      }
      for (const artikel of data.Artikel) {
        artikel.gwId = String(artikel.gwId);
        artikel.firmenId = String(artikel.firmenId);
        artikel.kunde = String(artikel.kunde);
        artikel.menge = Number(artikel.menge);
        artikel.mindestMenge = Number(artikel.mindestMenge);
        artikel.ablaufdatum = stringToDate(
          artikel.ablaufdatum,
          "dd.MM.yyyy",
          "."
        ).getTime();
        artikel.regalId = String(artikel.regalId);
        console.log("Artikel:", artikel);
        await ArtikelService.createArtikel(artikel);
      }
      for (const log of data.Logs) {
        log.gwId = String(log.gwId);
        log.regalId = String(log.regalId);
        log.menge = Number(log.menge);
        log.createdAt = parseCustomDate(
          log.datum,
          "dd.mm.yyyy hh:mm"
        ).getTime();
        console.log("Log:", log);
        await LogService.createLog(log, log.gwId, log.regalId);
      }
    } catch (error) {
      console.log(error);
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
        <TouchableOpacity
          style={styles.buttonBlue}
          onPress={handleImport}
          disabled={!jsonData}
        >
          <Text numberOfLines={1} style={styles.buttonTextLightBlue}>
            Importieren
          </Text>
        </TouchableOpacity>
      </View>

      {selectedFile && jsonData && (
        <ScrollView style={styles.scrollContainer}>
          {/* Artikel Vorschau */}
          <Text numberOfLines={1} style={styles.subHeader}>
            Artikel Vorschau
          </Text>
          <View style={localStyles.table}>
            <View style={[localStyles.row, localStyles.rowBorder]}>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Name
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Produkt ID
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Ablaufdatum
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Menge
                </Text>
              </View>
            </View>

            {jsonData.Artikel.map((item, index) => (
              <View
                key={index}
                style={[localStyles.row, localStyles.rowBorder]}
              >
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.name}>
                    {item.beschreibung}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.gwId}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.ablaufdatum}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.menge}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Regale Vorschau */}
          <Text numberOfLines={1} style={styles.subHeader}>
            Regale Vorschau
          </Text>
          <View style={localStyles.table}>
            <View style={[localStyles.row, localStyles.rowBorder]}>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Regal Name
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Regal ID
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Fach Name
                </Text>
              </View>
            </View>

            {jsonData.Regale.map((item, index) => (
              <View
                key={index}
                style={[localStyles.row, localStyles.rowBorder]}
              >
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.name}>
                    {item.regalName}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.regalId}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.fachName}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Logs Vorschau */}
          <Text numberOfLines={1} style={styles.subHeader}>
            Lagerbewegungen Vorschau
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
                  Artikel ID
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Regal ID
                </Text>
              </View>
              <View style={localStyles.cell}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  Menge
                </Text>
              </View>
            </View>

            {jsonData.Logs.map((item, index) => (
              <View
                key={index}
                style={[localStyles.row, localStyles.rowBorder]}
              >
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.name}>
                    {item.beschreibung}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.gwId}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.regalId}
                  </Text>
                </View>
                <View style={localStyles.cell}>
                  <Text numberOfLines={1} style={localStyles.cellText}>
                    {item.menge}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
});
