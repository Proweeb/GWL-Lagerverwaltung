import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../styles";

const FertigButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: styles.lightGreen,
        padding: 10,
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        margin: 20,
      }}
    >
      <Text style={{ color: styles.green, fontSize: 20, fontWeight: "bold" }}>
        Bestätigen
      </Text>
    </TouchableOpacity>
  );
};

export default FertigButton;
