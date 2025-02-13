import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as theme from "../styles";

const InventoryWidget = () => {
  const [logs, setLogs] = useState([
    {
      id: "FfRpvFbXTpvtgPZu",
      name: "Kiwi",
      gwid: 12323234,
      menge: 5,
      status: "high",
    },
    {
      id: "aL9tkhWgAhTuh1sw",
      name: "Baby Oil",
      gwid: 23456789,
      menge: 1,
      status: "low",
    },
    {
      id: "LTg8VRPkngH8lweG",
      name: "TV",
      gwid: 3,
      menge: -403,
      status: "out",
    },
  ]);

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
          <View style={{ flex: 1 }}>
            <View style={[styles.status, styles[item.status]]}>
              <Text style={[styles.text, styles.statusText]} numberOfLines={1}>
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
    justifyContent: "space-between", // Ensure properties are spaced out
    alignItems: "center",
    padding: 5,
    backgroundColor: "#F8F8FF",
    borderRadius: 10,
    marginBottom: 5,
    elevation: 4,
    height: "30%",
  },
  text: {
    flex: 1, // Allow each property to take equal space
    marginRight: 5, // Spacing between the properties
    overflow: "hidden", // Hide overflow text
    textOverflow: "ellipsis", // Adds ellipsis when text overflows
  },
  name: {
    fontWeight: "bold",
    textAlign: "center",
  },
  gwid: {
    color: "#777",
    textAlign: "center",
  },
  menge: {
    fontWeight: "bold",
    textAlign: "center",
  },
  status: {
    height: "100%",
    padding: 5,
    borderRadius: 50,
  },
  high: { backgroundColor: "#c8f7c5" },
  low: { backgroundColor: "#f9e79f" },
  out: { backgroundColor: "#f5b7b1" },
  statusText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default InventoryWidget;
