import { Text, View } from "react-native";
import { styles } from "../../../components/styles";
import { TextInput } from "react-native-gesture-handler";
import ArticleMenu from "./articleMenu.js";
import StorageMenu from "./storageMenu.js";

export default function IndexScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 15,
      }}
    >
      <View>
        <Text style={styles.subHeader}>Lagerung</Text>
        <StorageMenu />
      </View>

      <View style={[siteStyles.longLine, { marginVertical: 10 }]}></View>

      <View>
        <Text style={styles.subHeader}>Artikel</Text>
        <ArticleMenu />
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
