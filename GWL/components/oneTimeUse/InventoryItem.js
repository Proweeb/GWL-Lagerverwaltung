import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { database } from "../../database/database";
import { styles } from "../../components/styles";
import { Q } from "@nozbe/watermelondb";

const InventoryItem = ({ item, changedMenge, setChangedMenge }) => {
  const [gwId, setGwId] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [localmenge, setMenge] = useState("");
  const [regalId, setRegalId] = useState("");

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        if (item) {
          const regal = await item.regal.fetch();
          setRegalId(regal.regalId);
          //console.log(item.artikel);
          const artikel = await item.artikel.fetch();
          console.log("+++++++++++++++++++");
          console.log(artikel);
          if (artikel.gwId) {
            setGwId(String(artikel.gwId));
            setBeschreibung(String(artikel.beschreibung));
          }
        }
      } catch (error) {
        console.error("Error fetching artikel:", error);
      }
    };

    fetchArtikel();
  }, [item]);

  useEffect(() => {}, [changedMenge]);

  return (
    <View style={{ alignItems: "center", width: "100%", height: "100%" }}>
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
        <Text style={styles.subHeader}>Regal: {regalId || "Laden..."}</Text>
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
              style={[styles.subHeader, { marginBottom: 0, width: "80%" }]}
              keyboardType="numeric"
              value={localmenge}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "");
                setMenge(numericText);
                setChangedMenge((prev) => ({
                  ...prev,
                  [item._raw.gw_id + "" + item._raw.regal_id]: numericText, // Use `_raw.gw_id` for correct key
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
