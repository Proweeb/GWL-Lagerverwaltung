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
import StorageTextInput from "./storageTextInput";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import RegalService from "../../../database/datamapper/RegalHelper.js";
import { Alert } from "react-native";

export default function IndexScreen() {
  const [formData, setFormData] = useState({
    gwId: "",
    regalId: "",
  });

  const [checkData, setCheckData] = useState({
    gwId: "",
    regalId: "",
  });

  const [showArticleSearch, setShowArticleSearch] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const { gwId, regalId } = formData;

    if (!gwId || !regalId) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      console.log(formData);
    } else {
      console.log("Alle Felder sind befüllt:", formData);

      try {
        const existingArtikel = await ArtikelService.getArtikelById(gwId);
        const existingRegal = await RegalService.getRegalById(regalId);

        setCheckData({
          gwId: existingArtikel,
          regalId: existingRegal,
        });

        setShowArticleSearch(true);

        if (!existingRegal) {
          console.log("Regal existiert nicht");
          //setShowButton(true);
        } else if (!existingArtikel) {
          console.log("Artikel existiert nicht");
          //setShowButton(true);
        } else {
          console.log("Artikel gefunden!");
          // setShowButton(false);
        }
      } catch (error) {
        console.error("Fehler beim Finden:", error);
        Alert.alert("Fehler", "Fehler bei Artikelsuche.");
      }
    }
  };

  const handleArticleSearchResult = () => {
    if (showArticleSearch) {
      if (checkData.gwId != null && checkData.regalId != null) {
        return (
          <View
            style={{ marginTop: 20, padding: 10, backgroundColor: "#90ee90" }}
          >
            <Text style={{ fontSize: 18, color: "black" }}>
              ✅ Artikel gefunden!
            </Text>
          </View>
        );
      } else if (!checkData.gwId || !checkData.regalId) {
        return (
          <View
            style={{ marginTop: 20, padding: 10, backgroundColor: "#ffcccb" }}
          >
            <Text style={{ fontSize: 18, color: "black" }}>
              ❌ Artikel oder Regal nicht gefunden
            </Text>
          </View>
        );
      }
    }
    return null;
  };

  // const handleButtonShowing = () => {
  //   if (showButton) {
  //     return (
  //       <View style={{ marginTop: 50, alignItems: "center" }}>
  //         <TouchableOpacity
  //           style={{
  //             backgroundColor: "#dcebf9",
  //             padding: 10,
  //             borderRadius: 5,
  //             height: 50,
  //             alignItems: "center",
  //             justifyContent: "center",
  //           }}
  //           onPress={handleSubmit}
  //         >
  //           <Text style={{ color: "#30A6DE", fontSize: 20 }}>Artikelsuche</Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        backgroundColor: styles.backgroundColor,
        flexDirection: "column",
      }}
    >
      <View>
        <StorageTextInput formData={formData} setFormData={setFormData} />
      </View>
      <View style={{ marginTop: 8 }}>
        <ArticleTextInput formData={formData} setFormData={setFormData} />
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
          onPress={handleSubmit}
        >
          <Text style={{ color: "#30A6DE", fontSize: 20 }}>Artikelsuche</Text>
        </TouchableOpacity>
      </View>

      {handleArticleSearchResult()}
    </View>
  );
}
