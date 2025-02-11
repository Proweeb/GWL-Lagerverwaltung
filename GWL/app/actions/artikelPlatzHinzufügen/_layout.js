import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";
import IndexScreen from "./index"; // Import from the same directory

const Stack = createStackNavigator();

export default function ArtikelPlatzHinzufügenNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ArtikelPlatzHinzufügen"
        options={{
          title: "Lagerplatz mit Artikel hinzufügen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
        }}
        component={IndexScreen} // Using the same IndexScreen for all
      />
    </Stack.Navigator>
  );
}
