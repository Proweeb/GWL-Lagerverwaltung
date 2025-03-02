import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import ArtikelService from "../../database/datamapper/ArtikelHelper";
import TextInputField from "../../components/utils/TextInputs/textInputField";
import { styles } from "../../components/styles";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import { useFocusEffect } from "@react-navigation/native";
import * as MailComposer from "expo-mail-composer";
import LogService from "../../database/datamapper/LogHelper";
import InventoryItem from "../../components/oneTimeUse/InventoryItem";
import { ScrollView } from "react-native-gesture-handler";

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState("");
  const [inventur, setInventur] = useState("");
  const [artikelList, setArtikelList] = useState([]);
  const [changedMenge, setChangedMenge] = useState({}); // Stores temporary values
  const [showPreview, setShowPreview] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setInventur(false); // Reset when leaving the screen
      setShowPreview(false);
    }, [])
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
        <TouchableOpacity
          onPress={startInventur}
          style={{
            backgroundColor: "#30A6DE",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            top: "45%",
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Inventur starten</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={{ width: "95%", borderRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: RFPercentage(1.8) }}>GWID</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <View style={{ flex: 1 }}>
                <TextInputField value={gwId} onChangeText={setGwId} />
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
                  onPress={() =>
                    navigation.navigate("Scan", {
                      onScan: (code) => setGwId(code),
                    })
                  }
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Artikel Vorschau
              </Text>
              <FlatList
                data={artikelList}
                keyExtractor={(item) => item.gwId.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      justifyContent: "space-between",
                      paddingVertical: 5,
                      backgroundColor: styles.backgroundColor,
                      width: "90%",
                      borderRadius: 20,
                      elevation: 2,
                      padding: 20,
                      margin: 5,
                      alignSelf: "center",
                    }}
                  >
                    <Text style={styles.subHeader}>
                      Beschreibung: {item.beschreibung}
                    </Text>
                    <Text style={styles.subHeader}>ID: {item.gwId}</Text>
                    <Text style={styles.subHeader}>Menge: {item.menge}</Text>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowPreview(false);
                  }}
                  style={{
                    backgroundColor: "#ff4d4d",
                    padding: 10,
                    borderRadius: 5,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 10,
                    width: "auto",
                  }}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Zurück</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleUpdateMenge();
                    handleExportToEmail();
                  }}
                  style={{
                    backgroundColor: "#00cc00",
                    padding: 10,
                    borderRadius: 5,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "auto",
                    margin: 10,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Fertig</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {!showPreview && (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  handleUpdateMenge();
                  setShowPreview(true);
                }}
                style={{
                  backgroundColor: "#dcebf9",
                  padding: 10,
                  borderRadius: 5,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  width: "auto",
                }}
              >
                <Text style={{ color: "#30A6DE", fontSize: 20 }}>Weiter</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default InventoryScreen;
