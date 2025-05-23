import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import useLogStore from "../../store/logStore";
import { styles } from "../styles";

const LogsWidget = ({ startDate, endDate }) => {
  const { logs, loading, error, fetchLogs } = useLogStore();
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    const filterLogs = () => {
      const filtered = logs.filter((log) => {
        const logDate = new Date(log.createdAt);
        return logDate >= startDate && logDate <= endDate;
      });
      setFilteredLogs(filtered);
    };

    filterLogs();
  }, [logs, startDate, endDate]);

  const renderLogItem = ({ item }) => {
    const { createdAt, beschreibung, gwId, regalId, menge, gesamtMenge } = item;

    return (
      <View style={customStyles.logItem}>
        {createdAt && (
          <Text style={customStyles.time}>
            {new Date(createdAt).toLocaleString("de-DE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
        {beschreibung && (
          <Text style={customStyles.beschreibung}>{beschreibung}</Text>
        )}
        {gwId && <Text style={customStyles.artikel}>GWID: {gwId}</Text>}
        {regalId && <Text style={customStyles.regal}>Regal: {regalId}</Text>}
        {menge !== null && menge !== undefined && (
          <Text style={customStyles.menge}>Menge: {menge}</Text>
        )}
        {gesamtMenge !== null && gesamtMenge !== undefined && (
          <Text style={customStyles.menge}>Gesamtmenge: {gesamtMenge}</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={customStyles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={customStyles.container}>
        <Text style={customStyles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!filteredLogs || filteredLogs.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Keine Logs im ausgewählten Zeitraum vorhanden</Text>
      </View>
    );
  }

  return (
    <View style={customStyles.container}>
      <FlashList
        data={filteredLogs}
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
    backgroundColor: styles.backgroundColor,
    borderRadius: 10,
    flex: 1,
    elevation: 6,
  },
  logItem: {
    backgroundColor: styles.white,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 8,
    flex: 1,
  },
  time: { fontWeight: "bold", color: "#333" },
  beschreibung: { fontSize: 16, marginBottom: 5 },
  artikel: { color: "#666" },
  regal: { color: "#666" },
  menge: { fontWeight: "bold" },
  error: { color: "red" },
});

export default LogsWidget;
