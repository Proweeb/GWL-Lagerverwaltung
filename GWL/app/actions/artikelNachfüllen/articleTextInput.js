import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

export default function ArticleTextInput({ formData, setFormData }) {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={{ fontSize: RFPercentage(1.8) }}>GWID</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInputField
            value={formData.gwId}
            onChangeText={(text) =>
              setFormData((prevData) => ({ ...prevData, gwId: text }))
            }
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Scan", {
              onScan: (code) => {
                setgwId(code);
              },
            });
          }}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: styles.white,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 20 }}>[III]</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
