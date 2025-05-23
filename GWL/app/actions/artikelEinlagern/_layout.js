import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";
import IndexScreen from "./index"; // Import from the same directory
import NextScreen from "./next";

const Stack = createStackNavigator();

export default function ArtikelEinlagernNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ArtikelEinlagern"
        options={{
          title: "Artikel einlagern",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
        component={IndexScreen} // Using the same IndexScreen for all
      />
      <Stack.Screen
        name="Next"
        options={{
          title: "Artikel einlagern",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
        component={NextScreen} // Using the same IndexScreen for all
      />
    </Stack.Navigator>
  );
}
