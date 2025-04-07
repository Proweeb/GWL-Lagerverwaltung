import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
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
import LogService from "../../database/datamapper/LogHelper";
import Toast from "react-native-toast-message";
import CustomPopup from "../../components/Modals/CustomPopUp";
import ConfirmPopup from "../../components/Modals/ConfirmPopUp";
import { logTypes, ToastMessages, EmailBodies } from "../../components/enum";
import { composeEmailWithDefault } from "../../components/utils/Functions/emailUtils";

export default function LogsScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getEarliestAndLatestLogs() {
      try {
        const logs = await LogService.getAllLogs();
        if (logs.length > 0) {
          const dates = logs.map((log) => new Date(log.createdAt));
          const minDateValue = new Date(Math.min(...dates));
          const maxDateValue = new Date(Math.max(...dates));

          // Set min date to start of day (00:00:00)
          minDateValue.setHours(0, 0, 0, 0);
          setMinDate(minDateValue);
          setStartDate(minDateValue);

          // Set max date to end of day (23:59:59)
          maxDateValue.setHours(23, 59, 59, 999);
          setMaxDate(maxDateValue);
          setEndDate(maxDateValue);
        }
      } catch (error) {
        console.error("Error getting log dates:", error);
      }
    }
    getEarliestAndLatestLogs();
  }, []);

  const showDatePicker = (currentDate, setDate, isStart) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          let adjustedDate = new Date(selectedDate);

          if (isStart) {
            // Set time to 00:00:00 for start date
            adjustedDate.setHours(0, 0, 0, 0);
            // Ensure start date is not after end date
            if (adjustedDate > endDate) {
              adjustedDate = new Date(endDate);
              adjustedDate.setHours(0, 0, 0, 0);
            }
          } else {
            // Set time to 23:59:59 for end date
            adjustedDate.setHours(23, 59, 59, 999);
            // Ensure end date is not before start date
            if (adjustedDate < startDate) {
              adjustedDate = new Date(startDate);
              adjustedDate.setHours(23, 59, 59, 999);
            }
          }

          setDate(adjustedDate);
          console.log("Selected Date:", adjustedDate);
        }
      },
      mode: "date",
      display: "calendar",
      maximumDate: isStart ? endDate : maxDate,
      minimumDate: isStart ? minDate : startDate,
      backgroundColor: "black",
    });
  };

  const exportLogs = async () => {
    try {
      const logsQuery = await LogService.getAllLogs();

      // Filter logs based on date range
      const filteredLogs = logsQuery.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= startDate && logDate <= endDate;
      });

      if (!filteredLogs.length) {
        Alert.alert("Fehler", "Keine Logs im ausgewählten Zeitraum vorhanden.");
        return;
      }

      const logsData = filteredLogs.map((log) => ({
        Beschreibung: log.beschreibung,
        "Gesamt Menge": log.gesamtMenge,
        "Regal ID": log.regalId || "",
        GWID: log.gwId || "",
        Menge: log.menge,
        "Erstellt am": new Date(log.createdAt).toLocaleDateString(),
      }));

      // Create worksheet
      const logsSheet = XLSX.utils.json_to_sheet(logsData);

      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, logsSheet, "Trackingliste");

      // Define export file name with date range
      const exportFileName = `trackingliste_${startDate.toLocaleDateString(
        "de-DE"
      )}_bis_${endDate.toLocaleDateString("de-DE")}.xlsx`;
      const fileUri = FileSystem.documentDirectory + exportFileName;

      // Convert workbook to base64 and save
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });
      await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await LogService.createLog(
        { beschreibung: logTypes.ExportTrackingliste },
        null,
        null
      );

      try {
        await composeEmailWithDefault({
          subject: `Trackingliste Export ${startDate.toLocaleDateString(
            "de-DE"
          )} - ${endDate.toLocaleDateString("de-DE")}`,
          body: EmailBodies.TRACKING_LIST + EmailBodies.SIGNATURE,
          attachments: [fileUri],
        });

        Toast.show({
          type: "success",
          text1: ToastMessages.ERFOLG,
          text2: ToastMessages.LOGS_EXPORT,
          position: "bottom",
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
      console.error("Fehler beim Export der Logs:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.LOGS_EXPORT_ERROR,
        position: "bottom",
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
          cancelCallback={() => setModalVisible(false)}
          greenButtonText={"Exportieren"}
          cancelButtonText={"Abbrechen"}
          greenCallback={exportLogs}
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
