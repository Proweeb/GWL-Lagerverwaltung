// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import { FlashList } from "@shopify/flash-list";
// import RegalService from "../../../database/datamapper/RegalHelper";
// import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
// import { styles } from "../../../components/styles";
// import { MaterialIcons } from "@expo/vector-icons"; // for icon buttons
// import CustomPopup from "../../../components/utils/Modals/CustomPopUp";
// import ConfirmPopup from "../../../components/utils/Modals/ConfirmPopUp";

// import { useNavigation } from "@react-navigation/native";
// import { heightPercentageToDP } from "react-native-responsive-screen";

// const LagerScreen = () => {
//   const navigation = useNavigation();
//   const [regale, setRegale] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [Action, setAction] = useState(null);
//   const [confirm, setConfirm] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch all regale data
//         const regaleData = await RegalService.getAllRegal();

//         // Fetch and attach the articles to each regal
//         const regaleWithArtikel = await Promise.all(
//           regaleData.map(async (regal) => {
//             // Fetch articles by regalId
//             const artikelList =
//               await ArtikelBesitzerService.getArtikelOwnersByRegalId(
//                 regal.regalId
//               );

//             // For each artikel in the list, fetch detailed artikel data
//             const artikelWithDetails = await Promise.all(
//               artikelList.map(async (artikelOwner) => {
//                 const artikel = await artikelOwner.artikel.fetch(); // Fetch the article details
//                 return {
//                   gwId: artikel.gwId,
//                   name: artikel.beschreibung,
//                   status: artikel.status,
//                   artikelOwnerId: artikelOwner.id, // Include the owner ID
//                   menge: artikelOwner.menge,
//                 };
//               })
//             );

//             return {
//               regalId: regal.regalId,
//               id: regal.id,
//               // artikel: artikelWithDetails, // Attach the detailed artikel list
//               artikelMenge: artikelList.length,
//               artikel: artikelWithDetails,
//             };
//           })
//         );

//         setRegale(regaleWithArtikel); // Set regale with articles
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setTimeout(() => setLoading(false), 1000);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <ActivityIndicator
//         size={"large"}
//         color={styles.lightBlue}
//         style={{ backgroundColor: styles.backgroundColor, flex: 1 }}
//       />
//     );
//   }

//   const RenderArtikel = ({ item, regalId }) => {
//     return (
//       <View style={localStyles.row}>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.name}>{item.name}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.cellText}>{item.gwId}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.cellText}>{item.menge}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text
//             numberOfLines={1}
//             style={[localStyles.cellText, localStyles[item.status]]}
//           >
//             {item.status || "Unbekannt"}
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={localStyles.cell}
//           onPress={() => {
//             setAction(item.gwId);
//           }}
//         >
//           <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const RenderRegal = ({ item }) => {
//     const regalId = item.regalId;
//     console.log(item.artikelMenge);
//     return (
//       <View style={localStyles.regalContainer}>
//         <Text style={localStyles.regalBez}>{regalId}</Text>
//         <View style={localStyles.table}>
//           <View style={[localStyles.row, localStyles.rowBorder]}>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.tableContent}>Produkt Name</Text>
//             </View>

//             <View style={localStyles.cell}>
//               <Text style={localStyles.tableContent}>Produkt ID</Text>
//             </View>

//             <View style={localStyles.cell}>
//               <Text style={localStyles.tableContent}>Menge</Text>
//             </View>

//             <View style={localStyles.cell}>
//               <Text style={localStyles.tableContent}>Status</Text>
//             </View>

//             <View style={localStyles.cell}>
//               <Text style={localStyles.tableContent}>Aktion</Text>
//             </View>
//           </View>
//           <FlashList
//             data={item.artikel}
//             keyExtractor={(artikel) => artikel.artikelOwnerId.toString()}
//             renderItem={({ item }) => (
//               <RenderArtikel item={item} regalId={regalId} />
//             )}
//             estimatedItemSize={50}
//             ListFooterComponent={<View style={{ height: 10 }} />}
//           />
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={localStyles.container}>
//       <FlashList
//         data={regale}
//         keyExtractor={(regal) => regal.id.toString()}
//         renderItem={({ item }) => <RenderRegal item={item} />}
//         estimatedItemSize={100}
//       />
//       <Modal
//         visible={Action ? true : false}
//         transparent={true}
//         statusBarTranslucent={true}
//         onRequestClose={() => {
//           setAction(null);
//           console.log("closed");
//         }}
//       >
//         <CustomPopup
//           cancelButtonText={"Abbrechen"}
//           greenButtonText={"Nachfüllen"}
//           redButtonText={"Löschen"}
//           yellowButtonText={"Bearbeiten"}
//           cancelCallback={() => setAction(null)}
//           greenCallBack={() => {
//             navigation.navigate("Actions", {
//               screen: "ArtikelNachfüllenNavigator",
//               params: { screen: "ArtikelNachfüllen", params: { gwId: Action } },
//             });
//             setAction(null);
//           }}
//           redCallback={async () => {
//             const value = Action;
//             setAction(null);
//             setConfirm(value);
//           }}
//         />
//       </Modal>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         statusBarTranslucent={true}
//         visible={confirm ? true : false}
//         onRequestClose={() => {
//           setAction(null);
//           setConfirm(false);
//           console.log("closed");
//         }}
//       >
//         <ConfirmPopup
//           greenMode={false}
//           greyCallback={() => {
//             const value = confirm;
//             setConfirm(null);
//             setAction(value);
//           }}
//           colorCallback={async () => {
//             await ArtikelBesitzerService.deleteArtikelOwnerByArtikelId(confirm);
//             await LogService.BackupLogByArtikelId(confirm);
//             await ArtikelService.deleteArtikel(confirm);

