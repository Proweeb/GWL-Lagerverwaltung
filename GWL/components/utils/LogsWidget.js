import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Q } from "@nozbe/watermelondb";
import LogService from "../../database/datamapper/LogHelper";
import { database } from "../../database/database";
import { styles } from "../styles";
import { FlashList } from "@shopify/flash-list";

const LogsWidget = ({ startDate, endDate }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogsForMonth(startDate, endDate);
  }, [startDate, endDate]);

  const fetchLogsForMonth = async (startDate, endDate) => {
    try {
      const logsCollection = database.get("logs");

      const logsQuery = await logsCollection
        .query(
          // Q.and(
          //   Q.where("created_at", Q.gt(startDate.getTime())),
          //   Q.where("created_at", Q.lt(endDate.getTime()))
          // )
          Q.where(
            "created_at",
            Q.between(startDate.getTime(), endDate.getTime())
          )
        )
        .fetch(); // Fetch instead of observe

      if (logsQuery.length === 0) {
        setLogs([]);
        return;
      }

      const logsData = await Promise.all(
        logsQuery.map(async (log) => {
          let artikel, regal;

          if (!log.isBackup) {
            artikel = await log.artikel.fetch();
            regal = await log.regal.fetch();
          }

          return {
            beschreibung: log.beschreibung,
            menge: log.menge,
            gesamtMenge: log.gesamtMenge,
            regalName: log.isBackup ? log.regal_id : regal ? regal.regalId : "",
            artikelName: log.isBackup ? log.gwId : artikel ? artikel.gwId : "", // Artikel Name
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
      <Text style={customStyles.time}>
        {item.createdAt.toLocaleString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          //weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={customStyles.beschreibung}>{item.beschreibung}</Text>
      <Text style={customStyles.artikel}>GWID: {item.artikelName}</Text>
      <Text style={customStyles.regal}>Regal: #{item.regalName}</Text>
      <Text style={customStyles.menge}>Menge: {item.menge}</Text>
      <Text style={customStyles.menge}>GesamtMenge: {item.gesamtMenge}</Text>
    </View>
  );

  return (
    <View style={customStyles.container}>
      <FlashList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={130}
      />
    </View>
  );
};

const customStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: styles.white,
    borderRadius: 10,
    flex: 1,
    elevation: 0,
    flex: 1,
  },
  logItem: {
    backgroundColor: styles.white,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 8,
  },
  time: { fontWeight: "bold", color: "#333" },
  beschreibung: { fontSize: 16, marginBottom: 5 },
  artikel: { color: "#666" },
  regal: { color: "#666" },
  menge: { color: "#666", fontWeight: "bold" },
});

export default LogsWidget;
