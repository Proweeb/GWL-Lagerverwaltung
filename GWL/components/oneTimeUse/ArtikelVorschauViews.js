import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { database } from "../../database/database";
import { styles } from "../../components/styles";
import { Q } from "@nozbe/watermelondb";

const ArtikelVorschauView = ({ item, changedMenge }) => {
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
    <View
      style={{
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
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#333",
          textAlign: "left",
          width: "25%",
        }}
      >
        {beschreibung}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#AFAFAF",
          textAlign: "center",
          width: "25%",
        }}
      >
        {gwId}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#AFAFAF",
          textAlign: "center",
          width: "25%",
        }}
      >
        {item.menge}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "#AFAFAF",
          textAlign: "center",
          width: "25%",
        }}
      >
        {changedMenge[item.gwId] != null ? changedMenge[item.gwId] : item.menge}
      </Text>
    </View>
  );
};

export default ArtikelVorschauView;
