import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "../styles";

const ActionButton = ({ FertigCallBack, CancelCallBack, isDone }) => {
  useEffect(() => {}), [isDone];

  return (
    <TouchableOpacity
      onPress={isDone ? FertigCallBack : CancelCallBack}
      disabled={!isDone}
      style={{
        backgroundColor: isDone ? "#dcebf9" : styles.lightRed,
        padding: 10,
        borderRadius: 5,
        height: 50,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        opacity: isDone ? 1 : 0.5,
      }}
    >
      <Text style={{ color: isDone ? "#30A6DE" : "#fc2024", fontSize: 20 }}>
        {isDone ? "Fertig" : "Zurück"}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
