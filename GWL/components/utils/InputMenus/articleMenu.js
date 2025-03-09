import { Text, View, TouchableOpacity } from "react-native";
import { styles } from "../../styles";
import { TextInput } from "react-native-gesture-handler";
import TextInputField from "../TextInputs/textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function ArticleMenu({ formData, setFormData }) {
  const navigation = useNavigation();

  const [ablaufDatum, setAblaufDatum] = useState(new Date());

  const showDatePicker = (currentDate, setDate, isStart) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          let adjustedDate = new Date(selectedDate);

          if (isStart) {
            // Set time to 00:00:00 for start date
            adjustedDate.setHours(0, 0, 0, 0);
          } else {
            // Set time to 23:59:59 for end date
            adjustedDate.setHours(23, 59, 59, 999);
          }

          setDate(adjustedDate);
          setFormData((prevData) => ({
            ...prevData,
            ablaufdatum: adjustedDate.toISOString(), // ISO-Format speichern
          }));
          console.log("Selected Date:", formData.ablaufdatum.toISOString());
        }
      },
      mode: "date",
      display: "calendar",
      backgroundColor: "black",
    });
  };

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
        inputMode={"numeric"}
        value={formData.menge}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, menge: text }))
        }
      />

      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Ablaufdatum
      </Text>

      <TouchableOpacity
        onPress={() => showDatePicker(ablaufDatum, setAblaufDatum, true)}
        style={{ width: "100%" }}
      >
        <View pointerEvents="none">
          <TextInputField
            value={
              formData.ablaufdatum
                ? new Date(formData.ablaufdatum).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "" // Wenn kein Datum gesetzt ist, bleibt es leer
            }
            editable={false}
            // onChangeText={(text) =>
            //   setFormData((prevData) => ({
            //     ...prevData,
            //     ablaufdatum: text.toLocaleDateString, // ISO-Format speichern
            //   }))
            // }
          />
        </View>
      </TouchableOpacity>

      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Mindestmenge
      </Text>
      <TextInputField
        inputMode={"numeric"}
        value={formData.mindestmenge}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, mindestmenge: text }))
        }
      />
    </View>
  );
}
