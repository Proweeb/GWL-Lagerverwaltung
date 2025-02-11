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
        onPress={() => navigation.navigate("Actions")}
        style={{
          padding: 20,
          backgroundColor: styles.white,
          elevation: 7,
          borderRadius: 5,
        }}
      >
        <Text>👤 Go to Scan Navigator</Text>
      </Pressable>
    </View>
  );
}
