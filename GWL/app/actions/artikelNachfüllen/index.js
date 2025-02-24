import { Text, View, ScrollView } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import ArticleTextInput from "./articleTextInput";
import { Alert } from "react-native";
import OverviewWithQuantity from "./overviewWithQuantity.js";

export default function IndexScreen() {
  const [gwId, setGwId] = useState("");
  const [menge, setMenge] = useState(0);
  const [showMengeOverview, setShowMengeOverview] = useState(false);
  const [foundArticle, setFoundArticle] = useState(null);

  const navigation = useNavigation();

  const handleCancel = () => navigation.navigate("Home");

  const showOverview = () => {
    if (showMengeOverview) {
      return (
        <OverviewWithQuantity
          menge={menge}
          setMenge={setMenge}
          setShowMengeOverview={setShowMengeOverview}
          foundArticle={foundArticle}
        />
      );
    }
    return null;
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
        <ArticleTextInput
          gwId={gwId}
          setGwId={setGwId}
          setShowMengeOverview={setShowMengeOverview}
          setMenge={setMenge}
          setFoundArticle={setFoundArticle}
        />
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
          onPress={handleCancel}
        >
          <Text style={{ color: "#30A6DE", fontSize: 20 }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {showOverview()}
    </View>
  );
}
