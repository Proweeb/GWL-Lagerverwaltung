import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient"; // Import the gradient

export default function TopTabNavigation({ state, descriptors, navigation }) {
  return (
    <View style={{ backgroundColor: "white", width: "100%" }}>
      <Text style={TopBarStyles.scanModeText}>Scan Mode</Text>
      <View style={TopBarStyles.container}>
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
              style={TopBarStyles.tabButton}
            >
              {isFocused && (
                <LinearGradient
                  colors={["rgba(0,0,0,0.17)", "rgba(0,0,0,0.05)"]}
                  style={TopBarStyles.insetShadow}
                />
              )}
              <Ionicons name={iconname} size={20} color={"black"} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const TopBarStyles = StyleSheet.create({
  scanModeText: {
    fontSize: 10,
    color: "#C0C0C0",
    fontWeight: "400",
    marginLeft: 20,
  },
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#F8F8FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    marginLeft: 20,
    marginBottom: 10,
    padding: 10,
    width: 100,
    elevation: 2,
  },
  tabButton: {
    padding: 10,
    position: "relative",
  },
  insetShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
});
