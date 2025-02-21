import { Text, View } from "react-native";
import { styles } from "../../../components/styles";

export default function ExportScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.lightRed,
      }}
    >
      <Text>Exportieren</Text>
    </View>
  );
}
