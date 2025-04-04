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
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import { ErrorMessages } from "../../../components/enum.js";
import * as Progress from "react-native-progress";

export default function IndexScreen() {
  const navigation = useNavigation();
  const [regalIdValid, setRegalIdValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gwId: "",
    beschreibung: "",
    menge: "",
    ablaufdatum: "",
    mindestmenge: "",
    regalname: "",
    fachname: "",
    regalId: "",
    firmen_id: "",
    kunde: "",
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
      firmen_id,
      kunde,
    } = formData;

    try {
      setLoading(true);
      const existingRegal = await RegalService.getRegalById(regalId);
      if (existingRegal) {
        Toast.show({
          type: "error",
          text1: "Regal",
          text2: "Existiert bereits",
          position: "bottom",
        });
        return;
      }
    } catch (error) {
      if (error.message == ErrorMessages.REGAL_NOT_FOUND) {
        console.log("Regal " + regalId + " erstellt");
      } else {
        console.error("Fehler beim RegalSpeichern:", error);
      }
    }

    try {
      const article = await ArtikelService.getArtikelById(gwId);
      if (article) {
        Toast.show({
          type: "error",
          text1: "Artikel",
          text2: "Existiert bereits",
          position: "bottom",
        });
        return;
      }
    } catch (error) {
      if (error.message == ErrorMessages.ARTICLE_NOT_FOUND) {
        await RegalService.createRegal({
          regalId,
          fachName: fachname,
          regalName: regalname,
        });
        await ArtikelService.createArtikel(
          {
            gwId,
            firmenId: firmen_id,
            kunde,
            beschreibung,
            menge: Number(menge),
            ablaufdatum,
            mindestMenge: Number(mindestmenge),
          },
          String(regalId)
        );

        Toast.show({
          type: "success",
          text1: "Artikel: " + beschreibung + " & Regal: " + regalId,
          text2: "Erfolgreich gespeichert",
          position: "top",
        });
        navigation.navigate("Home");
        setLoading(false);
      } else {
        console.error("Fehler beim ArtikelSpeichern:", error);
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
        <Storagemenu
          formData={formData}
          setFormData={setFormData}
          regalIdValid={regalIdValid}
          setRegalIdValid={setRegalIdValid}
        />
      </View>

      <View style={[siteStyles.longLine, { marginVertical: 10 }]}></View>

      <View>
        <Text style={styles.subHeader}>Artikel</Text>
        <ArticleMenu formData={formData} setFormData={setFormData} />
      </View>

      <View style={{ marginTop: 50, alignItems: "center" }}>
        {loading ? (
          <Progress.Circle size={50} indeterminate={true} />
        ) : (
          <ActionButton
            CancelCallBack={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
            FertigCallBack={handleSubmit}
            isDone={
              formData.regalId &&
              formData.menge &&
              formData.gwId &&
              formData.beschreibung &&
              formData.regalname &&
              formData.fachname
            }
          />
        )}
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
