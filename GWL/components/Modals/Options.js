import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { styles as globalStyles } from "../styles";

const Options = ({ options, setSelected, onClose }) => {
  return (
    <TouchableWithoutFeedback style={styles.container} onPress={onClose}>
        <View style={styles.container}>
      <View style={styles.popup}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button]}
            onPress={() => {
              setSelected(option);
              onClose && onClose();
            }}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
    </TouchableWithoutFeedback>
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
    backgroundColor: globalStyles.backgroundColor,
    marginTop: 50,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 200,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: globalStyles.white,
    elevation:10
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Options; 