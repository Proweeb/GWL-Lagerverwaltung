import { Pressable, Text, View } from "react-native";
import { styles } from "../../components/styles";
import { useNavigation } from "@react-navigation/native";

export default function BackupScreen() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.backgroundColor,
      }}
    >
      <Pressable
        onPress={() =>
          navigation.navigate("Actions", {
            screen: "ArtikelPlatzHinzufügenNavigator",
            params: { screen: "Test" },
          })
        }
        style={{
          padding: 20,
          backgroundColor: styles.yellow,
          elevation: 7,
          borderRadius: 5,
        }}
      >
        <Text>👤 Go to Test in ArtikelPlatzHinzufügen</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          navigation.navigate("Actions", {
            screen: "LagerNavigator",
          })
        }
        style={{
          padding: 20,
          backgroundColor: styles.yellow,
          elevation: 7,
          borderRadius: 5,
        }}
      >
        <Text>👤 Go to</Text>
      </Pressable>
    </View>
  );
}
