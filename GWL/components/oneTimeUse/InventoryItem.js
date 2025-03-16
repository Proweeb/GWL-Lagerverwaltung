import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { database } from "../../database/database";
import { styles } from "../../components/styles";
import { Q } from "@nozbe/watermelondb";

const InventoryItem = ({ item, changedMenge, setChangedMenge }) => {
  const [gwId, setGwId] = useState("");
  const [beschreibung, setBeschreibung] = useState("");

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const artikel = await database
          .get("artikel")
          .query(Q.where("id", item._raw.gw_id))
          .fetch();

        if (artikel.length > 0) {
          setGwId(String(artikel[0].gwId));
        }
      } catch (error) {
        console.error("Error fetching artikel:", error);
      }
    };

    fetchArtikel();
  }, [item]);

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const artikel = await database
          .get("artikel")
          .query(Q.where("id", item._raw.gw_id))
          .fetch();

        if (artikel.length > 0) {
          setBeschreibung(String(artikel[0].beschreibung));
        }
      } catch (error) {
        console.error("Error fetching artikel:", error);
      }
    };

    fetchArtikel();
  }, [item]);

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          backgroundColor: styles.backgroundColor,
          width: "90%",
          borderRadius: 20,
          elevation: 2,
          padding: 20,
          margin: 20,
        }}
      >
        <Text style={styles.subHeader}>{beschreibung || "Laden..."}</Text>
        <Text style={styles.subHeader}>ID: {gwId || "Laden..."}</Text>
        <Text style={styles.subHeader}>Soll: {item.menge}</Text>

        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ width: "20%" }}>
            <Text style={styles.subHeader}>Haben:</Text>
          </View>

          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: styles.white,
              elevation: 2,
              paddingLeft: 5,
              width: "80%",
            }}
          >
            <TextInput
              style={[styles.subHeader, { marginBottom: 0, width: "100%" }]}
              keyboardType="numeric"
              value={changedMenge[item._raw.gw_id] || ""}
              onChangeText={(text) => {
                setChangedMenge((prev) => ({
                  ...prev,
                  [item._raw.gw_id]: text, // Use `_raw.gw_id` for correct key
                }));
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default InventoryItem;
