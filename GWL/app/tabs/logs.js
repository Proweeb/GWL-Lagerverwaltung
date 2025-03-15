import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { styles } from "../../components/styles";
import React, { useState, useEffect } from "react";
import LogsWidget from "../../components/utils/LogsWidget";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { database } from "../../database/database";
import { Q } from "@nozbe/watermelondb";
import { useIsFocused } from "@react-navigation/native";
import HomeWidget from "../../components/utils/HomeWidget/homeWidget";

export default function LogsScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
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
