import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import ArtikelService from "../../../database/datamapper/ArtikelHelper.js";
import { styles } from "../../../components/styles.js";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import { useFocusEffect } from "@react-navigation/native";
import * as MailComposer from "expo-mail-composer";
import LogService from "../../../database/datamapper/LogHelper.js";
import InventoryItem from "../../../components/oneTimeUse/InventoryItem.js";
import WeiterButton from "../../../components/oneTimeUse/WeiterButton.js";
import FertigButton from "../../../components/utils/FertigButton.js";
import ZurückButton from "../../../components/oneTimeUse/ZurückButton.js";
import ArtikelVorschau from "../../../components/oneTimeUse/ArtikelVorschau.js";
import InventurButton from "../../../components/oneTimeUse/InventurButton.js";
import { TextInput } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import SearchBar from "../../../components/utils/SearchBar.js";
const InventoryScreen = () => {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState("");
  const [inventur, setInventur] = useState("");
  const [artikelList, setArtikelList] = useState([]);
  const [changedMenge, setChangedMenge] = useState({}); // Stores temporary values
  const [showPreview, setShowPreview] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!isScanning) {
        setInventur(false); // Reset when leaving the screen
        setShowPreview(false);
      }
      setIsScanning(false);
    }, [isScanning])
  );

  useEffect(() => {
    if (inventur) {
      fetchArtikel();
    }
  }, [inventur]);

  const fetchArtikel = async () => {
    try {
      const artikelData = await ArtikelService.getAllArtikel();
      setArtikelList(artikelData);
    } catch (error) {
      console.error("Fehler beim Laden der Artikel:", error);
    }
  };

  const startInventur = async () => {
    setInventur(true);
    await LogService.createLog(
      {
        beschreibung: "Inventur gestartet",
      },
      null,
      null
    );
  };

  useEffect(() => {
    if (gwId === "") {
      handleSearch();
    }
  }, [gwId]); // Runs when `gwId` changes

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleExportToEmail = async () => {
    try {
      await LogService.createLog(
        {
          beschreibung: "Inventurliste gesendet",
        },
        null,
        null
      );
      const dataForExcel = artikelList.map((item) => ({
        ID: item.gwId,
        Beschreibung: item.beschreibung,
        Soll: item.menge,
        Haben: changedMenge[item.gwId] || item.menge,
        Datum: new Date().toLocaleString("de-DE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      }));
      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Data");
      const excelOutput = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const formattedDate = new Date().toLocaleString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        minute: "2-digit",
        hour: "2-digit",
      });
      const fileName = `Inventur_${formattedDate}.xlsx`;
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, excelOutput, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Fehler", "E-Mail kann nicht gesendet werden.");
        return;
      }
      await MailComposer.composeAsync({
        subject: "Inventur Export",
        body: "Hier ist die exportierte Inventur-Datei.",
        attachments: [fileUri],
      });
      setInventur(false);
      setShowPreview(false);
    } catch (error) {
      console.error("Fehler beim Exportieren per E-Mail:", error);
      Alert.alert("Fehler", "Excel-Datei konnte nicht gesendet werden.");
    }
  };

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

  const handleUpdateMenge = async () => {
    try {
      const updates = Object.entries(changedMenge).map(
        async ([id, newMenge]) => {
          const artikel = await ArtikelService.getArtikelById(id);
          await ArtikelService.updateArtikel(id, {
            gwId: artikel.gwId,
            firmenId: artikel.firmenId,
            beschreibung: artikel.beschreibung,
            menge: Number(newMenge),
            mindestMenge: artikel.mindestMenge,
            ablaufdatum: artikel.ablaufdatum,
            regalId: artikel.regalId,
          });
        }
      );

      await Promise.all(updates);

      // Refresh the list
      const artikelData = await ArtikelService.getAllArtikel();
      setArtikelList(artikelData);
      setChangedMenge({}); // Clear temporary state
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Mengen:", error);
      Alert.alert("Fehler", "Mengen konnten nicht aktualisiert werden.");
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
      {!inventur ? (
        <InventurButton onPress={startInventur}></InventurButton>
      ) : (
        <>
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
          {!showPreview && (
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
          {showPreview && (
            <View
              style={{
                flex: 1,
                width: "100%",
                paddingHorizontal: 20,
              }}
            >
              <View style={{ flex: 1 }}>
                <ArtikelVorschau
                  artikelList={artikelList}
                  changedMenge={changedMenge}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ZurückButton
                  onPress={() => {
                    setShowPreview(false);
                  }}
                ></ZurückButton>
                <FertigButton
                  onPress={() => {
                    handleUpdateMenge();
                    handleExportToEmail();
                  }}
                ></FertigButton>
              </View>
            </View>
          )}
          {!showPreview && (
            <View style={{ alignItems: "center" }}>
              <WeiterButton
                onPress={() => {
                  setShowPreview(true);
                }}
              ></WeiterButton>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default InventoryScreen;
