import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomPopup = ({
  yellowButtonText,
  greenButtonText,
  redButtonText,
  cancelButtonText, // New prop for cancel button text
  yellowCallback,
  greenCallBack,
  redCallback,
  cancelCallback, // New prop for cancel button callback
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.popup}>
        {yellowButtonText && (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={yellowCallback}
          >
            <Text style={styles.editText}>{yellowButtonText}</Text>
          </TouchableOpacity>
        )}

        {greenButtonText && (
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={greenCallBack}
          >
            <Text style={styles.addText}>{greenButtonText}</Text>
          </TouchableOpacity>
        )}

        {redButtonText && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={redCallback}
          >
            <Text style={styles.deleteText}>{redButtonText}</Text>
          </TouchableOpacity>
        )}

        {cancelButtonText && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={cancelCallback}
          >
            <Text style={styles.cancelText}>{cancelButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  popup: {
    backgroundColor: "white",
    marginTop: 50,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  button: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  editButton: {
    backgroundColor: "#FDE4B2",
  },
  addButton: {
    backgroundColor: "#CDEEC6",
  },
  deleteButton: {
    backgroundColor: "#F8C8C8",
  },
  cancelButton: {
    backgroundColor: "#D3D3D3",
  },
  editText: {
    color: "#D8A157",
    fontSize: 16,
    fontWeight: "bold",
  },
  addText: {
    color: "#5A9F62",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteText: {
    color: "#D14242",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#555", // Grey color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomPopup;
