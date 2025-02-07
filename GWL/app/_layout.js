import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { styles } from "../components/styles";
export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);
  });
  return (
    <Stack>
      {/* Tab Navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
        }}
      />

      {/* Hidden Screens (Not in Tabs) */}
      <Stack.Screen
        name="(scan)"
        options={{
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          title: "Scan Item",
          headerTitleStyle: [styles.header],

          headerBackButtonMenuEnabled: false,
          presentation: "card",
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
