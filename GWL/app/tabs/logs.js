import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import { styles } from "../../components/styles";
import React, { useState, useEffect } from "react";
import LogsWidget from "../../components/utils/LogsWidget";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { database } from "../../database/database";
import { Q } from "@nozbe/watermelondb";
import { useIsFocused } from "@react-navigation/native";
import HomeWidget from "../../components/utils/HomeWidget/homeWidget";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import LogService from "../../database/datamapper/LogHelper";
import Toast from "react-native-toast-message";
import CustomPopup from "../../components/utils/Modals/CustomPopUp";
import ConfirmPopup from "../../components/utils/Modals/ConfirmPopUp";

export default function LogsScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function getEarliestAndLatestLogs() {
      const logsCollection = database.get("logs");

      // Query to get the earliest created_at
      const earliestLog = await logsCollection
        .query(Q.sortBy("created_at", Q.asc), Q.take(1))

        .fetch();

      // Query to get the latest created_at
      const latestLog = await logsCollection
        .query(
          Q.sortBy("created_at", Q.desc),
          Q.take(1) // Sort descending (latest)
        )

        .fetch();

      // Get the earliest and latest logs
      const earliestCreatedAt = new Date(earliestLog[0].createdAt);
      const latestCreatedAt = new Date(latestLog[0].createdAt);

      // Adjust dates by creating new Date instances
      const adjustedStartDate = new Date(earliestCreatedAt);
      adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);

      const adjustedEndDate = new Date(latestCreatedAt);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      // Update state
      setStartDate(earliestCreatedAt);
      setEndDate(latestCreatedAt);
      setMaxDate(latestCreatedAt);
      setMinDate(earliestCreatedAt);

      return { earliestCreatedAt, latestCreatedAt };
    }
    getEarliestAndLatestLogs();
    //fetchLogsDateRange();
  }, [isFocused]);

  const showDatePicker = (currentDate, setDate, isStart) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          let adjustedDate = new Date(selectedDate);

          if (isStart) {
            // Set time to 00:00:00 for start date
            adjustedDate.setHours(0, 0, 0, 0);
          } else {
            // Set time to 23:59:59 for end date
            adjustedDate.setHours(23, 59, 59, 999);
          }

          setDate(adjustedDate);
          console.log("Selected Date:", adjustedDate);
        }
      },
      mode: "date",
      display: "calendar",
      maximumDate: maxDate,
      minimumDate: minDate,
      backgroundColor: "black",
    });
  };

  const exportLogs = async () => {
    try {
      // Fetch logs from the database
      const logsQuery = await LogService.getAllLogs();

      if (!logsQuery.length) {
        Alert.alert("Fehler", "Keine Logs zum Exportieren vorhanden.");
        return;
      }

      // Format logs data with async fetching of related Artikel and Regal
      const logsData = await Promise.all(
        logsQuery.map(async (log) => {
          let artikel, regal;

          if (!log.isBackup) {
            artikel = await log.artikel.fetch();
            regal = await log.regal.fetch();
          }

          return {
            Beschreibung: log.beschreibung,

            "Gesamt Menge": log.gesamtMenge,
            "Regal ID": log.isBackup
              ? log.regal_id
              : regal
              ? regal.regalId
              : "",
            GWID: log.isBackup ? log.gwId : artikel ? artikel.gwId : "", // Artikel Name
            Menge: log.menge,
            "Erstellt am": new Date(log.createdAt).toLocaleDateString(),
          };
        })
      );

      // Create worksheet
      const logsSheet = XLSX.utils.json_to_sheet(logsData);

      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, logsSheet, "Trackingliste");

      // Define export file name
      const exportFileName = `trackingliste_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      const fileUri = FileSystem.documentDirectory + exportFileName;

      // Convert workbook to base64 and save
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });
      await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file
      const result = await Sharing.shareAsync(fileUri);

      if (result) {
        Toast.show({
          type: "success",
          text1: "Export",
          text2: "Logs erfolgreich exportiert",
        });
      }
    } catch (error) {
      console.error("Fehler beim Export der Logs:", error);
      Toast.show({
        type: "error",
        text1: "Export",
        text2: "Fehler beim Exportieren der Logs",
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: styles.backgroundColor,
      }}
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        <View style={customStyles.dateContainer}>
          <View style={customStyles.dateWrapper}>
            <Text style={customStyles.label}>Von</Text>
            <TouchableOpacity
              onPress={() => showDatePicker(startDate, setStartDate, true)}
              activeOpacity={0.9}
            >
              <TextInput
                style={customStyles.inputContainer}
                value={startDate.toLocaleString("de-DE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                editable={false}
              />
            </TouchableOpacity>
          </View>
          <View style={customStyles.dateWrapper}>
            <Text style={customStyles.label}>Bis</Text>
            <TouchableOpacity
              onPress={() => showDatePicker(endDate, setEndDate, false)}
              activeOpacity={0.9}
            >
              <TextInput
                style={customStyles.inputContainer}
                value={endDate.toLocaleString("de-DE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                editable={false}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <LogsWidget startDate={startDate} endDate={endDate} />
      <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
        <TouchableOpacity
          style={{ paddingHorizontal: 5, paddingTop: 5 }}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name={"dots-horizontal"} size={25} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          console.log("im out");
          setModalVisible(!modalVisible);
        }}
      >
        <CustomPopup
          redButtonText={"Abbrechen"}
          redCallback={() => setModalVisible(false)}
          greenButtonText={"Exportieren"}
          greenCallBack={exportLogs}
        ></CustomPopup>
      </Modal>
    </View>
  );
}

const customStyles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "80%",
    backgroundColor: styles.backgroundColor,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  dateWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: styles.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    elevation: 2,
  },
});
