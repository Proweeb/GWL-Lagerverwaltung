import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu.js";
import MiniStorageMenu from "../../../components/utils/InputMenus/miniStorageMenu.js";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import RegalService from "../../../database/datamapper/RegalHelper.js";
import LogService from "../../../database/datamapper/LogHelper.js";
import { useNavigation } from "@react-navigation/native";
import Storagemenu from "./storageMenu.js";
import Toast from "react-native-toast-message";

export default function IndexScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    gwId: "",
    beschreibung: "",
    menge: "",
    ablaufdatum: "",
    mindestmenge: "",
    regalname: "",
    fachname: "",
    regalId: "",
  });

  const handleSubmit = async () => {
    const {
      gwId,
      beschreibung,
      menge,
      ablaufdatum,
      mindestmenge,
      regalId,
      regalname,
      fachname,
    } = formData;

    if (
      !gwId ||
      !beschreibung ||
      !menge ||
      !ablaufdatum ||
      !mindestmenge ||
      !regalId ||
      !regalname ||
      !fachname
    ) {
      Toast.show({
        type: "warning",
        text1: "Artikel/Regal",
        text2: "Bitte füllen Sie alle Felder aus",
        position: "bottom",
      });
      console.log(formData);
    } else {
      console.log("Alle Felder sind befüllt:", formData);

      try {
        const existingArtikel = await ArtikelService.getArtikelById(gwId);
        const existingRegal = await RegalService.getRegalById(regalId);
        if (existingArtikel) {
          Toast.show({
            type: "error",
            text1: "Artikel",
            text2: "Existiert bereits",
            position: "bottom",
          });
        } else if (existingRegal) {
          Toast.show({
            type: "error",
            text1: "Regal",
            text2: "Existiert bereits",
            position: "bottom",
          });
        } else {
          //console.log(existingRegal);
          console.log("hier");
          await RegalService.createRegal({
            regalId,
            regalName: regalname,
            fachName: fachname,
          });

          const created = await ArtikelService.createArtikel({
            gwId,
            beschreibung,
            menge: Number(menge),
            ablaufdatum,
            mindestMenge: Number(mindestmenge),
            regalId,
          });

          console.log("Artikel gespeichert, GWID: " + gwId);
          Toast.show({
            type: "success",
            text1:
              "Artikel: " +
              formData.beschreibung +
              "   &   Regal: " +
              formData.regalId,
            text2: "Erfolgreich gespeichert",
            position: "top",
          });
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Fehler beim Speichern:", error);
        Alert.alert("Fehler", "Artikel konnte nicht gespeichert werden.");
      }
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: styles.backgroundColor,
      }}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View>
        <Text style={styles.subHeader}>Lagerung</Text>
        <Storagemenu formData={formData} setFormData={setFormData} />
      </View>

      <View style={[siteStyles.longLine, { marginVertical: 10 }]}></View>

      <View>
        <Text style={styles.subHeader}>Artikel</Text>
        <ArticleMenu formData={formData} setFormData={setFormData} />
      </View>

      <View style={{ marginTop: 50, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#dcebf9",
            padding: 10,
            borderRadius: 5,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: "#30A6DE", fontSize: 20 }}>Fertig</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export const siteStyles = {
  longLine: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
  },
};
