import { View, Modal, Keyboard } from "react-native";
import { styles } from "../../../components/styles";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ArticleTextInput from "../artikelNachfüllen/articleTextInput.js";
import RegalTextInput from "../artikelNachfüllen/regalTextInput.js";
import OverviewWithQuantity from "./overviewWithQuantity.js";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import Toast from "react-native-toast-message";
import * as Progress from "react-native-progress";
import { ErrorMessages } from "../../../components/enum.js";

export default function IndexScreen() {
  const [gwId, setGwId] = useState("");
  const [regalIdValid, setRegalIdValid] = useState(false);
  const [regalId, setRegalId] = useState("");
  const [menge, setMenge] = useState(0);
  const [showMengeOverview, setShowMengeOverview] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const passedGwId = route.params?.gwId;
  const passedRegalId = route.params?.regalId;

  useEffect(() => {
    if (passedGwId) {
      setGwId(passedGwId);
    }
    if (passedRegalId) {
      setRegalId(passedRegalId);
      setRegalIdValid(true);
    }
  }, [passedGwId, passedRegalId]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const articleInRegal = await ArtikelBesitzerService.getArtikelOwnersByGwIdAndRegalId(
        gwId,
        regalId
      );

      setMenge(articleInRegal[0].menge);
      setShowMengeOverview(true);
      Keyboard.dismiss();
    } catch (error) {
      if (error.message === ErrorMessages.ARTICLE_NOT_FOUND) {
        Toast.show({
          type: "error",
          text1: "Artikel",
          text2: "Existiert nicht",
          position: "bottom",
        });
      } else if (error.message === ErrorMessages.REGAL_NOT_FOUND) {
        Toast.show({
          type: "error",
          text1: "Regal",
          text2: "Existiert nicht",
          position: "bottom",
        });
      } else if (error.message === ErrorMessages.ARTIKELBESITZER_NOT_FOUND) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Artikel befindet sich nicht im Regal",
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Fehler beim Finden",
          position: "bottom",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: styles.backgroundColor,
        flexDirection: "column",
      }}
    >
      <View style={{ marginTop: 8 }}>
        <RegalTextInput
          regalId={regalId}
          setRegalId={setRegalId}
          setRegalIdValid={setRegalIdValid}
          regalIdValid={regalIdValid}
        />
      </View>

      <View style={{ marginTop: 8 }}>
        <ArticleTextInput gwId={gwId} setGwId={setGwId} />
      </View>

      <View style={{ marginTop: 50, alignItems: "center" }}>
        {loading ? (
          <Progress.Circle size={50} indeterminate={true} />
        ) : (
          <ActionButton
            isDone={gwId.length > 0 && regalIdValid}
            FertigCallBack={handleSearch}
            CancelCallBack={() => {
              navigation.navigate("Home");
            }}
          />
        )}
      </View>

      <Modal
        animationType={"slide"}
        transparent={true}
        visible={showMengeOverview}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setShowMengeOverview(false);
        }}
      >
        <OverviewWithQuantity
          menge={menge}
          setShowMengeOverview={setShowMengeOverview}
          gwId={gwId}
          regalId={regalId}
          setRegalId={setRegalId}
          setGwId={setGwId}
        />
      </Modal>
    </View>
  );
}
