import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomTabBar } from "../../components/utils/BottomTabNavigationbar/BottomTabNavigationBar";
import { styles } from "../../components/styles";

export default function Layout() {
  const router = useRouter();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="index"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: styles.header,
      }}
    >
      <Tabs.Screen name="inventur" options={{ title: "Inventur" }} />
      <Tabs.Screen name="waren" options={{ title: "Waren" }} />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: "30%",

                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Image
                source={require("../../assets/adaptive-icon.png")}
                style={{
                  resizeMode: "center",
                  width: "100%",
                }}
              ></Image>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen name="backup" options={{ title: "Backup" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
