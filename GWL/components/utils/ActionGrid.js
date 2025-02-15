import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";

const ActionGrid = ({ actions }) => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const iconSize = width * 0.1;
  return (
    <View style={styles.container}>
      {/* Render items in two rows of three */}
      {actions.map((action, index) => (
        <View key={index} style={styles.row}>
          {action.map(
            (
              {
                screen,
                iconName,
                iconType,
                label,
                route,
                topLabel,
                thirdLevel,
              },
              idx
            ) => {
              const IconComponent =
                iconType === "MaterialCommunityIcons"
                  ? MaterialCommunityIcons
                  : Ionicons;

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.box}
                  onPress={() =>
                    navigation.navigate("Actions", { screen: route })
                  }
                >
                  <IconComponent
                    name={iconName}
                    size={iconSize}
                    color="black"
                  />

                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
    height: "50%",
  },
  box: {
    alignItems: "center",
    //width: "33.3%", // Ensures equal width for each box
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  text: {
    color: "#292D32",
    textAlign: "center",
    fontSize: RFPercentage(1.6),
    width: "90%", // Prevents text overflow
    flexShrink: 1, // Prevents text from expanding
    fontWeight: "400",
  },
});

export default ActionGrid;
