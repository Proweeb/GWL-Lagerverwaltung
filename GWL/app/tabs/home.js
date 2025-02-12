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
import { styles } from "../../components/styles";

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

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,

        backgroundColor: styles.backgroundColor,
      }}
    >
      <HomeWidget
        flexValue={0.9}
        containerFlex={0.7}
        title={"Benachrichtungen"}
      />
      <HomeWidget
        flexValue={0.9}
        containerFlex={1}
        title={"Aktionen"}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <View>
            <Ionicons name="alarm" size={70}></Ionicons>
            <Text style={{ textAlign: "center", fontSize: 16 }}>Hi</Text>
          </View>
          <View>
            <Ionicons name="alarm" size={70}></Ionicons>
            <Text style={{ textAlign: "center", fontSize: 16 }}>Hi</Text>
          </View>
          <View>
            <Ionicons name="alarm" size={70}></Ionicons>
            <Text style={{ textAlign: "center", fontSize: 16 }}>Hi</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <View>
            <Ionicons name="alarm" size={70}></Ionicons>
            <Text style={{ textAlign: "center", fontSize: 16 }}>Hi</Text>
          </View>
          <View>
            <Ionicons name="alarm" size={70}></Ionicons>
            <Text style={{ textAlign: "center", fontSize: 16 }}>Hi</Text>
          </View>
          <View>
            <Ionicons name="alarm" size={70}></Ionicons>
            <Text style={{ textAlign: "center", fontSize: 16 }}>Hi</Text>
          </View>
        </View>
      </HomeWidget>
      <HomeWidget flexValue={0.8} containerFlex={1} title={"Lagerbewegungen"} />
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
