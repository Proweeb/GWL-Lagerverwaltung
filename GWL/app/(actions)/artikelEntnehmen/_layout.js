import { Stack } from "expo-router";
import { styles } from "../../../components/styles";

export default function Layout() {
  return (
    <Stack>
      {/* Tab Navigator */}
      <Stack.Screen
        name="index"
        options={{
          title: "Artikel Entnehmen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
        }}
      />
    </Stack>
  );
}
