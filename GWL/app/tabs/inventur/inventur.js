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
        Datum: new Date().toLocaleDateString(),
      }));
      const ws = XLSX.utils.json_to_sheet(dataForExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventory Data");
      const excelOutput = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const now = new Date();
      const formattedDate = now
        .toISOString()
        .replace(/T/, "_")
        .replace(/:/g, "-")
        .split(".")[0];
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
          <View style={{ width: "95%", borderRadius: 20, padding: 20 }}>
            <Text style={styles.subHeader}>GWID</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <View style={{ flex: 1, height: 40 }}>
                <TextInput
                  value={gwId}
                  onChangeText={setGwId}
                  onSubmitEditing={handleSearch} // Triggers search when Enter/Done is pressed
                  returnKeyType="search" // Sets keyboard button to "Search"
                  style={{
                    padding: 10,
                    fontSize: 16,
                    backgroundColor: styles.white,
                    borderRadius: 10,
                  }}
                />
              </View>

              {gwId !== "" && (
                <TouchableOpacity
                  onPress={() => setGwId("")}
                  style={{
                    marginLeft: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: styles.white,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 3,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"arrow-u-left-bottom"}
                    size={24}
                    color={"black"}
                  />
                </TouchableOpacity>
              )}

              {gwId === "" && (
                <TouchableOpacity
                  onPress={() => {
                    setIsScanning(true);
                    setTimeout(() => {
                      navigation.navigate("Scan", {
                        onScan: (code) => {
                          setGwId(code);
                        },
                      });
                    }, 0);
                  }}
                  style={{
                    marginLeft: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: styles.white,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: "black", fontSize: 20 }}>[III]</Text>
                </TouchableOpacity>
              )}

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
                  elevation: 3,
                }}
              >
                <Feather name="search" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {!showPreview && (
            <FlatList
              style={{ width: "100%" }}
              data={artikelList}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              renderItem={({ item }) => (
                <InventoryItem
                  item={item}
                  changedMenge={changedMenge}
                  setChangedMenge={setChangedMenge}
                />
              )}
            />
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
