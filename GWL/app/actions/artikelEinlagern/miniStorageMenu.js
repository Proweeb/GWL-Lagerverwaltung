import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import TextInputField from "./textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function MiniStorageMenu({ formData, setFormData }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "column",
        margin: 10,
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8) }}>RegalID</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
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
            alignSelf: "flex-end",
            elevation: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 20 }}>[III]</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
