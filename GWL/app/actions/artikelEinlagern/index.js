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
import { useNavigation } from "@react-navigation/native";
import LogService from "../../../database/datamapper/LogHelper.js";

export default function IndexScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    gwId: "",
    beschreibung: "",
    menge: "",
    ablaufdatum: "",
    mindestmenge: "",
    regalId: "",
  });

  const handleSubmit = async () => {
    const { gwId, beschreibung, menge, ablaufdatum, mindestmenge, regalId } =
      formData;

    if (
      !gwId ||
      !beschreibung ||
      !menge ||
      !ablaufdatum ||
      !mindestmenge ||
      !regalId
    ) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      console.log(formData);
    } else {
      console.log("Alle Felder sind befüllt:", formData);

      try {
        const existingArtikel = await ArtikelService.getArtikelById(gwId);
        const existingRegal = await RegalService.getRegalById(regalId);
        if (existingArtikel) {
          Alert.alert("Fehler", "GWID existiert bereits");
        } else if (!existingRegal) {
          Alert.alert("Fehler", "Regal existiert nicht");
        } else {
          console.log(existingRegal);
          await ArtikelService.createArtikel({
            gwId,
            beschreibung,
            menge: parseInt(menge),
            ablaufdatum,
            mindestMenge: parseInt(mindestmenge),
            regalId,
          });
          Alert.alert("Erfolg", "Artikel erfolgreich gespeichert!");
          await LogService.createLog(
            {
              beschreibung: "Einlagern",
              menge: Number(menge),
              gesamtMenge: Number(menge),
            },
            gwId,
            regalId
          );
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
    >
      <View>
        <Text style={styles.subHeader}>Lagerung</Text>
        <MiniStorageMenu formData={formData} setFormData={setFormData} />
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
