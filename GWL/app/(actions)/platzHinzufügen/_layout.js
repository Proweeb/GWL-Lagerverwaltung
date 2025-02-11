import { Stack } from "expo-router";
import { styles } from "../../../components/styles";

export default function Layout() {
  return (
    <Stack>
      {/* Tab Navigator */}
      <Stack.Screen
        name="index"
        options={{
          title: "Lagerplaty Hinzufügen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
        }}
      />
    </Stack>
  );
}
