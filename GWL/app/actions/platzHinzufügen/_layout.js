import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";
import IndexScreen from "./index"; // Import from the same directory

const Stack = createStackNavigator();

export default function PlatzHinzufügenNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlatzHinzufügen"
        options={{
          title: "Lagerplatz hinzufügen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
        }}
        component={IndexScreen} // Using the same IndexScreen for all
      />
    </Stack.Navigator>
  );
}