//             console.log("Artikel deleted " + confirm);

//             Toast.show({
//               type: "success",
//               text1: "Erfolgreich",
//               text2: "Artikel mit der GWID " + confirm + " gelöscht",
//               visibilityTime: 1000,
//             });
//             setConfirm(null);
//           }}
//         />
//       </Modal>
//     </View>
//   );
// };
// const localStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//     backgroundColor: styles.backgroundColor,
//     paddingVertical: 20,
//   },
//   regalContainer: {
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//   },
//   table: {
//     borderRadius: 20,
//     backgroundColor: "#F8F8FF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 4,
//     flex: 1,
//     margin: 20,
//     padding: 5,
//   },
//   regalBez: {
//     color: "#292D32", // Text color
//     fontFamily: "Inter", // Font family
//     fontSize: 18, // Font size in points
//     fontStyle: "normal", // Normal font style
//     fontWeight: "400", // Font weight

//     marginBottom: 10,
//   },
//   tableContent: {
//     color: "#AFAFAF",
//     fontFamily: "Inter",
//     fontSize: 12,
//     fontStyle: "normal",
//     fontWeight: "400",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 10,
//     marginBottom: 5,
//     height: 35,
//   },
//   cellText: {
//     fontSize: 12,
//     color: "#AFAFAF",
//     textAlign: "center",
//   },
//   cell: {
//     fontSize: 12,
//     color: "#AFAFAF",
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//     flex: 1,
//   },
//   rowBorder: {
//     borderBottomWidth: 2,
//     borderBottomColor: "#ffffff",
//   },
//   out: {
//     backgroundColor: "#FFEEEE",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     color: "red",
//     fontSize: 10,
//     textAlign: "center",
//     width: 40,
//   },
//   high: {
//     backgroundColor: "#DFFFD8",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     color: "green",
//     fontSize: 10,
//     textAlign: "center",
//     width: 40,
//   },
//   low: {
//     backgroundColor: "#FFF4D8",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     color: "orange",
//     fontSize: 10,
//     textAlign: "center",
//     width: 40,
//   },
//   name: {
//     fontSize: 12,
//     color: "#333",
//     textAlign: "left",
//   },
// });
// export default LagerScreen;
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import { FlashList } from "@shopify/flash-list";
// import RegalService from "../../../database/datamapper/RegalHelper";
// import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
// import { styles } from "../../../components/styles";
// import { MaterialIcons } from "@expo/vector-icons"; // for icon buttons
// import CustomPopup from "../../../components/utils/Modals/CustomPopUp";
// import ConfirmPopup from "../../../components/utils/Modals/ConfirmPopUp";

// import { useNavigation } from "@react-navigation/native";
// import { heightPercentageToDP } from "react-native-responsive-screen";

// const LagerScreen = () => {
//   const navigation = useNavigation();
//   const [regale, setRegale] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch all regale data
//         const regaleData = await RegalService.getAllRegal();

//         // Fetch and attach the articles to each regal
//         const regaleWithArtikel = await Promise.all(
//           regaleData.map(async (regal) => {
//             // Fetch articles by regalId
//             const artikelList =
//               await ArtikelBesitzerService.getArtikelOwnersByRegalId(
//                 regal.regalId
//               );

//             return {
//               regalId: regal.regalId,
//               id: regal.id,
//               regalName: regal.regalName,
//               fachName: regal.fachName,
//               // artikel: artikelWithDetails, // Attach the detailed artikel list
//               artikelMenge: artikelList.length,
//             };
//           })
//         );

//         setRegale(regaleWithArtikel); // Set regale with articles
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setTimeout(() => setLoading(false), 1000);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <ActivityIndicator
//         size={"large"}
//         color={styles.lightBlue}
//         style={{ backgroundColor: styles.backgroundColor, flex: 1 }}
//       />
//     );
//   }

//   const RenderRegal = ({ item }) => {
//     //  const regalId = item.regalId;
//     useEffect(() => {
//       //console.log(item.artikelMenge);
//     });
//     return (
//       <View style={{ flex: 1, elevation: 5 }}>
//         <TouchableOpacity
//           style={[
//             localStyles.regalContainer,
//             item.artikelMenge < 1
//               ? { backgroundColor: "#FFDADB" }
//               : { backgroundColor: "#C7E5F3" },
//           ]}
//         >
//           <Text style={localStyles.regalBez}>{item.regalId}</Text>
//           <Text style={{ fontWeight: "300" }}> Artikel</Text>
//           <Text style={localStyles.MengeAnzeige}> {item.artikelMenge}</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={localStyles.container}>
//       <FlashList
//         data={regale}
//         keyExtractor={(regal) => regal.id.toString()}
//         renderItem={({ item }) => <RenderRegal item={item} />}
//         estimatedItemSize={100}
//       />
//     </View>
//   );
// };
