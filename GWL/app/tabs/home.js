import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { database } from "../../database/database";
import Artikel from "../../database/models/Artikel";
import { Ionicons } from "@expo/vector-icons";
import { withObservables } from "@nozbe/watermelondb/react";
import { createArtikel } from "../../database/DataMapper/HelperArtikel";

// Component to render each Artikel
const ArtikelItem = ({ artikel }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>Beschreibung: {artikel.beschreibung}</Text>
    <Text style={styles.itemText}>Kunde: {artikel.kunde}</Text>
    <Text style={styles.itemText}>GWID: {artikel.artikelGwid}</Text>
    <Text style={styles.itemText}>Firmen-ID: {artikel.artikelFirmenId}</Text>
    <Text style={styles.itemText}>Menge: {artikel.menge}</Text>
    <Text style={styles.itemText}>Mindestmenge: {artikel.mindestmenge}</Text>
    <Text style={styles.itemText}>
      Ablaufdatum: {new Date(artikel.ablaufdatum).toLocaleDateString()}
    </Text>
  </View>
);

// Component with observable database query
const IndexScreen = ({ artikelList, addArtikel, deleteLastArtikel }) => (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={addArtikel}>
        <Ionicons name={"add"} size={32} color={"green"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteLastArtikel}>
        <Ionicons name={"trash"} size={32} color={"red"} />
      </TouchableOpacity>
    </View>

    <FlatList
      data={artikelList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ArtikelItem artikel={item} />}
    />
  </View>
);

// Function to observe Artikel collection in WatermelonDB
const enhance = withObservables([], () => ({
  artikelList: database.get("artikel").query().observe(),
}));

const EnhancedIndexScreen = enhance(IndexScreen);

// Function to add a new Artikel

// Function to delete the last Artikel
const deleteLastArtikel = async () => {
  try {
    await database.write(async () => {
      // Get the last Artikel by sorting based on creation date or any other logic you need
      const lastArtikel = await database.get("artikel").query().fetch();

      if (lastArtikel.length > 0) {
        const lastEntry = lastArtikel[lastArtikel.length - 1];
        await lastEntry.destroyPermanently();
        console.log("✅ Last Artikel deleted!");
      } else {
        console.log("No Artikel to delete!");
      }
    });
  } catch (error) {
    console.error("Error deleting last Artikel: ", error);
  }
};

// Function to add a new Artikel
async function addArtikel() {
  try {
    // Define the artikelData object with test values
    const artikelData = {
      regalId: "123", // Regal ID (foreign key)
      artikelGwid: "gwid123", // Artikel GWID (unique identifier)
      artikelFirmenId: "firmenid123", // Firmen ID (company identifier)
      beschreibung: "Test Artikel Beschreibung", // Artikel description
      kunde: "Kunde Test", // Kunde (customer)
      ablaufdatum: new Date().getTime(), // Ablaufdatum (expiry date as timestamp)
      menge: 10, // Menge (quantity)
      mindestmenge: 5, // Mindestmenge (minimum quantity)
      fach: "yrmom",
    };

    // Call the function to add the Artikel to the database
    await createArtikel(artikelData);
    console.log("✅ Artikel added!");
  } catch (error) {
    console.error("Error adding Artikel: ", error);
  }
}

// Pass `addArtikel` and `deleteLastArtikel` as props
const HomeScreen = () => (
  <EnhancedIndexScreen
    addArtikel={addArtikel}
    deleteLastArtikel={deleteLastArtikel}
  />
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 16,
  },
});
