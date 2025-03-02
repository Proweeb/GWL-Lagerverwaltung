import React from "react";
import { TouchableOpacity, Text } from "react-native";

const FertigButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#00cc00",
        padding: 10,
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        margin: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 20 }}>Fertig</Text>
    </TouchableOpacity>
  );
};

export default FertigButton;
