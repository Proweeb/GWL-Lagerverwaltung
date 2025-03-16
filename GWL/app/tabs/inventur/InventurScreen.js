import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import { styles } from "../../../components/styles.js";
import InventoryItem from "../../../components/oneTimeUse/InventoryItem.js";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import SearchBar from "../../../components/utils/SearchBar.js";
import WeiterButton from "../../../components/oneTimeUse/WeiterButton.js";
import ArtikelOwnerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
const InventurScreen = ({ setChangedMenge, changedMenge }) => {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState("");
  const [artikelList, setArtikelList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const fetchArtikel = async () => {
    try {
      const artikelData = await ArtikelOwnerService.getAllArtikelOwners();
      setArtikelList(artikelData);
    } catch (error) {
      console.error("Fehler beim Laden der Artikel:", error);
    }
  };

  useEffect(() => {
    if (gwId === "") {
      handleSearch();
    }
  }, [gwId]); // Runs when `gwId` changes

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleSearch = async () => {
    if (!gwId) {
      try {
        const artikelData = await ArtikelService.getAllArtikel();
        setArtikelList(artikelData);
      } catch (error) {
        console.error("Fehler beim Laden der Artikel:", error);
      }
      return;
    }

    try {
      const artikel = await ArtikelService.getArtikelById(gwId);
      if (!artikel) {
        Alert.alert("Fehler", "Artikel nicht gefunden.");
      } else {
        setArtikelList([artikel]);
      }
    } catch (error) {
      console.error("Fehler beim Finden des Artikels:", error);
      Alert.alert("Fehler", "Fehler bei der Artikelsuche.");
    }
  };

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        flex: 1,
        alignItems: "center",
      }}
    >
      <View style={{ width: "95%", borderRadius: 20 }}>
        <View style={{ paddingLeft: 20 }}>
          <Text style={styles.subHeader}>GWID</Text>
        </View>
        <SearchBar
          gwId={gwId}
          setGwId={setGwId}
          handleSearch={handleSearch}
          setIsScanning={setIsScanning}
        />
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={artikelList}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={30}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <InventoryItem
              item={item}
              changedMenge={changedMenge}
              setChangedMenge={setChangedMenge}
            />
          )}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <WeiterButton
          onPress={() => {
            navigation.navigate("Tabs", {
              screen: "Inventur",
              params: { screen: "preview", changedMenge },
            });
          }}
        ></WeiterButton>
      </View>
    </View>
  );
};
export default InventurScreen;
