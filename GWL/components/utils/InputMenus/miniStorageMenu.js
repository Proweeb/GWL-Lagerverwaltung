import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "../../styles";
import { TextInput } from "react-native-gesture-handler";
import TextInputField from "../TextInputs/textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
            navigation.navigate("Scan\\Barcode", {
              onScan: (code) => {
                setFormData((prevData) => ({ ...prevData, regalId: code }));
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
          <MaterialCommunityIcons
            name={"barcode-scan"}
            size={25}
            color={"black"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
