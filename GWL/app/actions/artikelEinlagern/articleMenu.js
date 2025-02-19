import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import TextInputField from "./textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function ArticleMenu({ formData, setFormData }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        margin: 10,
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8) }}>GWID</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
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
                setFormData((prevData) => ({ ...prevData, gwId: code }));
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
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Beschreibung
      </Text>
      <TextInputField
        value={formData.beschreibung}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, beschreibung: text }))
        }
      />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>Menge</Text>
      <TextInputField
        value={formData.menge}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, menge: text }))
        }
      />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Ablaufdatum
      </Text>
      <TextInputField
        value={formData.ablaufdatum}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, ablaufdatum: text }))
        }
      />
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Mindestmenge
      </Text>
      <TextInputField
        value={formData.mindestmenge}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, mindestmenge: text }))
        }
      />
    </View>
  );
}
