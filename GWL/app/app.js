import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { database } from "../database/database";
import { styles } from "../components/styles";
import { LogBox, StatusBar } from "react-native";
import Toast from "react-native-toast-message";

import BottomTabNavigator from "./tabs/_layout";
import AktionenNavigator from "./actions/_layout";

import { toastConfig } from "../components/toastConfig";
import BarcodeScreen from "./scan/barcode";
import QrCodeScreen from "./scan/qrcode";
//import { testInsertAndFetch } from "../Old_Code/insertLogswithArtikel";
import SettingsScreen from "./other/settings";

import EditScreen from "./other/edit";

const Stack = createStackNavigator();
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function App() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);
    StatusBar.setBarStyle("dark-content");
    NavigationBar.setButtonStyleAsync("dark");

    /*    const checkFirstTimeAppOpen = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem("isFirstTimeAppOpen");

        if (isFirstTime === null) {
          // This is the first time the app is opened
          await testInsertAndFetch();
          await AsyncStorage.setItem("isFirstTimeAppOpen", "false");
        }
      } catch (error) {
        console.error("Error checking first time app open:", error);
      }
    };

    checkFirstTimeAppOpen(); */
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
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Einstellungen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
      />
      <Stack.Screen
        name="Bearbeiten"
        component={EditScreen}
        options={{
          title: "Bearbeiten",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
      />
      <Stack.Screen
        name="Scan\Barcode"
        component={BarcodeScreen}
        options={{
          title: "Barcode",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
      />
      <Stack.Screen
        name="Scan\Qrcode"
        component={QrCodeScreen}
        options={{
          title: "Qrcode",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
      />
      <Stack.Screen name="Actions" component={AktionenNavigator} />
    </Stack.Navigator>
  );
}
