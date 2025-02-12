import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";
import IndexScreen from "./index"; // Import from the same directory
import TestScreen from "./test";
const Stack = createStackNavigator();

export default function ArtikelPlatzHinzufügenNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        statusBarBackgroundColor: styles.backgroundColor,
        statusBarStyle: "dark",
      }}
    >
      <Stack.Screen
        name="ArtikelPlatzHinzufügen"
        options={{
          title: "Lagerplatz mit Artikel hinzufügen",
        }}
        component={IndexScreen} // Using the same IndexScreen for all
      />
      <Stack.Screen
        name="Test"
        options={{
          title: "Lagerplatz mit Artikel hinzufügen",
        }}
        component={TestScreen} // Using the same IndexScreen for all
      />
    </Stack.Navigator>
  );
}
