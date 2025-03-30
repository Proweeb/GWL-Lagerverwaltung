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
import { FlashList } from "@shopify/flash-list";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import { logTypes } from "../../../components/enum";

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

        console.log("=== DEBUG: Excel Parsing ===");
        console.log("Found sheets:", workbook.SheetNames);

        const validateNumber = (value, fieldName, rowIndex) => {
          const num = Number(value);
          if (isNaN(num)) {
            throw new Error(
              `Ungültiger Wert für ${fieldName} in Zeile ${
                rowIndex + 1
              }: ${value} muss eine Zahl sein.`
            );
          }
          return num;
        };

        const validateDate = (value, fieldName, rowIndex) => {
          try {
            const date = stringToDate(value, "dd.MM.yyyy", ".");
            if (isNaN(date.getTime())) {
              throw new Error(
                `Ungültiges Datum für ${fieldName} in Zeile ${
                  rowIndex + 1
                }: ${value}`
              );
            }
            return value;
          } catch (error) {
            throw new Error(
              `Ungültiges Datumsformat für ${fieldName} in Zeile ${
                rowIndex + 1
              }: ${value}`
            );
          }
        };

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          console.log(`Processing sheet: ${sheetName}`);
          console.log("Sheet headers:", Object.keys(sheet));

          let parsedData = XLSX.utils.sheet_to_json(sheet);
          console.log(
            `Raw parsed data for ${sheetName}:`,
            JSON.stringify(parsedData, null, 2)
          );

          if (parsedData.length > 0) {
            try {
              parsedData = parsedData.map((row, index) => {
                console.log(
                  `Processing row ${index} in ${sheetName}:`,
                  JSON.stringify(row)
                );
                const processedRow = { ...row };

                // Convert all values to strings first
                Object.entries(row).forEach(([key, value]) => {
                  processedRow[key] = String(value);
                });

                // Validate specific fields
                if ("Menge" in processedRow) {
                  validateNumber(processedRow.Menge, "Menge", index);
                }
                if ("AblaufDatum" in processedRow) {
                  validateDate(processedRow.AblaufDatum, "AblaufDatum", index);
                }
                if ("ErstelltungsDatum" in processedRow) {
                  validateDate(
                    processedRow.ErstelltungsDatum,
                    "ErstelltungsDatum",
                    index
                  );
                }

                return processedRow;
              });
              allSheetsData[sheetName] = parsedData;
              console.log(
                `Processed data for ${sheetName}:`,
                JSON.stringify(parsedData, null, 2)
              );
            } catch (error) {
              console.error(`Error processing sheet ${sheetName}:`, error);
              Alert.alert("Validierungsfehler", error.message);
              return;
            }
          }
        });

        console.log("=== END Excel Parsing DEBUG ===");

        if (Object.keys(allSheetsData).length > 0) {
          setJsonData(allSheetsData);
        } else {
          Alert.alert("Fehler", "Keine Daten gefunden.");
        }
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Excel parsing error:", error);
      Alert.alert("Fehler", "Datei konnte nicht verarbeitet werden.");
    }
  };

  async function backupLogsBeforeImport() {
    await database.write(async () => {
      const logs = await database.get("logs").query().fetch();
      const acceptedBoth = {
        Entnehmen: true,
        Einlagern: true,
        Nachfüllen: true,
      };

      // Use Promise.all to resolve asynchronous map operations
      const updates = await Promise.all(
        logs.map(async (log) => {
          const regal = await log.regal.fetch();
          const artikel = await log.artikel.fetch();
          console.log(log.beschreibung);

          return log.prepareUpdate((logRecord) => {
            logRecord.isBackup = true;
            // Only update regalId and gwId if the log.beschreibung is accepted
            if (acceptedBoth[log.beschreibung]) {
              logRecord.regalId = regal.regalId;
              logRecord.gwId = artikel.gwId;
            }

            if (log.beschreibung == logTypes.LagerplatzHinzufügen) {
              logRecord.regalId = regal.regalId;
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
      // Debug logging
      console.log("=== DEBUG: Full JSON Data Structure ===");
      console.log("Available sheets:", Object.keys(jsonData));
      console.log("Regale data:", JSON.stringify(jsonData.Regale, null, 2));
      console.log("Artikel data:", JSON.stringify(jsonData.Artikel, null, 2));
      console.log("=== END DEBUG ===");

      console.log("Backup der aktuellen Datenbank wird erstellt...");
      const backup = await backupDatabase();

      console.log("Backup der Trackingliste");
      await backupLogsBeforeImport;

      console.log("Bestehende Datenbank wird gelöscht...");
      await DBdeleteAllData();
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
  const DBdeleteAllData = async () => {
    try {
      await database.write(async () => {
        // Delete all existing records from tables
        const tables = ["artikel", "logs", "regale", "artikel_besitzer"];
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
      const logs = await LogService.getAllLogs();
      return { regale, artikel, artikelBesitzer, logs };
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
        console.warn("No Regale data found or invalid format");
      } else {
        console.log(`Processing ${data.Regale.length} Regale records`);
        for (const regal of data.Regale) {
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
        console.warn("No Artikel data found or invalid format");
      } else {
        console.log(`Processing ${data.Artikel.length} Artikel records`);
        for (const artikel of data.Artikel) {
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
                    artikel["Ablaufdatum"],
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
                `Firmen ID ist erforderlich: ${JSON.stringify(artikel)}`
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
        console.warn("No Lagerplan data found or invalid format");
      } else {
        console.log(`Processing ${data.Lagerplan.length} Lagerplan records`);
        for (const relation of data.Lagerplan) {
          try {
            // Convert Excel column names to database field names
            const lagerplanData = {
              regalId: String(relation["Regal ID"] || "").trim(),
              gwId: String(relation["GWID"] || "").trim(),
              menge:
                relation["Menge"] !== undefined && relation["Menge"] !== ""
                  ? Number(relation["Menge"])
                  : 0,
              erstelltAm: relation["Erstellt am"]
                ? stringToDate(
                    relation["Erstellt am"],
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
      Alert.alert("Import Fehler", error.message);
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

            <View style={{ height: 200 }}>
              <FlashList
                data={jsonData.Artikel || []}
                renderItem={({ item }) => (
                  <View style={[localStyles.row, localStyles.rowBorder]}>
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
                )}
                estimatedItemSize={35}
              />
            </View>
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

            <View style={{ height: 200 }}>
              <FlashList
                data={jsonData.Regale || []}
                renderItem={({ item }) => (
                  <View style={[localStyles.row, localStyles.rowBorder]}>
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
                )}
                estimatedItemSize={35}
              />
            </View>
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
