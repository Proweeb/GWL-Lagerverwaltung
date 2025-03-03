import React, { useState } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useIsFocused } from "@react-navigation/native";
import InventoryScreen from "./inventur";
import InventurButton from "../../../components/oneTimeUse/InventurButton";

const Stack = createStackNavigator();

export default function InventurNavigator() {
  const [inventur, setInventur] = useState(false);
  const isFocused = useIsFocused();

  const startInventur = () => {
    setInventur(true);
  };

  return (
    <View style={{ flex: 1 }}>
      {isFocused && !inventur && <InventurButton onPress={startInventur} />}
      <Stack.Navigator>
        <Stack.Screen name="start" options={{ title: "" }}>
          {(props) => (
            <InventoryScreen
              {...props}
              inventur={inventur}
              setInventur={setInventur}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
}
