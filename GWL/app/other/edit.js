import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { styles } from "../../components/styles";
import { RFPercentage } from "react-native-responsive-fontsize";
import TextInputField from "../../components/utils/TextInputs/textInputField";
import DisabledInputField from "../../components/utils/TextInputs/DisabledInputField";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ArtikelService from "../../database/datamapper/ArtikelHelper";
import ArtikelBesitzerService from "../../database/datamapper/ArtikelBesitzerHelper";
import Toast from "react-native-toast-message";
import * as Progress from 'react-native-progress';
import YellowFertigButton from "../../components/Buttons/YellowFertigButton";

export default function EditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const passedGwId = route.params?.gwId;
  const passedRegalId = route.params?.regalId;
  const [ablaufDatum, setAblaufDatum] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    gwId: "",
    beschreibung: "",
    menge: "0",
    ablaufdatum: null,
    mindestmenge: "",
    firmen_id: "",
    kunde: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (passedGwId) {
        try {
          // First get the Artikel details
          const artikel = await ArtikelService.getArtikelById(passedGwId);
          if (artikel) {
            // Format the date if it exists
            let formattedDate = null;
            if (artikel.ablaufdatum) {
              formattedDate = new Date(artikel.ablaufdatum);
              setAblaufDatum(formattedDate);
            }
            
            // Set all form data from Artikel
            setFormData(prev => ({
              ...prev,
              gwId: passedGwId || "",
              beschreibung: artikel.beschreibung || "",
              ablaufdatum: formattedDate ? formattedDate.toISOString() : null,
              mindestmenge: artikel.mindestMenge?.toString() || "",
              firmen_id: artikel.firmenId || "",
              kunde: artikel.kunde || "",
              menge: artikel.menge?.toString() || "0",
            }));

            // If passedRegalId is present, update the menge from ArtikelBesitzer
            if (passedRegalId) {
              const besitzer = await ArtikelBesitzerService.getArtikelOwnersByGwIdAndRegalId(passedGwId, passedRegalId);
              if (besitzer) {
                setFormData(prev => ({
                  ...prev,
                  menge: besitzer[0]?.menge?.toString() || "0",
                }));
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          Toast.show({
            type: "error",
            text1: "Fehler",
            text2: "Daten konnten nicht geladen werden",
            position: "bottom",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [passedGwId, passedRegalId]);

  const showDatePicker = (currentDate, setDate) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          let adjustedDate = new Date(selectedDate);
          // Set time to 23:59:59 for end date
          adjustedDate.setHours(23, 59, 59, 999);
          setDate(adjustedDate);
          setFormData((prevData) => ({
            ...prevData,
            ablaufdatum: adjustedDate.toISOString(),
          }));
        }
      },
      mode: "date",
      display: "calendar",
      backgroundColor: "black",
    });
  };

  const handleSubmit = async () => {
    try {
      // Update the article
      await ArtikelService.updateArtikel(passedGwId, {
        gwId: formData.gwId,
        beschreibung: formData.beschreibung,
        mindestMenge: Number(formData.mindestmenge),
        firmenId: formData.firmen_id,
        kunde: formData.kunde,
        ablaufdatum: formData.ablaufdatum,
      });

      Toast.show({
        type: "success",
        text1: "Erfolgreich",
        text2: "Artikel wurde aktualisiert",
        position: "bottom",
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error updating article:", error);
      Toast.show({
        type: "error",
        text1: "Fehler",
        text2: "Artikel konnte nicht aktualisiert werden",
        position: "bottom",
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[localStyles.container, localStyles.centerContent]}>
        <Progress.CircleSnail 
          color={styles.primaryColor} 
          size={60}
          thickness={4}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: styles.backgroundColor,
      }}
    >
        
      <View style={{ margin: 10 }}>
      {passedRegalId && (
          <>
            <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
              Regal ID
            </Text>
            <DisabledInputField
              value={passedRegalId}
            />
          </>
        )}
        <Text style={{ fontSize: RFPercentage(1.8) }}>GWID*</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <View style={{ flex: 1 }}>
      
              <DisabledInputField
                value={passedGwId}
              />
             
          </View>
        </View>

        <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
          Beschreibung*
        </Text>
        <TextInputField
          value={formData.beschreibung}
          onChangeText={(text) =>
            setFormData((prevData) => ({ ...prevData, beschreibung: text }))
          }
        />

        <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>Menge*</Text>
        <DisabledInputField
          inputMode={"numeric"}
          value={formData.menge}
        />

        <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
          Ablaufdatum
        </Text>
        <TouchableOpacity
          onPress={() => showDatePicker(ablaufDatum, setAblaufDatum)}
          style={{ width: "100%" }}
          activeOpacity={0.5}
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
                  : ""
              }
              editable={false}
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
            setFormData((prevData) => ({
              ...prevData,
              mindestmenge: text.replace(/[^0-9]/g, ""),
            }))
          }
        />

        <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
          Firmen ID
        </Text>
        <TextInputField
          value={formData.firmen_id}
          onChangeText={(text) =>
            setFormData((prevData) => ({ ...prevData, firmen_id: text }))
          }
        />

        <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>Kunde</Text>
        <TextInputField
          value={formData.kunde}
          onChangeText={(text) =>
            setFormData((prevData) => ({ ...prevData, kunde: text }))
          }
        />

      

        <YellowFertigButton 
          onPress={handleSubmit} 
          disabled={!formData.beschreibung} 
        />
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styles.backgroundColor,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

