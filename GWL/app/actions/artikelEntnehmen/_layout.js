import { createStackNavigator } from "@react-navigation/stack";
import { styles } from "../../../components/styles";
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
        }}
      />
    </Stack.Navigator>
  );
}
