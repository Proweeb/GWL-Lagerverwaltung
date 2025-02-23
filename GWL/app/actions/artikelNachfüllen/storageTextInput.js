import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";

export default function StorageTextInput({ formData, setFormData }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "column",
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8) }}>RegalID</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInputField
            value={formData.regalId}
            onChangeText={(text) =>
              setFormData((prevData) => ({ ...prevData, regalId: text }))
            }
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Scan", {
              onScan: (code) => {
                setFormData((prevData) => ({ ...prevData, regalId: code }));
                //console.log(code);
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
