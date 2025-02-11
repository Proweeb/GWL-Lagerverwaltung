import { Text, View } from "react-native";
import { styles } from "../../components/styles";
import { Link } from "expo-router";

export default function backupScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.backgroundColor,
      }}
    >
      <Link href="/(actions)/artikelplatzHinzufügen">
        <Text>👤 Profile Screen</Text>
      </Link>
    </View>
  );
}
