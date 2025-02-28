import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Q } from "@nozbe/watermelondb";
import LogService from "../../database/datamapper/LogHelper";
import { database } from "../../database/database";

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
      console.log(logsQuery.length);
      if (logsQuery.length === 0) {
        setLogs([]);
        return;
      }

      const logsData = await Promise.all(
        logsQuery.map(async (log) => {
          const artikel = await log.artikel.fetch();
          const regal = await log.regal.fetch();
          console.log(regal);

          return {
            beschreibung: log.beschreibung,
            menge: log.menge,
            regalName: regal.regalName,
            artikelName: artikel.gwId, // Artikel Name
            createdAt: log.createdAt,
          };
        })
      );

      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.time}>{item.createdAt.toDateString()}</Text>
      <Text style={styles.beschreibung}>{item.beschreibung}</Text>
      <Text style={styles.artikel}>Artikel: #{item.artikelName}</Text>
      <Text style={styles.regal}>Regal: #{item.regalName}</Text>
      <Text style={styles.menge}>Menge: {item.menge}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f8f8f8", borderRadius: 10 },
  logItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
  },
  time: { fontWeight: "bold", color: "#333" },
  beschreibung: { fontSize: 16, marginBottom: 5 },
  artikel: { color: "#666" },
  regal: { color: "#666" },
  menge: { color: "#666", fontWeight: "bold" },
});

export default LogsWidget;
