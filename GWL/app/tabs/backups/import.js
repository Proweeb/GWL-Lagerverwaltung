import { Text, View } from "react-native";
import { styles } from "../../../components/styles";

export default function ImportScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.lightLightBlue,
      }}
    >
      <Text>Importieren</Text>
    </View>
  );
}
