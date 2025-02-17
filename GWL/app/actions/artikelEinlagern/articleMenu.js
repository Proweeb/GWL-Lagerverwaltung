import { Text, View } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import TextInputField from "./textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function ArticleMenu() {
  return (
    <View
      style={{
        flexDirection: "column",
        margin: 10,
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8) }}>GWID</Text>
      <TextInputField />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Beschreibung
      </Text>
      <TextInputField />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>Menge</Text>
      <TextInputField />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Ablaufdatum
      </Text>
      <TextInputField />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Mindestmenge
      </Text>
      <TextInputField />
    </View>
  );
}
