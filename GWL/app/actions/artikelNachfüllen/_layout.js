import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";
import IndexScreen from "./index"; // Import from the same directory

const Stack = createStackNavigator();

export default function ArtikelNachfüllenNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ArtikelNachfüllen"
        options={{
          title: "Artikel nachfüllen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
        component={IndexScreen} // Using the same IndexScreen for all
      />
    </Stack.Navigator>
  );
}
