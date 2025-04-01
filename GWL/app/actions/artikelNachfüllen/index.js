import { Text, View, ScrollView, Modal } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import ArticleTextInput from "./articleTextInput";
import { Alert } from "react-native";
import OverviewWithQuantity from "./overviewWithQuantity.js";
import ActionButton from "../../../components/Buttons/ActionsButton.js";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import { Keyboard } from "react-native";
import RegalTextInput from "./regalTextInput.js";
import RegalService from "../../../database/datamapper/RegalHelper.js";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import Toast from "react-native-toast-message";

export default function IndexScreen() {
  const [gwId, setGwId] = useState("");
  const [regalIdValid, setRegalIdValid] = useState(false);
  const [regalId, setRegalId] = useState("");
  const [menge, setMenge] = useState(0);
  const [showMengeOverview, setShowMengeOverview] = useState(false);
  const [foundArticle, setFoundArticle] = useState(null);
  const [foundRegal, setFoundRegal] = useState(null);
  const [dbArtikel, setDbArtikel] = useState("-1");
  const [dbRegal, setDbRegal] = useState("-1");

  useEffect(() => {
    if (dbArtikel === "-1") {
      return;
    }
    if (!dbArtikel) {
      Toast.show({
        type: "error",
        text1: "Artikel",
        text2: "Existiert nicht",
        position: "bottom",
      });
      console.log("Artikel existiert nicht");
      setShowMengeOverview(false);
    } else {
      console.log("Artikel gefunden!");
      //qconsole.log(dbArtikel);
      setFoundArticle(dbArtikel);
      if (dbRegal && dbArtikel) {
        checkArticleInRegal();
      }
      Keyboard.dismiss();
      setDbArtikel("-1");
    }
  }, [dbArtikel]);

  useEffect(() => {
    if (dbRegal === "-1") {
      return;
    }
    if (!dbRegal) {
      Toast.show({
        type: "error",
        text1: "Regal",
        text2: "Existiert nicht",
        position: "bottom",
      });
      console.log("Regal existiert nicht");
      setShowMengeOverview(false);
    } else {
      console.log("Regal gefunden!");
      //qconsole.log(dbArtikel);
      setFoundRegal(dbRegal);
      if (dbRegal && dbArtikel) {
        checkArticleInRegal();
      }
      Keyboard.dismiss();
      setDbRegal("-1");
    }
  }, [dbRegal]);

  const checkArticleInRegal = async () => {
    articleInRegal =
      await ArtikelBesitzerService.getArtikelOwnersByGwIdAndRegalId(
        gwId,
        regalId
      );

    if (articleInRegal.length != 0) {
      setMenge(articleInRegal[0].menge);
      setShowMengeOverview(true);
    } else {
      Toast.show({
        type: "error",
        text1: "Artikel im Regal",
        text2: "Existiert nicht",
        position: "bottom",
      });
    }
  };

  const handleSearch = async () => {
    console.log("Alle Felder sind befüllt:", gwId);

    try {
      setDbArtikel(await ArtikelService.getArtikelById(gwId));
      setDbRegal(await RegalService.getRegalById(regalId));
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

  const navigation = useNavigation();
  const route = useRoute();
  const passedGwId = route.params?.gwId;
  const passedRegalId = route.params?.regalId;
  const handleCancel = () => navigation.navigate("Tabs");
  useEffect(() => {
    if (passedGwId) {
      setGwId(passedGwId);
    }
  });
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
        <ActionButton
          isDone={gwId.length > 0 && regalIdValid}
          FertigCallBack={handleSearch}
          CancelCallBack={() => {
            navigation.navigate("Home");
          }}
        />
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
          setMenge={setMenge}
          setShowMengeOverview={setShowMengeOverview}
          foundArticle={foundArticle}
          foundRegal={foundRegal}
        />
      </Modal>
    </View>
  );
}
