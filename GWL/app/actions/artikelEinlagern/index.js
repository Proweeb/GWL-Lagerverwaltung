import { Text, View } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import ArticleMenu from "./articleMenu.js";
import MiniStorageMenu from "./miniStorageMenu.js";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { Alert } from "react-native";

export default function IndexScreen() {
  const [formData, setFormData] = useState({
    codes: "",
    beschreibung: "",
    menge: "",
    ablaufdatum: "",
    mindestmenge: "",
  });

  const handleSubmit = () => {
    const { codes, beschreibung, menge, ablaufdatum, mindestmenge } = formData;

    if (!codes || !beschreibung || !menge || !ablaufdatum || !mindestmenge) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
    } else {
      console.log("Alle Felder sind befüllt:", formData);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
      }}
    >
      <View>
        <Text style={styles.subHeader}>Lagerung</Text>
        <MiniStorageMenu />
      </View>

      <View style={[siteStyles.longLine, { marginVertical: 10 }]}></View>

      <View>
        <Text style={styles.subHeader}>Artikel</Text>
        <ArticleMenu formData={formData} setFormData={setFormData} />
      </View>

      <View style={{ marginTop: "auto", alignItems: "center" }}>
        <TouchableOpacity
          style={{ backgroundColor: "#dcebf9", padding: 10, borderRadius: 5 }}
          onPress={handleSubmit}
        >
          <Text style={{ color: "#30A6DE", fontSize: 16 }}>Fertig</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const siteStyles = {
  longLine: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
  },
};
