import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { database } from "../../database/database";

const InventoryWidget = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsCollection = database.get("logs");
        // Fetch all logs (or you can limit your query if needed)
        const latestLogs = await logsCollection.query().fetch();

        // Map over the first 3 logs and fetch the associated artikel for each log
        const logsData = await Promise.all(
          latestLogs.slice(0, 3).map(async (log) => {
            // Use .fetch() on the belongs-to relation to get the associated artikel record
            const artikel = await log.artikel.fetch();
            // If you also need the associated regal, do:
            // const regal = await log.regal.fetch();

            return {
              id: log.id,
              name: artikel.beschreibung, // using artikel's beschreibung
              gwid: artikel.gwId,
              menge: log.menge,
              status: artikel.status,
            };
          })
        );

        setLogs(logsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    async function testInsertAndFetch() {
      await database.write(async () => {
        // Delete all existing records from "artikel" and "logs"
        const allArtikel = await database.get("artikel").query().fetch();
        const allLogs = await database.get("logs").query().fetch();

        await database.batch(
          ...allArtikel.map((artikel) => artikel.prepareDestroyPermanently()),
          ...allLogs.map((log) => log.prepareDestroyPermanently())
        );

        // Create a single artikel record
        const artikel = await database.get("artikel").create((artikel) => {
          artikel.gwId = "123";
          artikel.firmenId = "firmen456";
          artikel.beschreibung = "Test Artikel";
          artikel.menge = 10;
          artikel.high = 5;
          artikel.mindestMenge = 2;
          artikel.kunde = "Test Kunde";
          artikel.ablaufdatum = Date.now();
        });

        // Create a single regal record
        const regal = await database.get("regale").create((regal) => {
          regal.fachName = "hans";
          regal.regalName = "mutter";
          regal.regalId = "123"; // Ensure this matches your model's field (@field("regal_id") regalId)
        });

        // Create 3 log records using a loop
        for (let i = 0; i < 3; i++) {
          await database.get("logs").create((log) => {
            log.beschreibung = `Test Log ${i + 1}`;
            log.datum = new Date().toISOString();
            log.menge = -5;
            // Use .set() to assign the belongs-to relationships
            log.artikel.set(artikel);
            log.regal.set(regal);
          });
        }

        // Optionally, fetch all logs and log the related artikel for each log
        const allCreatedLogs = await database.get("logs").query().fetch();
        for (const log of allCreatedLogs) {
          const relatedArtikel = await log.artikel.fetch();
        }
      });
    }
    testInsertAndFetch();
    fetchLogs();

    // const readArtikelWithLogs = async () => {
    //   try {
    //     // Query all artikel
    //     const artikels = await database.get("artikel").query().fetch();

    //     for (const artikel of artikels) {
    //       // Eager load related logs
    //       const logs = await artikel.logs.fetch(); // Load related logs

    //       // Log artikel and related logs
    //       console.log(`Artikel GW_ID: ${artikel.gwId}`);
    //       console.log(`Beschreibung: ${artikel.beschreibung}`);
    //       console.log(`Menge: ${artikel.menge}`);

    //       logs.forEach((log) => {
    //         console.log(`  Log Beschreibung: ${log.beschreibung}`);
    //         console.log(`  Log Datum: ${log.datum}`);
    //         console.log(`  Log Menge: ${log.menge}`);
    //       });

    //       console.log("-----------------------------");
    //     }
    //   } catch (error) {
    //     console.error("Error reading artikel with logs:", error);
    //   }
    // };
    // readArtikelWithLogs();
  }, []);

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
