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
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
      }}
    >
      <Text style={{ color: "#30A6DE", fontSize: 20 }}>Weiter</Text>
    </TouchableOpacity>
  );
};

export default WeiterButton;
