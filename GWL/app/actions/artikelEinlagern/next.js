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
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { ErrorMessages } from "../../../components/enum.js";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
import RegalTextInput from "../artikelNachfüllen/regalTextInput.js";
import ActionButton from "../../../components/Buttons/ActionsButton.js";

export default function NextScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const passedGwId = route.params?.gwId;
  const passedRegalId = route.params?.regalId;
  const passedMenge = route.params?.menge;
  const [regalIdValid, setRegalIdValid] = useState(true);
  const [regalId, setRegalId] = useState("");
  const [formData, setFormData] = useState({
    gwId: "",
    beschreibung: "",
    menge: "",
    ablaufdatum: "",
    mindestmenge: "",
    firmen_id: "",
    kunde: "",
  });

  useEffect(() => {
    setFormData({
      gwId: passedGwId,
      menge: passedMenge,
    });
    setRegalId(passedRegalId);
  }, [passedGwId, passedMenge, passedRegalId]);

  const handleSubmit = async () => {
    const {
      gwId,
      beschreibung,
      menge,
      ablaufdatum,
      mindestmenge,
      firmen_id,
      kunde,
    } = formData;

    try {
      await ArtikelService.getArtikelById(gwId);
    } catch (error) {
      if (error.message == ErrorMessages.ARTICLE_NOT_FOUND) {
        console.log(regalId);
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
          text1: "Artikel: " + formData.beschreibung,
          text2: "Erfolgreich gespeichert",
          position: "top",
        });
        navigation.navigate("Home");
      } else {
        console.error("Fehler beim Speichern:", error);
        Toast.show({
          type: "error",
          text1: "Artikel",
          text2: "Existiert bereits",
          position: "bottom",
        });
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
        <RegalTextInput
          regalId={regalId}
          setRegalId={setRegalId}
          setRegalIdValid={setRegalIdValid}
          regalIdValid={regalIdValid}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.subHeader}>Artikel</Text>
        <ArticleMenu formData={formData} setFormData={setFormData} />
      </View>

      <View style={{ marginTop: 50, alignItems: "center" }}>
        <ActionButton
          CancelCallBack={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          FertigCallBack={handleSubmit}
          isDone={
            regalIdValid &&
            formData.menge &&
            formData.gwId &&
            formData.beschreibung
          }
        />
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
