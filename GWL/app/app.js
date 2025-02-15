import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { database } from "../database/database";
import { styles } from "../components/styles";
import * as Notifications from "expo-notifications";

import TopTabNavigator from "./scan/_layout";
import BottomTabNavigator from "./tabs/_layout";
import AktionenNavigator from "./actions/_layout";
import ArtikelService from "../database/datamapper/ArtikelHelper";
import LogService from "../database/datamapper/LogHelper";
import RegalService from "../database/datamapper/RegalHelper";

// Create Stack & Tab Navigators
const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setButtonStyleAsync("dark");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Second, call scheduleNotificationAsync()
    Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Breaking News",
        subtitle: "Something interesting happened!",
        body: "Tap to read more...",
        color: "#FF5733", // Notification accent color
      },

      trigger: null,
    });
  }, []);

  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </DatabaseProvider>
  );
}

// Define Stack Navigator
function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        statusBarBackgroundColor: styles.backgroundColor,
        statusBarStyle: "dark",
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="Scan"
        component={TopTabNavigator}
        options={{
          headerShown: true,
          title: "Scan Item",
          headerTitleStyle: styles.header,
          headerBackButtonMenuEnabled: false,
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="Actions" component={AktionenNavigator} />
    </Stack.Navigator>
  );
}
