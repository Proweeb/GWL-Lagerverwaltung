import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { request, requestNotifications } from "react-native-permissions";
import { NavigationContainer } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { database } from "../database/database";
import { styles } from "../components/styles";
import * as Notifications from "expo-notifications";
import { LogBox } from "react-native";
import Toast from "react-native-toast-message";

import ScanScreen from "./scan/scan";
import BottomTabNavigator from "./tabs/_layout";
import AktionenNavigator from "./actions/_layout";

import { toastConfig } from "../components/toastConfig";

// Create Stack & Tab Navigators
const Stack = createStackNavigator();
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);

    NavigationBar.setButtonStyleAsync("dark");
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
      // …
    });
    const a = async () => {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    };
    //a();
    // Toast.show({
    //   type: "success",
    //   text1: "Artikel",
    //   text2: "haha ",
    // });
  }, []);

  return (
    <>
      <DatabaseProvider database={database}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </DatabaseProvider>
      <Toast config={toastConfig} />
    </>
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
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Actions" component={AktionenNavigator} />
    </Stack.Navigator>
  );
}
