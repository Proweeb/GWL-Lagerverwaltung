import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import ArticleTextInput from "../artikelNachfüllen/articleTextInput.js";
import { Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Storagemenu({ formData, setFormData }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "column",
        margin: 10,
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8) }}>Regal Name</Text>
      <TextInputField
        value={formData.regalname}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, regalname: text }))
        }
      />

      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Fach Name
      </Text>
      <TextInputField
        value={formData.fachname}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, fachname: text }))
        }
      />

      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>RegalID</Text>
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
