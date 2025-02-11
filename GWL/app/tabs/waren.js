import { Text, View } from "react-native";
import { styles } from "../../components/styles";

export default function WarenScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.backgroundColor,
      }}
    >
      <Text>👤 Profile Screen</Text>
    </View>
  );
}
