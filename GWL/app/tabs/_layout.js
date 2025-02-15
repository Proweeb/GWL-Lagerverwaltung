import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";
import { styles } from "../../components/styles";

// Import Screens
import InventurScreen from "./inventur";
import HomeScreen from "./home";
import BackupScreen from "./backup";
import LogsScreen from "./logs";
import WarenScreen from "./waren";
// Import Custom Tab Bar (if you have one)
import { CustomTabBar } from "../../components/utils/BottomTabNavigationbar/BottomTabNavigationBar";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

// Create Bottom Tabs
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />} // Custom Tab Bar (if applicable)
      initialRouteName="Home"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: styles.header,
        headerStyle: {
          height: heightPercentageToDP(10),
        },
      }}
    >
      {/* Inventur Tab */}
      <Tab.Screen
        name="Inventur"
        component={InventurScreen}
        options={{
          title: "Inventur",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="inventory" size={size} color={color} />
          ),
        }}
      />

      {/* Waren Tab */}
      <Tab.Screen
        name="Waren"
        component={WarenScreen}
        options={{
          title: "Waren",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="package-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",

          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: "transparent",

                width: widthPercentageToDP(20), // Fixed dimensions for consistency
                height: heightPercentageToDP(10),
                borderRadius: 20, // Optional: Make it circular
                overflow: "hidden",
              }}
            >
              <Image
                source={require("../../assets/adaptive-icon.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Backup Tab */}
      <Tab.Screen
        name="Backup"
        component={BackupScreen}
        options={{
          title: "Backup",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="backup" size={size} color={color} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tab.Screen
        name="logs"
        component={LogsScreen}
        options={{
          title: "Logs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
