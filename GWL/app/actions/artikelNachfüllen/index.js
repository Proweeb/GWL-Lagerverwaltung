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

export default function IndexScreen() {
  const [gwId, setGwId] = useState("");
  const [menge, setMenge] = useState(0);
  const [showMengeOverview, setShowMengeOverview] = useState(false);
  const [foundArticle, setFoundArticle] = useState(null);

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
        <ArticleTextInput
          gwId={gwId}
          setGwId={setGwId}
          setShowMengeOverview={setShowMengeOverview}
          setMenge={setMenge}
          setFoundArticle={setFoundArticle}
        />
      </View>

      <View style={{ marginTop: 50, alignItems: "center" }}>
        <ActionButton
          isDone={true}
          FertigCallBack={() => {
            console.log("Fertig");
          }}
          CancelCallBack={() => {
            console.log("Cancel");
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
        />
      </Modal>
    </View>
  );
}
