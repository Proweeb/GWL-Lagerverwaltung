import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as XLSX from "xlsx";
import * as DocumentPicker from "expo-document-picker";
import { styles } from "../../../components/styles";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import LogService from "../../../database/datamapper/LogHelper";

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

        // Loop through all sheets in the Excel file
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);

          if (parsedData.length > 0) {
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

  // Handle Import function that receives jsonData
  const handleImport = async() => {
    if (!jsonData) {
      Alert.alert("Fehler", "Es gibt keine Daten zu importieren.");
      return;
    }

    console.log("Importing Data:", jsonData);
    try {
      // Upload Regale first
      for (const regal of jsonData.Regale) {
        await RegalService.createRegal(regal);
      }
  
      // Upload Artikel
      for (const artikel of jsonData.Artikel) {
        await ArtikelService.createArtikel(artikel);
      }
  
      // Upload Logs
      for (const log of jsonData.Logs) {
        await LogService.createLog(log, log.gw_id, log.regal_id);
      }

      //getAllLogs();
      
      //getAllRegale();
     
      //getAllArtikel();
    
  
      console.log("Daten erfolgreich hochgeladen!");
    } catch (error) {
      console.error("Fehler beim Hochladen der Daten:", error);
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

      
    </View>
  );
};

export default ImportScreen;




////{jsonData && (
////  <ScrollView style={styles.jsonContainer}>
////  <Text style={styles.jsonText}>{JSON.stringify(jsonData, null, 2)}</Text>
////</ScrollView>
////)}

