import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../components/styles";
import IndexScreen from "./index";
import RegallisteScreen from "./regalliste";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function LagerNavigator() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: styles.backgroundColor,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: styles.textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: ({ canGoBack, onPress }) =>
          navigation.canGoBack() ? (
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={styles.textColor}
              style={{ marginLeft: 10 }}
              onPress={() => navigation.goBack()}
            />
          ) : null,
      }}
    >
      <Stack.Screen
        name="Lager"
        options={{
          title: "Lagerplätze",

          headerShown: true,
          headerStyle: {},
          headerTitleStyle: [styles.header],
        }}
        component={IndexScreen} // Using the same IndexScreen for all
      />
      <Stack.Screen
        name="Regalliste"
        options={{
          title: "Lagerplätze",
          headerShown: false,
          headerStyle: {},
          headerTitleStyle: [styles.header],
        }}
        component={RegallisteScreen} // Using the same IndexScreen for all
      />
    </Stack.Navigator>
  );
}
