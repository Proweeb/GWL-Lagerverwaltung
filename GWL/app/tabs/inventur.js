import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import ArtikelService from "../../database/datamapper/ArtikelHelper";
import TextInputField from "../../components/utils/TextInputs/textInputField";
import { styles } from "../../components/styles";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";

const InventoryScreen = () => {
  const navigation = useNavigation();
  const [gwId, setGwId] = useState("");
  const [artikelList, setArtikelList] = useState([]);
  const [changedMenge, setChangedMenge] = useState({}); // Stores temporary values

  useEffect(() => {
    if (gwId === "") {
      handleSearch();
    }
  }, [gwId]); // Runs when `gwId` changes

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const artikelData = await ArtikelService.getAllArtikel();
        setArtikelList(artikelData);
      } catch (error) {
        console.error("Fehler beim Laden der Artikel:", error);
      }
    };

    fetchArtikel();
  }, []);

  const handleExportToExcel = async () => {
    try {
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

      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert("Fehler", "Zugriff wurde verweigert.");
          return;
        }

        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // Write file content
        await FileSystem.writeAsStringAsync(fileUri, excelOutput, {
          encoding: FileSystem.EncodingType.Base64,
        });

        Alert.alert("Erfolg", `Datei gespeichert als: ${fileName}`);
        return;
      }
    } catch (error) {
      console.error("Fehler beim Exportieren:", error);
      Alert.alert("Fehler", "Excel-Datei konnte nicht erstellt werden.");
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
                navigation.navigate("Scan", { onScan: (code) => setGwId(code) })
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
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => {
            handleUpdateMenge();
            handleExportToExcel();
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
          <Text style={{ color: "#30A6DE", fontSize: 20 }}>Fertig</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InventoryItem = ({ item, changedMenge, setChangedMenge }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          backgroundColor: styles.backgroundColor,
          width: "90%",
          borderRadius: 20,
          elevation: 2,
          padding: 20,
          margin: 20,
        }}
      >
        <Text style={styles.subHeader}>{item.beschreibung}</Text>
        <Text style={styles.subHeader}>ID: {item.gwId}</Text>
        <Text style={styles.subHeader}>Soll: {item.menge}</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ width: "20%" }}>
            <Text style={styles.subHeader}>Haben:</Text>
          </View>
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor: styles.white,
              elevation: 2,
              paddingLeft: 5,
              width: "80%",
            }}
          >
            <TextInput
              style={[styles.subHeader, { marginBottom: 0, width: "100%" }]}
              keyboardType="numeric"
              defaultValue={changedMenge[item.gwId] || ""}
              onChangeText={(text) => {
                setChangedMenge((prev) => ({
                  ...prev,
                  [item.gwId]: text,
                }));
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default InventoryScreen;
