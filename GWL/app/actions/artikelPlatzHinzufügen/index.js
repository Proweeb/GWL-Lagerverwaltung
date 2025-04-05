import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu.js";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import RegalService from "../../../database/datamapper/RegalHelper.js";
import { useNavigation } from "@react-navigation/native";
import Storagemenu from "./storageMenu.js";
import Toast from "react-native-toast-message";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import { ErrorMessages, ToastMessages } from "../../../components/enum.js";
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

      // First check if regal exists
      try {
        await RegalService.getRegalById(regalId);
        // If we get here, regal exists
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.REGAL_ALREADY_EXISTS,
          position: "bottom",
        });
        return;
      } catch (error) {
        if (error.message !== ErrorMessages.REGAL_NOT_FOUND) {
          throw error; // Re-throw unexpected errors
        }
        // REGAL_NOT_FOUND is expected, continue with creation
      }

      // Then check if article exists
      try {
        await ArtikelService.getArtikelById(gwId);
        // If we get here, article exists
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.ARTICLE_EXISTS,
          position: "bottom",
        });
        return;
      } catch (error) {
        if (error.message !== ErrorMessages.ARTICLE_NOT_FOUND) {
          throw error; // Re-throw unexpected errors
        }
        // ARTICLE_NOT_FOUND is expected, continue with creation
      }

      // If both checks pass, create regal and article
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
        text1: ToastMessages.ERFOLG,
        text2:
          ToastMessages.ARTICLE_REGAL_GESPEICHERT +
          " " +
          beschreibung +
          ";" +
          regalId,
        position: "bottom",
      });

      navigation.navigate("Home");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.DEFAULT,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: styles.backgroundColor }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 15,
          paddingBottom: 50,
        }}
        keyboardShouldPersistTaps="handled"
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

        <View style={{ marginTop: 50, alignItems: "center", marginBottom: 20 }}>
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
    </KeyboardAvoidingView>
  );
}

export const siteStyles = {
  longLine: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
  },
};
