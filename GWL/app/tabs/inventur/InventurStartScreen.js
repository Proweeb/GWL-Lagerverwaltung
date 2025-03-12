import { View } from "react-native";
import InventurButton from "../../../components/oneTimeUse/InventurButton";
import { styles } from "../../../components/styles";
import { useNavigation } from "@react-navigation/native";
import LogService from "../../../database/datamapper/LogHelper";

const InventurStartScreen = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        flex: 1,
        alignItems: "center",
      }}
    >
      <InventurButton
        onPress={async () => {
          await LogService.createLog(
            {
              beschreibung: "Inventur gestartet",
            },
            null,
            null
          );
          navigation.navigate("Tabs", {
            screen: "Inventur",
            params: { screen: "inventurscreen" },
          });
        }}
      ></InventurButton>
    </View>
  );
};
export default InventurStartScreen;
