import React, { useState } from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import InventurStartScreen from "./InventurStartScreen";
import InventurScreen from "./InventurScreen";
import PreviewScreen from "./PreviewScreen";

const Stack = createStackNavigator();

export default function InventurNavigator() {
  const [changedMenge, setChangedMenge] = useState({}); // Define state here

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="startinventur"
      >
        <Stack.Screen name="startinventur" component={InventurStartScreen} />
        <Stack.Screen
          name="inventurscreen"
          children={(props) => (
            <InventurScreen
              {...props}
              changedMenge={changedMenge}
              setChangedMenge={setChangedMenge}
            />
          )}
        />
        <Stack.Screen
          name="preview"
          children={(props) => (
            <PreviewScreen
              {...props}
              changedMenge={changedMenge}
              setChangedMenge={setChangedMenge}
            />
          )}
        />
      </Stack.Navigator>
    </View>
  );
}
