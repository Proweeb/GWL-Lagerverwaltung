import { Button, Text, View } from "react-native";
import { styles } from "../../components/styles";
import { useNavigation } from "@react-navigation/native";

export default function WarenScreen() {
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
      
      <Button 
        title="Waren" 
      />
    </View>
  );
}
