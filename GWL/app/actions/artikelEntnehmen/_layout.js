import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";

import IndexScreen from "./index";
const Stack = createStackNavigator();

export default function ArtikelEntnehmenNavigator() {
  return (
    <Stack.Navigator>
      {/* Tab Navigator */}
      <Stack.Screen
        name="index"
        options={{
          title: "Artikel Entnehmen",
          headerShown: true,
          statusBarBackgroundColor: styles.backgroundColor,
          statusBarStyle: "dark",
          headerTitleStyle: styles.header,
        }}
        component={IndexScreen}
      />
    </Stack.Navigator>
  );
}
