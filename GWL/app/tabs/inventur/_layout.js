import React, { useState } from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useIsFocused } from "@react-navigation/native";
import InventoryScreen from "./inventur";
import InventurButton from "../../../components/oneTimeUse/InventurButton";

const Tab = createMaterialTopTabNavigator();

export default function InventurNavigator() {
  const [inventur, setInventur] = useState(false);
  const isFocused = useIsFocused();

  const startInventur = () => {
    setInventur(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {isFocused && !inventur && <InventurButton onPress={startInventur} />}
      <Tab.Navigator>
        <Tab.Screen name="Inventur" options={{ title: "Importieren" }}>
          {(props) => (
            <InventoryScreen
              {...props}
              inventur={inventur}
              setInventur={setInventur}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
