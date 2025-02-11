import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { styles } from "../components/styles";
import { database } from "../database/database";
import { DatabaseProvider } from "@nozbe/watermelondb/react";

export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);
  }, []); // ✅ Run only once

  return (
    <DatabaseProvider database={database}>
      <Stack
        initialRouteName="tabs"
        screenOptions={{
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerShown: false, // No header on this screen
        }}
      >
        {/* Main Tab Navigator */}
        <Stack.Screen name="(tabs)" />

        {/* Hidden Screens */}
        <Stack.Screen
          name="(scan)"
          options={{
            headerShown: true,
            statusBarBackgroundColor: styles.backgroundColor,
            statusBarStyle: "dark",
            title: "Scan Item",
            headerTitleStyle: [styles.header],
            headerBackButtonMenuEnabled: false,
            headerShadowVisible: false,
            headerBackVisible: false,
          }}
        />

        <Stack.Screen name="(actions)" />
      </Stack>
    </DatabaseProvider>
  );
}
