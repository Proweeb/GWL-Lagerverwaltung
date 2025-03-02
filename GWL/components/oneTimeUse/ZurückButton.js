import React from "react";
import { TouchableOpacity, Text } from "react-native";

const ZurückButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#ff4d4d",
        padding: 10,
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        width: "auto",
        marginRight: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 20 }}>Zurück</Text>
    </TouchableOpacity>
  );
};

export default ZurückButton;
