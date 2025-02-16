import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function InventurScreen() {
  const [codes, setCodes] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.navigate("Scan", {
      onScan: (code) => {
        setCodes(code);
        console.log(code);
      },
    });
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{codes}</Text>
    </View>
  );
}
