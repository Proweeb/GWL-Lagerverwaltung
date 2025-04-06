import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import { styles } from "../../../components/styles.js";
import InventoryItem from "../../../components/oneTimeUse/InventoryItem.js";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import SearchBar from "../../../components/utils/SearchBar.js";
import WeiterButton from "../../../components/oneTimeUse/WeiterButton.js";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper.js";
import LogService from "../../../database/datamapper/LogHelper.js";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { ToastMessages } from "../../../components/enum.js";
import ConfirmPopup from "../../../components/Modals/ConfirmPopUp.js";
import * as Progress from "react-native-progress"; // Add this import

const InventurScreen = ({ setChangedMenge, changedMenge }) => {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState("");
  const [artikelList, setArtikelList] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // New state for search loading

  useFocusEffect(
    React.useCallback(() => {
      fetchArtikel();
    }, [])
  );

  const fetchArtikel = async () => {
    try {
      setLoadingState(true);
      const artikelData = await ArtikelBesitzerService.getAllArtikelOwners();

      setArtikelList(artikelData);
      setLoadingState(false);
    } catch (error) {
      console.error("Fehler beim Laden der Artikel:", error);
      setLoadingState(false);
    }
  };

  useEffect(() => {
    if (gwId === "") {
      handleSearch();
    }
  }, [gwId]);

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleSearch = async () => {
    if (!gwId) {
      try {
        setSearchLoading(true);
        const artikelData = await ArtikelBesitzerService.getAllArtikelOwners();
        setArtikelList(artikelData);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: ToastMessages.ERFOLG,
          text2: ToastMessages.ARTICLE_NOT_FOUND,
          position: "bottom",
        });
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    try {
      setSearchLoading(true);
      const artikel = await ArtikelBesitzerService.getArtikelOwnerByGwId(gwId);
      if (!artikel) {
        Alert.alert("Fehler", "Artikel nicht gefunden.");
      } else {
        setArtikelList(artikel);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: ToastMessages.ERROR,
        text2: ToastMessages.ARTICLE_NOT_FOUND,
        position: "bottom",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetInventory = async () => {
    try {
      setChangedMenge({});
      setResetModalVisible(false);
      navigation.navigate("Tabs", {
        screen: "Inventur",
        params: { screen: "startinventur" },
      });
    } catch (error) {
      console.error("Error resetting inventory:", error);
      Alert.alert(
        "Fehler",
        "Beim Zurücksetzen der Inventur ist ein Fehler aufgetreten."
      );
    }
  };

  if (loadingState) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: styles.backgroundColor,
        }}
      >
        <Progress.Circle
          size={50}
          indeterminate={true}
          color={styles.textColor}
        />
        <Text style={{ marginTop: 10, color: styles.textColor }}>
          Lade Artikel...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "95%",
          borderRadius: 20,
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.subHeader}>GWID</Text>
          <TouchableOpacity onPress={() => setResetModalVisible(true)}>
            <MaterialIcons name="cancel" size={24} color={styles.textColor} />
          </TouchableOpacity>
        </View>
        <SearchBar
          gwId={gwId}
          setGwId={setGwId}
          handleSearch={handleSearch}
          setIsScanning={setIsScanning}
        />
      </View>

      {searchLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Progress.Circle
            size={50}
            indeterminate={true}
            color={styles.textColor}
          />
          <Text style={{ marginTop: 10, color: styles.textColor }}>
            Suche Artikel...
          </Text>
        </View>
      ) : (
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
      )}

      <View style={{ alignItems: "center", marginBottom: 5 }}>
        <WeiterButton
          onPress={() => {
            navigation.navigate("Tabs", {
              screen: "Inventur",
              params: { screen: "preview", changedMenge },
            });
          }}
        />
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <ConfirmPopup
          colorCallback={() => {
            Toast.show({
              type: "success",
              text1: ToastMessages.ERFOLG,
              text2: ToastMessages.INVENTUR_ABGEBROCHEN,
              position: "bottom",
            });
            handleResetInventory();
          }}
          greyCallback={() => {
            Toast.show({
              type: "success",
              text1: ToastMessages.ERFOLG,
              text2: ToastMessages.INVENTUR_NICHT_ABGEBROCHEN,
              position: "bottom",
            });
            setResetModalVisible(false);
          }}
          text={"Wollen Sie wirklich die Inventur beenden?"}
        />
      </Modal>
    </View>
  );
};

export default InventurScreen;
