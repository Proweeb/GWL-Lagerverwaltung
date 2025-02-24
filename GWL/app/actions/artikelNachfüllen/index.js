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
import StorageTextInput from "../../../Old_Code/Arun/storageTextInput.js";
import { Alert } from "react-native";

export default function IndexScreen() {
  const [gwId, setGwId] = useState("");

  const [existingArticle, setExistingArticle] = useState(false);

  const navigation = useNavigation();

  const handleCancel = () => navigation.navigate("Home");

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
          setExistingArticle={setExistingArticle}
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

      {}
    </View>
  );
}
