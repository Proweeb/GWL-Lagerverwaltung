import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";

import { useState, useEffect } from "react";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import ArticleTextInput from "../artikelNachfüllen/articleTextInput.js";
import RegalTextInput from "../artikelNachfüllen/regalTextInput.js";
import TextInputField from "../../../components/utils/TextInputs/textInputField.js";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function IndexScreen() {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState();
  const [menge, setMenge] = useState();
  const [regalIdValid, setRegalIdValid] = useState(false);
  const [regalId, setRegalId] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [dbArtikel, setDbArtikel] = useState();
  const [dbRegal, setRegal] = useState();

  const checkArticleInRegal = async () => {
    try {
      const besitzer =
        await ArtikelBesitzerService.getArtikelOwnersByGwIdAndRegalId(
          gwId,
          regalId
        );

      if (articleInRegal.length != 0) {
        await ArtikelBesitzerService.createArtikelOwner(
          { menge: menge },
          gwId,
          regalId
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Artikel befindet sich nicht im Regal",
          position: "bottom",
        });
      }
    } catch (error) {
      if (error.message == "Artikel existert nicht") {
        navigation.navigate("Actions", {
          screen: "ArtikelEinlagernNavigator",
          params: { screen: "Next" },
        });
      } else if (error.message == "Regal existert nicht") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Regal existert nicht",
          position: "bottom",
        });
      }
    } finally {
    }
  };

  const handleSubmit = async () => {
    console.log("Alle Felder sind befüllt:", gwId);

    try {
      await checkArticleInRegal();
    } catch (error) {
      console.error("Fehler beim Finden:", error);
      Toast.show({
        type: "error",
        text1: "Artikel",
        text2: "Fehler beim Finden",
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
        <RegalTextInput
          regalId={regalId}
          setRegalId={setRegalId}
          setRegalIdValid={setRegalIdValid}
          regalIdValid={regalIdValid}
        />
      </View>

      <View style={[siteStyles.longLine, { marginVertical: 10 }]}></View>

      <View>
        <Text style={styles.subHeader}>Artikel</Text>
        <ArticleTextInput gwId={gwId} setGwId={setGwId} />
        <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>Menge</Text>
        <TextInputField
          inputMode={"numeric"}
          value={menge}
          onChangeText={(text) => {
            setMenge(text.replace(/[^0-9]/g, ""));
          }}
        />
      </View>

      <View style={{ marginTop: 50, alignItems: "center" }}>
        <ActionButton
          CancelCallBack={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          FertigCallBack={handleSubmit}
          isDone={regalIdValid && menge && gwId}
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
