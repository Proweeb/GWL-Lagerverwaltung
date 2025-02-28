import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Q } from "@nozbe/watermelondb";
import LogService from "../../database/datamapper/LogHelper";
import { database } from "../../database/database";
import { styles } from "../styles";

const LogsWidget = ({ selectedMonth }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogsForMonth(selectedMonth);
  }, [selectedMonth]);

  const fetchLogsForMonth = async (month) => {
    try {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month + 1, 0);

      const logsCollection = database.get("logs");

      const logsQuery = await logsCollection
        .query(
          Q.and(
            Q.where("created_at", Q.gt(startDate.getTime())),
            Q.where("created_at", Q.lt(endDate.getTime()))
          )
        )
        .fetch(); // Fetch instead of observe

      if (logsQuery.length === 0) {
        setLogs([]);
        return;
      }

      const logsData = await Promise.all(
        logsQuery.map(async (log) => {
          const artikel = await log.artikel.fetch();
          const regal = await log.regal.fetch();

          return {
            beschreibung: log.beschreibung,
            menge: log.menge,
            regalName: regal.regalName,
            artikelName: artikel.gwId, // Artikel Name
            createdAt: log.createdAt,
            id: log.id,
          };
        })
      );

      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={customStyles.logItem}>
      <Text style={customStyles.time}>{item.createdAt.toDateString()}</Text>
      <Text style={customStyles.beschreibung}>{item.beschreibung}</Text>
      <Text style={customStyles.artikel}>Artikel: #{item.artikelName}</Text>
      <Text style={customStyles.regal}>Regal: #{item.regalName}</Text>
      <Text style={customStyles.menge}>Menge: {item.menge}</Text>
    </View>
  );

  return (
    <View style={customStyles.container}>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        style={{ elevation: 5, flex: 1 }}
      />
    </View>
  );
};

const customStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: styles.backgroundColor,
    borderRadius: 10,
    flex: 1,
    gap: 10,
  },
  logItem: {
    backgroundColor: styles.white,
    padding: 10,
    borderRadius: 5,
    elevation: 1,
    marginBottom: 8,
  },
  time: { fontWeight: "bold", color: "#333" },
  beschreibung: { fontSize: 16, marginBottom: 5 },
  artikel: { color: "#666" },
  regal: { color: "#666" },
  menge: { color: "#666", fontWeight: "bold" },
});

export default LogsWidget;
