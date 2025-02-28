import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { database } from "../../database/database";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Q } from "@nozbe/watermelondb";
import { testInsertAndFetch } from "../../Old_Code/insertLogswithArtikel";

const InventoryWidget = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsCollection = database.get("logs");

        const subscription = logsCollection
          .query(
            Q.sortBy("created_at", "desc"),
            Q.take(3) // Limit to the latest 3 logs
          )
          .observe()
          .subscribe(async (latestLogs) => {
            if (latestLogs.length === 0) {
              setLogs([]);
              return;
            }

            const logsData = await Promise.all(
              latestLogs.map(async (log) => {
                const artikel = await log.artikel.fetch();
                const regal = await log.regal.fetch();

                return {
                  id: log.id,
                  name: artikel.beschreibung,
                  gwid: artikel.gwId,
                  menge: log.menge,
                  status: artikel.status,
                  fachName: regal.fachName,
                  regalName: regal.regalName,
                  datum: new Date(log.createdAt).toLocaleString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                };
              })
            );

            setLogs(logsData);
          });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    testInsertAndFetch();
    fetchLogs();
  }, []);

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
    if (menge < 0) {
      return "red";
    } else {
      return "green";
    }
  };
  if (logs.length == 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Keine Lagerbewegung bis jetzt</Text>
      </View>
    );
  }

  return (
    <>
      {logs.map((item) => (
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
            {item.menge < 0 ? item.menge : `+${item.menge}`}
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
    width: "80%",
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
  ok: { backgroundColor: "#CDEDD8" },
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
