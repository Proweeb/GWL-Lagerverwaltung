import { on } from "@nozbe/watermelondb/QueryDescription";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const InventurButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#30A6DE",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        top: "45%",
      }}
    >
      <Text style={{ color: "white", fontSize: 18 }}>Inventur starten</Text>
    </TouchableOpacity>
  );
};

export default InventurButton;
