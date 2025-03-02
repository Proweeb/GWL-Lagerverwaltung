import React from "react";
import { TouchableOpacity, Text } from "react-native";

const WeiterButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#dcebf9",
        padding: 10,
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        width: "auto",
      }}
    >
      <Text style={{ color: "#30A6DE", fontSize: 20 }}>Weiter</Text>
    </TouchableOpacity>
  );
};

export default WeiterButton;
