import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const ArtikelVorschauView = ({ item, changedMenge }) => {
  const [gwId, setGwId] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [regalId, setRegalId] = useState("");

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        if (item) {
          const regal = await item.regal.fetch();
          setRegalId(regal.regalId);
          const artikel = await item.artikel.fetch();
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

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.text} numberOfLines={1}>
          {beschreibung}
        </Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.text} numberOfLines={1}>
          {gwId}
        </Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.text} numberOfLines={1}>
          {regalId}
        </Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.text} numberOfLines={1}>
          {item.menge}
        </Text>
      </View>

      <View style={styles.column}>
        <Text style={styles.text} numberOfLines={1}>
          {changedMenge[item._raw.gw_id + "" + item._raw.regal_id] ??
            item.menge}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 2,
    height: 35,
    borderBottomWidth: 2,
    padding: 5,
    borderBottomColor: "#ffffff",
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "#AFAFAF",
  },
});

export default ArtikelVorschauView;
