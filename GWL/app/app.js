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
import { LogBox, StatusBar } from "react-native";
import Toast from "react-native-toast-message";

import BottomTabNavigator from "./tabs/_layout";
import AktionenNavigator from "./actions/_layout";

import { toastConfig } from "../components/toastConfig";
import BarcodeScreen from "./scan/barcode";
import QrCodeScreen from "./scan/qrcode";
import { testInsertAndFetch } from "../Old_Code/insertLogswithArtikel";
import SettingsScreen from "./other/settings";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import ArtikelService from "../database/datamapper/ArtikelHelper";
import EditScreen from "./other/edit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   const allArticles = await ArtikelService.getAllArtikel();
//   const filteredArticles = allArticles.filter((article) =>
//     ["Kritisch", "Abgelaufen", "Warnung"].includes(article.isExpired)
//   );

//   console.log(
//     `[DEBUG] Background fetch task executed at ${new Date().toISOString()}`
//   );
//   //  console.log(filteredArticles);

//   return BackgroundFetch.BackgroundFetchResult.NewData;
// });

// async function registerBackgroundFetchAsync() {
//   try {
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//       minimumInterval: 1 * 60, // 1 minute
//       stopOnTerminate: false, // android only
//       startOnBoot: true, // android only
//     });
//     console.log("Background fetch task registered successfully");
//   } catch (err) {
//     console.error("Background fetch task registration failed:", err);
//   }
// }

// async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
// }
// // Create Stack & Tab Navigators
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
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
      // …
    });

    const a = async () => {
      //await unregisterBackgroundFetchAsync();
      //await registerBackgroundFetchAsync();
      //   await Notifications.setNotificationHandler({
      //     handleNotification: async () => ({
      //       shouldShowAlert: true,
      //       shouldPlaySound: true,
      //       shouldSetBadge: true,
      //     }),
      //   });
    };
    a();
    const checkFirstTimeAppOpen = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem('isFirstTimeAppOpen');
        
        if (isFirstTime === null) {
          // This is the first time the app is opened
          await testInsertAndFetch();
          await AsyncStorage.setItem('isFirstTimeAppOpen', 'false');
        }
      } catch (error) {
        console.error('Error checking first time app open:', error);
      }
    };

    checkFirstTimeAppOpen();
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
