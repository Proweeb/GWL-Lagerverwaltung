import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { database } from "../../database/database";

const InventoryWidget = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // const fetchLogs = async () => {
    //   try {
    //     const logsCollection = database.get("logs");
    //     // Fetch the latest 3 logs with associated artikel
    //     const latestLogs = await logsCollection.query().fetch();
    //     //console.log(Object.values(latestLogs[0]._raw));
    //     const logsData = await Promise.all(
    //       latestLogs.slice(0, 3).map(async (log) => {
    //         const artikel = await log.regal; // Fetch the associated artikel data
    //         console.log(Object.values(log.artikel));
    //         return {
    //           id: log.id,
    //           name: log.beschreibung,
    //           gwid: log.gw_id,
    //           menge: log.menge,
    //           status: getStatus(log.menge, 0, 10),
    //         };
    //       })
    //     );
    //     setLogs(logsData);
    //   } catch (error) {
    //     console.error("Error fetching logs:", error);
    //   }
    // };
    // fetchLogs();

    const readArtikelWithLogs = async () => {
      try {
        // Query all artikel
        const artikels = await database.get("artikel").query().fetch();

        for (const artikel of artikels) {
          // Eager load related logs
          const logs = await artikel.logs.fetch(); // Load related logs

          // Log artikel and related logs
          console.log(`Artikel GW_ID: ${artikel.gw_id}`);
          console.log(`Beschreibung: ${artikel.beschreibung}`);
          console.log(`Menge: ${artikel.menge}`);

          logs.forEach((log) => {
            console.log(`  Log Beschreibung: ${log.beschreibung}`);
            console.log(`  Log Datum: ${log.datum}`);
            console.log(`  Log Menge: ${log.menge}`);
          });

          console.log("-----------------------------");
        }
      } catch (error) {
        console.error("Error reading artikel with logs:", error);
      }
    };
    readArtikelWithLogs();
  }, []);

  const getStatus = (menge, mindestmenge, high) => {
    if (menge <= mindestmenge) return "low";
    if (menge >= high) return "high";
    return "out";
  };

  const getColor = (menge) => (menge > 0 ? "green" : "red");

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
            style={[styles.text, styles.menge, { color: getColor(item.menge) }]}
            numberOfLines={1}
          >
            {item.menge < 0 ? item.menge : "+" + item.menge}
          </Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={[
                { width: "80%", borderRadius: 30, elevation: 4 },
                styles[item.status],
              ]}
            >
              <Text style={[{ textAlign: "center" }]} numberOfLines={1}>
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
    padding: 5,
    backgroundColor: "#F8F8FF",
    borderRadius: 10,
    marginBottom: 5,
    elevation: 4,
    height: "30%",
  },
  text: {
    flex: 1,
    marginRight: 5,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  name: { fontWeight: "bold", textAlign: "center" },
  gwid: { color: "#777", textAlign: "center" },
  menge: { fontWeight: "bold", textAlign: "center" },
  high: { backgroundColor: "#c8f7c5" },
  low: { backgroundColor: "#f9e79f" },
  out: { backgroundColor: "#f5b7b1" },
});

export default InventoryWidget;
