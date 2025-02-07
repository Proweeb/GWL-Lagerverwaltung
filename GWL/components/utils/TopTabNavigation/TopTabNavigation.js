import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function TopTabNavigation({ state, descriptors, navigation }) {
  return (
    <View style={{ backgroundColor: "white", width: "100%" }}>
      <Text
        style={{
          fontSize: 10,
          color: "#C0C0C0",
          fontWeight: 400,
          marginLeft: 20,
        }}
      >
        Scan Mode
      </Text>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;

          const iconname =
            label === "Barcode" ? "barcode-outline" : "qr-code-outline";
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.activeTab]}
            >
              <Ionicons name={iconname} size={20} color={"black"} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    width: 100,
    backgroundColor: "#F8F8FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    marginTop: 0,
    marginLeft: 20,
    marginBottom: 10,
    padding: 10,
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    boxShadow: "0 4 4 0 rgba(0,0,0,0.25) inset",
    borderRadius: 10,
  },
});
