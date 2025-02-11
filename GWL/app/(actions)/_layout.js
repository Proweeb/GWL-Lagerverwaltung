import { Stack, useRouter } from "expo-router";

import { styles } from "../../components/styles";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTitleStyle: styles.header,
      }}
    >
      <Stack.Screen
        name="platzHinzufügen"
        options={{ title: "Lagerplatz hinzufügen" }}
      />
      <Stack.Screen
        name="aritkelplatzHinzufügen"
        options={{ title: "Lagerplatz mit Artikel hinzufügen" }}
      />
      <Stack.Screen
        name="artikelNachfüllen"
        options={{ title: "Artikel nachfüllen" }}
      />
      <Stack.Screen
        name="artikelEinlagern"
        options={{ title: "Artikel einlagern" }}
      />
      <Stack.Screen
        name="artikelEntnehmen"
        options={{ title: "Artikel entnehmen" }}
      />
      <Stack.Screen name="lager" options={{ title: "Lager verwalten" }} />
    </Stack>
  );
}
