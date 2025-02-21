import React, { useEffect } from "react";
import { Easing } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ImportScreen from "./import";
import ExportScreen from "./export";

import TopTabNavigation from "../../../components/utils/TopTabNavigation/TopTabNavigation";

// Create Tab Navigator
const Tab = createMaterialTopTabNavigator();

export default function BackupNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TopTabNavigation {...props} />}
      screenOptions={{
        tabBarPosition: "top",
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          },
        },
      }}
    >
      <Tab.Screen
        name="Import"
        component={ImportScreen}
        options={{ title: "Importieren" }}
      />
      <Tab.Screen
        name="Export"
        component={ExportScreen}
        options={{ title: "Exportieren" }}
      />
    </Tab.Navigator>
  );
}
