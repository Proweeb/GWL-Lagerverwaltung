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
  const handleImport = () => {
    if (!jsonData) {
      Alert.alert("Fehler", "Es gibt keine Daten zu importieren.");
      return;
    }

    console.log("Importing Data:", jsonData);
    // Here you can send jsonData to an API or process it further
  };

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

      {jsonData && (
        <ScrollView style={styles.jsonContainer}>
          <Text style={styles.jsonText}>{JSON.stringify(jsonData, null, 2)}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default ImportScreen;
