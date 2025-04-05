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
import { ErrorMessages, ToastMessages } from "../../../components/enum.js";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
import RegalTextInput from "../artikelNachfüllen/regalTextInput.js";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import * as Progress from "react-native-progress";

export default function NextScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
      const article = await ArtikelService.getArtikelById(gwId);
      if (article) {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.ARTICLE_EXISTS,
          position: "bottom",
        });
        setLoading(false);
      }
    } catch (error) {
      if (error.message == ErrorMessages.ARTICLE_NOT_FOUND) {
        try {
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
            text1: ToastMessages.ERFOLG,
            text2: ToastMessages.ARTICLE_EINGELAGERT,
            position: "bottom",
          });
          setLoading(false);
          navigation.navigate("Home");
        } catch (error) {
          if (error.message == ErrorMessages.REGAL_NOT_FOUND) {
            setLoading(false);
            Toast.show({
              type: "error",
              text1: ToastMessages.ERROR,
              text2: ToastMessages.REGAL_NOT_FOUND,
              position: "bottom",
            });
          }
        }
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
        <View style={{ margin: 10 }}>
          <RegalTextInput
            regalId={regalId}
            setRegalId={setRegalId}
            setRegalIdValid={setRegalIdValid}
            regalIdValid={regalIdValid}
          />
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
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
              regalIdValid &&
              formData.menge &&
              formData.gwId &&
              formData.beschreibung
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
