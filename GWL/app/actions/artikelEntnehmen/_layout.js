import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "./index"; // The main screen inside artikelEntnehmen

const Stack = createStackNavigator();

export default function ArtikelEntnehmenNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="index"
        component={IndexScreen}
        options={{ title: "Artikel Entnehmen" }}
      />
    </Stack.Navigator>
  );
}
