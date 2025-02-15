import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { database } from "../../database/database";
import Artikel from "../../database/models/Artikel";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { withObservables } from "@nozbe/watermelondb/react";
import { createArtikel } from "../../database/datamapper/ArtikelHelper";
import { styles } from "../../components/styles";

import { RFPercentage } from "react-native-responsive-fontsize";

// // Component to render each Artikel
// const ArtikelItem = ({ artikel }) => (
//   <View style={styles.item}>
//     <Text style={styles.itemText}>Beschreibung: {artikel.beschreibung}</Text>
//     <Text style={styles.itemText}>Kunde: {artikel.kunde}</Text>
//     <Text style={styles.itemText}>GWID: {artikel.artikelGwid}</Text>
//     <Text style={styles.itemText}>Firmen-ID: {artikel.artikelFirmenId}</Text>
//     <Text style={styles.itemText}>Menge: {artikel.menge}</Text>
//     <Text style={styles.itemText}>Mindestmenge: {artikel.mindestmenge}</Text>
//     <Text style={styles.itemText}>
//       Ablaufdatum: {new Date(artikel.ablaufdatum).toLocaleDateString()}
//     </Text>
//   </View>
// );

// // Component with observable database query
// const IndexScreen = ({ artikelList, addArtikel, deleteLastArtikel }) => (
//   <View style={styles.container}>
//     <View style={styles.buttonContainer}>
//       <TouchableOpacity onPress={addArtikel}>
//         <Ionicons name={"add"} size={32} color={"green"} />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={deleteLastArtikel}>
//         <Ionicons name={"trash"} size={32} color={"red"} />
//       </TouchableOpacity>
//     </View>

//     <FlatList
//       data={artikelList}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => <ArtikelItem artikel={item} />}
//     />
//   </View>
// );

// // Function to observe Artikel collection in WatermelonDB
// const enhance = withObservables([], () => ({
//   artikelList: database.get("artikel").query().observe(),
// }));

// const EnhancedIndexScreen = enhance(IndexScreen);

// // Function to add a new Artikel

// // Function to delete the last Artikel
// const deleteLastArtikel = async () => {
//   try {
//     await database.write(async () => {
//       // Get the last Artikel by sorting based on creation date or any other logic you need
//       const lastArtikel = await database.get("artikel").query().fetch();

//       if (lastArtikel.length > 0) {
//         const lastEntry = lastArtikel[lastArtikel.length - 1];
//         await lastEntry.destroyPermanently();
//         console.log("✅ Last Artikel deleted!");
//       } else {
//         console.log("No Artikel to delete!");
//       }
//     });
//   } catch (error) {
//     console.error("Error deleting last Artikel: ", error);
//   }
// };

// // Function to add a new Artikel
// async function addArtikel() {
//   try {
//     // Define the artikelData object with test values
//     const artikelData = {
//       regalId: "123", // Regal ID (foreign key)
//       artikelGwid: "gwid123", // Artikel GWID (unique identifier)
//       artikelFirmenId: "firmenid123", // Firmen ID (company identifier)
//       beschreibung: "Test Artikel Beschreibung", // Artikel description
//       kunde: "Kunde Test", // Kunde (customer)
//       ablaufdatum: new Date().getTime(), // Ablaufdatum (expiry date as timestamp)
//       menge: 10, // Menge (quantity)
//       mindestmenge: 5, // Mindestmenge (minimum quantity)
//       fach: "yrmom",
//     };

//     // Call the function to add the Artikel to the database
//     await createArtikel(artikelData);
//     console.log("✅ Artikel added!");
//   } catch (error) {
//     console.error("Error adding Artikel: ", error);
//   }
// }

// // Pass `addArtikel` and `deleteLastArtikel` as props
// const HomeScreen = () => (
//   <EnhancedIndexScreen
//     addArtikel={addArtikel}
//     deleteLastArtikel={deleteLastArtikel}
//   />
// );
import ActionGrid from "../../components/utils/ActionGrid";
import InventoryWidget from "../../components/utils/InventoryWidget";

const actions = [
  [
    {
      screen: "ArtikelNachfüllenNavigator",
      iconName: "cart-heart", // Represents adding/refilling items
      iconType: "MaterialCommunityIcons",
      label: "Art.-Nachfüllen ",
      route: "ArtikelNachfüllenNavigator",
    },
    {
      screen: "PlatzHinzufügenNavigator",
      iconName: "package-variant-closed", // Represents adding a storage location
      iconType: "MaterialCommunityIcons",
      label: "LP-Hinzufügen",
      route: "PlatzHinzufügenNavigator",
    },

    {
      screen: "ArtikelEinlagernNavigator",
      iconName: "cart-plus", // Represents storing an item
      iconType: "MaterialCommunityIcons",
      label: "Art.-Einlagern",
      route: "ArtikelEinlagernNavigator",
    },
  ],
  [
    {
      screen: "LagerNavigator",
      iconName: "warehouse", // Represents a warehouse
      iconType: "MaterialCommunityIcons",
      label: "Lager-Verwalten",
      route: "LagerNavigator",
    },
    {
      screen: "ArtikelPlatzHinzufügenNavigator",
      iconName: "package-variant", // Represents assigning an item to a place
      iconType: "MaterialCommunityIcons",
      label: "Art. & LP-Ergänzen",
      route: "ArtikelPlatzHinzufügenNavigator",
    },
    {
      screen: "ArtikelEntnehmenNavigator",
      iconName: "cart-minus", // Represents taking an item out
      iconType: "MaterialCommunityIcons",
      label: "Art.-Entnehmen",
      route: "ArtikelEntnehmenNavigator",
    },
  ],
];

function HomeScreen() {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: 20,

          backgroundColor: styles.backgroundColor,
        },
        Dimensions.get("screen").width > 599 && {
          paddingHorizontal: 100,
        },
      ]}
    >
      <HomeWidget
        flexValue={0.9}
        containerFlex={0.7}
        title={"Benachrichtungen"}
      />
      <HomeWidget
        flexValue={0.95}
        containerFlex={1}
        title={"Aktionen"}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActionGrid actions={actions} />
      </HomeWidget>
      <HomeWidget
        flexValue={0.8}
        containerFlex={1}
        title={"Lagerbewegungen"}
        containerStyle={{
          paddingHorizontal: Dimensions.get("window").width > 599 ? 50 : 20,
        }}
      >
        <InventoryWidget></InventoryWidget>
      </HomeWidget>
    </View>
  );
}

const HomeWidget = ({
  title,
  flexValue,
  containerFlex,
  children,
  containerStyle,
}) => {
  return (
    <View
      style={{
        flex: containerFlex,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={[
          styles.subHeader,
          { alignSelf: "flex-start", paddingVertical: 10 },
        ]}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: styles.white,
          width: "100%",
          flex: flexValue,
          borderRadius: 20,
          elevation: 8,
        }}
      >
        <View style={[{ padding: 20 }, containerStyle]}>{children}</View>
      </View>
    </View>
  );
};

export default HomeScreen;
