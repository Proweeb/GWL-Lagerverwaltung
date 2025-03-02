import React from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "../styles";

const ArtikelVorschau = ({ artikelList }) => {
  return (
    <View style={{ flex: 1, width: "100%", paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Artikel Vorschau
      </Text>

      <FlatList
        data={artikelList}
        keyExtractor={(item) => item.gwId.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              justifyContent: "space-between",
              paddingVertical: 5,
              backgroundColor: styles.backgroundColor,
              width: "90%",
              borderRadius: 20,
              elevation: 2,
              padding: 20,
              margin: 5,
              alignSelf: "center",
            }}
          >
            <Text style={styles.subHeader}>
              Beschreibung: {item.beschreibung}
            </Text>
            <Text style={styles.subHeader}>ID: {item.gwId}</Text>
            <Text style={styles.subHeader}>Menge: {item.menge}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ArtikelVorschau;
