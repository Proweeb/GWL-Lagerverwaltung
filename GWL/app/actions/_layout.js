import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PlatzHinzufügenNavigator from "./platzHinzufügen/_layout";
import ArtikelPlatzHinzufügenNavigator from "./artikelPlatzHinzufügen/_layout";
import ArtikelNachfüllenNavigator from "./artikelNachfüllen/_layout";
import ArtikelEinlagernNavigator from "./artikelHinzufügen/_layout";
import ArtikelEntnehmenNavigator from "./artikelEntnehmen/_layout";
import LagerNavigator from "./lager/_layout";

const Stack = createStackNavigator();

export default function AktionenNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LagerScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="LagerNavigator"
        component={LagerNavigator}
        options={{ title: "Lager verwalten" }}
      />
      <Stack.Screen
        name="PlatzHinzufügenNavigator"
        component={PlatzHinzufügenNavigator}
        options={{ title: "Lagerplatz hinzufügen" }}
      />
      <Stack.Screen
        name="ArtikelPlatzHinzufügenNavigator"
        component={ArtikelPlatzHinzufügenNavigator}
        options={{ title: "Lagerplatz&Artikel" }}
      />
      <Stack.Screen
        name="ArtikelNachfüllenNavigator"
        component={ArtikelNachfüllenNavigator}
        options={{ title: "Artikel nachfüllen" }}
      />
      <Stack.Screen
        name="ArtikelEinlagernNavigator"
        component={ArtikelEinlagernNavigator}
        options={{ title: "Artikel einlagern" }}
      />
      <Stack.Screen
        name="ArtikelEntnehmenNavigator"
        component={ArtikelEntnehmenNavigator}
        options={{ title: "Artikel entnehmen" }}
      />
    </Stack.Navigator>
  );
}
