import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../styles";

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={{ width: "100%", backgroundColor: styles.backgroundColor }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: styles.white,
          marginBottom: 10,
          marginHorizontal: 15,
          borderRadius: 20,
          padding: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = {
            index: "home",
            backup: "settings-backup-restore",
            inventur: "inventory",
            waren: "content-paste",
            settings: "settings",
          }[route.name];

          return (
            <TouchableOpacity
              key={route.name}
              onPress={() => navigation.navigate(route.name)}
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: 15,
                paddingVertical: 4,
                backgroundColor: isFocused
                  ? styles.lightLightBlue
                  : "transparent",
              }}
            >
              <MaterialIcons
                name={iconName}
                size={24}
                color={isFocused ? styles.blue : "gray"}
              />
              {isFocused && (
                <Text
                  style={{
                    color: styles.blue,
                    fontSize: styles.fontSize,
                    flexShrink: 1,
                    textAlign: "center",
                  }}
                  textBreakStrategy="simple"
                >
                  {options.title}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
