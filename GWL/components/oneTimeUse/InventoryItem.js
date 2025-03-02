import React from "react";
import { View, Text, TextInput } from "react-native";

import { styles } from "../../components/styles";

const InventoryItem = ({ item, changedMenge, setChangedMenge }) => {
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
        <Text style={styles.subHeader}>{item.beschreibung}</Text>
        <Text style={styles.subHeader}>ID: {item.gwId}</Text>
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
              defaultValue={changedMenge[item.gwId] || ""}
              onChangeText={(text) => {
                setChangedMenge((prev) => ({
                  ...prev,
                  [item.gwId]: text,
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
