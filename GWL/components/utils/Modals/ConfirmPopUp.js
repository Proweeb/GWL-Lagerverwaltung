import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ConfirmPopup = ({
  greenMode = true,
  text,
  greyCallback,
  colorCallback,
}) => {
  // Dynamic colors based on greenMode
  const accentColor = greenMode ? "#5A9F62" : "#D14242";
  const bgColor = greenMode ? "#CDEEC6" : "#F8C8C8";

  return (
    <View style={styles.container}>
      <View style={styles.popup}>
        {/* Icon */}
        <View
          style={[
            styles.icon,
            { backgroundColor: bgColor, borderRadius: 32 / 2, padding: 1 },
          ]}
        >
          <MaterialIcons name="error-outline" size={32} color={accentColor} />
        </View>

        {/* Message */}
        <Text style={styles.message}>
          {text
            ? text
            : "Bist du sicher, dass du diesen Artikel löschen möchtest?\n" +
              "Diese Aktion kann nicht rückgängig gemacht werden."}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Abbrechen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: bgColor }]}
          >
            <Text style={[styles.confirmText, { color: accentColor }]}>
              {greenMode ? "Bestätigen" : "Löschen"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent overlay
  },
  popup: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#D3D3D3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmPopup;
