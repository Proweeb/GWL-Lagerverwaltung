import { Text, View } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import TextInputField from "./textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function StorageMenu() {
  return (
    <View
      style={{
        flexDirection: "column",
        margin: 10,
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8) }}>RegalID</Text>
      <TextInputField />
    </View>
  );
}
