import { Text, View, ScrollView, Keyboard } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import ArticleMenu from "../../../components/utils/InputMenus/articleMenu";
import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { Alert } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import RegalService from "../../../database/datamapper/RegalHelper.js";

export default function ArticleTextInput({
  gwId,
  setGwId,
  setShowMengeOverview,
  setMenge,
  setFoundArticle,
}) {
  const navigation = useNavigation();
  const [dbArtikel, setDbArtikel] = useState("-1");

  useEffect(() => {
    if (dbArtikel === "-1") {
      return;
    }
    if (!dbArtikel) {
      Alert.alert("Fehler", "Artikel existiert nicht");
      console.log("Artikel existiert nicht");
      setShowMengeOverview(false);
    } else {
      console.log("Artikel gefunden!");
      console.log(dbArtikel);
      setFoundArticle(dbArtikel);
      setMenge(dbArtikel.menge);
      setShowMengeOverview(true);
      Keyboard.dismiss();
      setDbArtikel("-1");
    }
  }, [dbArtikel]);

  const handleSearch = async () => {
    if (!gwId) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      console.log(gwId);
    } else {
      console.log("Alle Felder sind befüllt:", gwId);

      try {
        setDbArtikel(await ArtikelService.getArtikelById(gwId));
      } catch (error) {
        console.error("Fehler beim Finden:", error);
        Alert.alert("Fehler", "Fehler bei Artikelsuche.");
      }
    }
  };

  return (
    <View>
      <Text style={{ fontSize: RFPercentage(1.8) }}>GWID</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInputField value={gwId} onChangeText={(text) => setGwId(text)} />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Scan", {
              onScan: (code) => {
                setGwId(code);
              },
            });
          }}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: styles.white,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Text style={{ color: "black", fontSize: 20 }}>[III]</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSearch}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: styles.white,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
