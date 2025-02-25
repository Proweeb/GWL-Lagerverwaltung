import React, { useState } from "react";
import { Text, View, TouchableOpacity, Alert, ScrollView, StyleSheet} from "react-native";
import * as XLSX from "xlsx";
import * as DocumentPicker from "expo-document-picker";
import { styles } from "../../../components/styles";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import LogService from "../../../database/datamapper/LogHelper";
import { database } from "../../../database/database";


const ImportScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

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
            // Convert every value in the object to a string
            parsedData = parsedData.map(row =>
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
  

  const handleImport = async () => {
    if (!jsonData) {
      Alert.alert("Fehler", "Es gibt keine Daten zu importieren.");
      return;
    }
    try {
      console.log(JSON.stringify(jsonData))
      console.log("Backup der aktuellen Datenbank wird erstellt...");
      const backup = await backupDatabase();
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

  const backupDatabase = async () => {
    try {
      console.log("Here")
      const regale = await RegalService.getAllRegal();
      const artikel = await ArtikelService.getAllArtikel();
      const logs = await LogService.getAllLogs();
      return { regale, artikel, logs };
    } catch (error) {
      console.error("Fehler beim Backup:", error);
      throw new Error("Backup fehlgeschlagen");
    }
  };

  const insertData = async (data) => {
   try{
    for (const regal of data.Regale) {
      
      regal.regalId = String(regal.regalId)
      console.log("Regal:")
      await console.log(regal)
      await RegalService.createRegal(regal);
    }
    for (const artikel of data.Artikel) {
      artikel.gwId = String(artikel.gwId)
      artikel.firmenId = String(artikel.firmenId)
      artikel.kunde =  String(artikel.kunde)
      artikel.regalId = String(artikel.regalId)
      console.log("Artikel:")
      await console.log(artikel)
      await ArtikelService.createArtikel(artikel);
    }
    for (const log of data.Logs) {
      log.gwId = String(log.gwId)
      log.gwId = String(log.regalId)
      await console.log(log)
      await LogService.createLog(log, log.gwId, log.regalId);
    }

    
   }
   catch(error){
    console.log(error)
   }
    
  };

    
  async function getAllLogs() {
    try {
      const logs = await LogService.getAllLogs();
      console.log("Alle Logs:", logs);
      return logs;
    } catch (error) {
      console.error("Fehler beim Abrufen der Logs:", error);
    }
  }
  
    
  async function getAllArtikel() {
    try {
      const artikel = await ArtikelService.getAllArtikel();
      console.log("Alle Artikel:", artikel);
      return artikel;
    } catch (error) {
      console.error("Fehler beim Abrufen der Artikel:", error);
    }
  }

  async function getAllRegale() {
    try {
      const regale = await RegalService.getAllRegal();
      console.log("Alle Regale:", regale);
      return regale;
    } catch (error) {
      console.error("Fehler beim Abrufen der Regale:", error);
    }
  }
  



  return (
    <View style={styles.container}>
        <Text style={styles.title}>Excel Datei Importieren</Text>
        <View style={styles.card}>
          <View style={styles.fileBox}>
            <Text style={styles.fileText}>
              {selectedFile ? selectedFile.name : "Keine Datei ausgewählt"}
            </Text>
          </View>
          <TouchableOpacity style={styles.buttonWhite} onPress={pickFile}>
            <Text style={styles.buttonText}>Hochladen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonBlue} onPress={handleImport}>
            <Text style={styles.buttonTextLightBlue}>Importieren</Text>
          </TouchableOpacity>
        </View>

      

        <ScrollView style = {styles.scrollContainer}>

        <Text style={styles.subHeader}>Artikel Vorschau</Text>
        <View style={localStyles.table}>
          <View style={[localStyles.row, localStyles.rowBorder]}>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Produkt Name</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Produkt ID</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Menge</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Status</Text></View>
          </View>

          {jsonData && jsonData.Artikel ? (
            jsonData.Artikel.map((item, index) => (
              <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
                <View style={localStyles.cell}><Text style={localStyles.name}>{item.beschreibung}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.gwId}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.menge}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.status}</Text></View>
              </View>
            ))
          ) : (
            <Text>Keine Artikel vorhanden</Text>
          )}
        </View>




        <Text style={styles.subHeader}>Regale Vorschau</Text>
        <View style={localStyles.table}>
          <View style={[localStyles.row, localStyles.rowBorder]}>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Regal Name</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Regal ID</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Fach Name</Text></View>
          </View>

          {jsonData && jsonData.Regale ? (
            jsonData.Regale.map((item, index) => (
              <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
                <View style={localStyles.cell}><Text style={localStyles.name}>{item.regalName}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.regalId}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.fachName}</Text></View>
              </View>
            ))
          ) : (
            <Text>Keine Regale vorhanden</Text>
          )}
        </View>





        <Text style={styles.subHeader}>Logs Vorschau</Text>
        <View style={localStyles.table}>
          <View style={[localStyles.row, localStyles.rowBorder]}>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Log ID</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>GW ID</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Regal ID</Text></View>
            <View style={localStyles.cell}><Text style={localStyles.tableContent}>Menge</Text></View>
          </View>

          {jsonData && jsonData.Logs ? (
            jsonData.Logs.map((item, index) => (
              <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
                <View style={localStyles.cell}><Text style={localStyles.name}>{item.beschreibung}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.gwId}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.regalId}</Text></View>
                <View style={localStyles.cell}><Text style={localStyles.cellText}>{item.menge}</Text></View>
              </View>
            ))
          ) : (
            <Text>Keine Logs vorhanden</Text>
          )}
        </View>















        </ScrollView>
        












      </View>


    

    

    

  );
};

export default ImportScreen;




const localStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: styles.backgroundColor,
    paddingVertical: 20,
  },
  table: {
    borderRadius: 20,
    backgroundColor: "#F8F8FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: 349,
    marginBottom: 20,
    padding: 5,
  },
  regalBez: {
    color: "#292D32", // Text color
    fontFamily: "Inter", // Font family
    fontSize: 12, // Font size in points
    fontStyle: "normal", // Normal font style
    fontWeight: "400", // Font weight
    lineHeight: 16, // lineHeight, you can adjust it based on your design preference
    marginBottom: 10,
  },
  tableContent: {
    color: "#AFAFAF",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 5,
    height: 35,
  },
  cellText: {
    fontSize: 12,
    color: "#AFAFAF",
    textAlign: "center",
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
  out: {
    backgroundColor: "#FFEEEE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "red",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  high: {
    backgroundColor: "#DFFFD8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "green",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  low: {
    backgroundColor: "#FFF4D8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "orange",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  name: {
    fontSize: 12,
    color: "#333",
    textAlign: "left",
  },
});
