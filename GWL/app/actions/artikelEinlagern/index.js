import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";
import { ErrorMessages } from "../../../components/enum.js";
import { useState, useEffect } from "react";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import ArticleTextInput from "../artikelNachfüllen/articleTextInput.js";
import RegalTextInput from "../artikelNachfüllen/regalTextInput.js";
import TextInputField from "../../../components/utils/TextInputs/textInputField.js";
import { RFPercentage } from "react-native-responsive-fontsize";
import * as Progress from "react-native-progress";
import { ToastMessages } from "../../../components/enum.js";

export default function IndexScreen() {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState();
  const [menge, setMenge] = useState();
  const [regalIdValid, setRegalIdValid] = useState(false);
  const [regalId, setRegalId] = useState("");
  const [loading, setLoading] = useState(false);

  const checkArticleInRegal = async () => {
    try {
      setLoading(true);
      console.log(gwId, regalId);
      const besitzer =
        await ArtikelBesitzerService.getArtikelOwnersByGwIdAndRegalId(
          gwId,
          regalId
        );

      if (besitzer.length == 0) {
      } else {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.ARTICLE_IN_REGAL,
          position: "bottom",
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error.message == ErrorMessages.ARTICLE_NOT_FOUND) {
        setLoading(false);
        navigation.navigate("Actions", {
          screen: "ArtikelEinlagernNavigator",
          params: {
            screen: "Next",
            params: { regalId: regalId, gwId: gwId, menge: Number(menge) },
          },
        });
      } else if (error.message == ErrorMessages.REGAL_NOT_FOUND) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: ToastMessages.ERROR,
          text2: ToastMessages.REGAL_NOT_FOUND,
          position: "bottom",
        });
      } else if (error.message == ErrorMessages.ARTIKELBESITZER_NOT_FOUND) {
        console.log(menge);
        await ArtikelBesitzerService.createArtikelOwner(
          { menge: Number(menge) },
          gwId,
          regalId
        );
        Toast.show({
          type: "success",
          text1: ToastMessages.ERFOLG,
          text2: ToastMessages.ARTICLE_EINGELAGERT + " " + gwId,
          position: "bottom",
        });
        setLoading(false);
        navigation.goBack();
      }
    } finally {
    }
  };

  const handleSubmit = async () => {
    try {
      await checkArticleInRegal();
    } catch (error) {
      console.error("Fehler beim Finden:", error);
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.ARTICLE_NOT_FOUND,
        position: "bottom",
      });
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
        <View style={{ margin: 10 }}>
          <RegalTextInput
            regalId={regalId}
            setRegalId={setRegalId}
            setRegalIdValid={setRegalIdValid}
            regalIdValid={regalIdValid}
          />
        </View>
      </View>

      <View style={[siteStyles.longLine, { marginVertical: 10 }]}></View>

      <View>
        <Text style={styles.subHeader}>Artikel</Text>
        <View style={{ margin: 10 }}>
          <ArticleTextInput gwId={gwId} setGwId={setGwId} />
          <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
            Menge*
          </Text>
          <TextInputField
            inputMode={"numeric"}
            value={menge}
            onChangeText={(text) => {
              setMenge(text.replace(/[^0-9]/g, ""));
            }}
          />
        </View>
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
            isDone={regalIdValid && menge && gwId}
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
