import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install this

export default function MoreOptionsButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10, // Makes touch area larger
    alignItems: "center",
    justifyContent: "center",
  },
});
