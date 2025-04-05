import React, { useEffect, useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { styles as theme } from "../styles";
import useLogStore from "../../store/logStore";

const InventoryWidget = () => {
  const { logs, loading, error, fetchLogs } = useLogStore();

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {

    const validDescriptions = new Set(["Entnehmen", "Einlagern", "Nachfüllen"]);

    return logs
      .filter(log => !log.isBackup && validDescriptions.has(log.beschreibung))
      .sort((a, b) => b.createdAt - a.createdAt) // Direct timestamp comparison
      .slice(0, 3)
      .map(log => ({
        id: log.id,
        name: log.artikelName,
        gwid: log.gwId,
        menge: log.menge,
        status: log.status || "None",
        datum: new Date(log.createdAt).toLocaleString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      }));
  }, [logs]);

  const getTextColor = (status) => {
    switch (status) {
      case "low":
        return "orange";
      case "out":
        return "red";
      case "ok":
        return "green";
      default:
        return "black";
    }
  };

  const getMengeColor = (menge) => {
    if (menge == 0) {
      return "grey";
    }
    if (menge < 0) {
      return "red";
    } else {
      return "green";
    }
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: "red" }]}>Error: {error}</Text>
      </View>
    );
  }

  if (filteredLogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Keine Lagerbewegung bis jetzt</Text>
      </View>
    );
  }

  return (
    <>
      {filteredLogs.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={[styles.text, styles.name]} numberOfLines={1}>
            {item.name}
          </Text>

          <Text style={[styles.text, styles.gwid]} numberOfLines={1}>
            #{item.gwid}
          </Text>

          <Text
            style={[
              styles.text,
              styles.menge,
              { color: getMengeColor(item.menge) },
            ]}
            numberOfLines={1}
          >
            {item.menge == 0
              ? item.menge
              : item.menge < 0
              ? item.menge
              : `+${item.menge}`}
          </Text>

          <View style={styles.statusContainer}>
            <View style={[styles.statusBox, styles[item.status]]}>
              <Text
                style={[
                  styles.statusText,
                  { color: getTextColor(item.status) },
                ]}
                numberOfLines={1}
              >
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    backgroundColor: "white",
    borderRadius: 6,
    elevation: 2,
    flex: 1,
  },
  text: {
    flex: 1,
    overflow: "hidden",
    fontSize: RFPercentage(1.7),
  },
  name: { fontWeight: "bold", textAlign: "center" },
  gwid: { color: "#777", textAlign: "center" },
  menge: { fontWeight: "bold", textAlign: "center" },
  statusContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBox: {
    width: "60%",
    borderRadius: 30,
    elevation: 2,
    overflow: "hidden",
    paddingVertical: 1,
  },
  statusText: {
    textAlign: "center",
    fontSize: RFPercentage(1.5),
    fontWeight: "bold",
  },
  out: { backgroundColor: "#FFEEEE" },
  ok: { backgroundColor: theme.lightGreen },
  low: { backgroundColor: "#FFF4D8" },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  emptyText: {
    fontSize: RFPercentage(2),
    fontWeight: "700",
    color: "#555",
  },
});

export default InventoryWidget;
