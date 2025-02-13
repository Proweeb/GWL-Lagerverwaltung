import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { database } from "../database/database";
import { styles } from "../components/styles";

import TopTabNavigator from "./scan/_layout";
import BottomTabNavigator from "./tabs/_layout";
import AktionenNavigator from "./actions/_layout";
import { insertArtikel } from "../database/test";
import { insertLogs } from "../database/test";

// Create Stack & Tab Navigators
const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);
    insertArtikel();
    insertLogs();
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
