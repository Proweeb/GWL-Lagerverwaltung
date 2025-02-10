import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { styles } from "../components/styles";
import { database } from "../database/database";
import { DatabaseProvider } from "@nozbe/watermelondb/react";

export default function Layout() {
  useEffect(() => {
    console.log("Background Color:", styles.backgroundColor);
    SystemUI.setBackgroundColorAsync(styles.backgroundColor);
    NavigationBar.setBackgroundColorAsync(styles.backgroundColor);
    console.log("Fabric Enabled:", global?.nativeFabricUIManager);
  }, []); // ✅ Run only once

  return (
    <DatabaseProvider database={database}>
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
            presentation: "card",
            headerShadowVisible: false,
            headerBackVisible: false,
          }}
        />
      </Stack>
    </DatabaseProvider>
  );
}
