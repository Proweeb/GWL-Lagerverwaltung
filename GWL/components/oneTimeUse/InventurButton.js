import React from "react";
import { TouchableOpacity, Text } from "react-native";

const InventurButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#dcebf9",
        padding: 10,
        borderRadius: 5,
        height: 50,
        width: "auto",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
        top: "45%",
      }}
    >
      <Text style={{ color: "#30A6DE", fontSize: 20 }}>Inventur starten</Text>
    </TouchableOpacity>
  );
};

export default InventurButton;
