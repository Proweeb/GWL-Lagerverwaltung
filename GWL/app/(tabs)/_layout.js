import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CustomTabBar } from "../../components/utils/BottomTabNavigationbar/BottomTabNavigationBar";
import { styles } from "../../components/styles";

export default function Layout() {
  const router = useRouter();

  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="index"
        screenOptions={{ headerShadowVisible: false }}
      >
        <Tabs.Screen name="inventur" options={{ title: "Inventur" }} />
        <Tabs.Screen name="waren" options={{ title: "Waren" }} />
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="backup" options={{ title: "Backup" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>

      {/* Floating Scan Button */}
      <TouchableOpacity
        onPress={() => router.push("(scan)/barcode")}
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: [{ translateX: -30 }],
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: styles.lightBlue,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
        }}
      >
        <Ionicons name="scan" size={30} color={styles.backgroundColor} />
      </TouchableOpacity>
    </>
  );
}
