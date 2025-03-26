// const LagerScreen = () => {
//   const navigation = useNavigation();
//   const [regale, setRegale] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [Action, setAction] = useState(null);
//   const [confirm, setConfirm] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const regaleData = await RegalService.getAllRegal();

//         const regaleWithArtikel = await Promise.all(
//           regaleData.map(async (regal) => {
//             const artikelList =
//               await ArtikelBesitzerService.getArtikelOwnersByRegalId(
//                 regal.regalId
//               );
//             return {
//               regalId: regal.regalId,
//               id: regal.id,
//               artikel: artikelList,
//             };
//           })
//         );

//         setRegale(regaleWithArtikel);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
//     );
//   }

//   const RenderArtikel = ({ item, regalId }) => {
//     const [artikel, setArtikel] = useState("");

//     useEffect(() => {
//       const fetchArtikel = async () => {
//         try {
//           const fetchedArtikel = await item.artikel.fetch();
//           //console.log(fetchedArtikel); // Check the response structure
//           const artikel = {
//             gwId: fetchedArtikel.gwId,
//             name: fetchedArtikel.beschreibung,
//             status: fetchedArtikel.status,
//           };

//           setArtikel(artikel); // Update state with the entire object
//         } catch (error) {
//           console.error("Error fetching artikel:", error);
//         }
//       };

//       fetchArtikel();
//     }, [item.artikel]);

//     return (
//       <View style={localStyles.row}>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.name}>{artikel.name}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.cellText}>{artikel.gwId}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.cellText}>{item.menge}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text
//             numberOfLines={1}
//             style={[localStyles.cellText, localStyles[artikel.status]]}
//           >
//             {artikel.status || "Unbekannt"}
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={localStyles.cell}
//           onPress={() => {
//             setAction(artikel.gwId);
//           }}
//         >
//           <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const RenderRegal = ({ item }) => {
//     const regalId = item.regalId;
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
//             keyExtractor={(artikel) => artikel.id.toString()}
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
//             // console.log(await ArtikelService.getArtikelById(Action));
//             // await ArtikelService.deleteArtikel(Action);
//             // console.log("Artikel deleted " + Action);
//             // Toast.show({
//             //   type: "success",
//             //   text1: "Erfolgreich",
//             //   text2: "Artikel mit der GWID " + Action + " gelöscht",
//             // });
//             // setAction(null);
//             // console.log(await ArtikelService.getArtikelById(Action));
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
// import LogService from "../../../database/datamapper/LogHelper";
// import ArtikelService from "../../../database/datamapper/ArtikelHelper";
// import { MaterialIcons } from "@expo/vector-icons";
// import Toast from "react-native-toast-message";
// import CustomPopup from "../../../components/utils/Modals/CustomPopUp";
// import ConfirmPopup from "../../../components/utils/Modals/ConfirmPopUp";
// import { useNavigation } from "@react-navigation/native";
// import { styles } from "../../../components/styles";
// import { database } from "../../../database/database";
// import { Q } from "@nozbe/watermelondb";

// const LagerScreen = () => {
//   const navigation = useNavigation();
//   const [regale, setRegale] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [Action, setAction] = useState(null);
//   const [confirm, setConfirm] = useState(null);

//   useEffect(() => {
//     // Set up a real-time listener for changes in the regale and artikelBesitzer tables
//     const fetchData = async () => {
//       try {
//         const regaleData = await RegalService.getAllRegal();
//         const regaleWithArtikel = await Promise.all(
//           regaleData.map(async (regal) => {
//             const artikelList =
//               await ArtikelBesitzerService.getArtikelOwnersByRegalId(
//                 regal.regalId
//               );
//             return {
//               regalId: regal.regalId,
//               id: regal.id,
//               artikel: artikelList,
//             };
//           })
//         );
//         setRegale(regaleWithArtikel);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Subscribe to regale updates
//     const regaleSubscriber = database.collections
//       .get("regale")
//       .query()
//       .observe()
//       .subscribe((regaleSnapshot) => {
//         const updatedRegale = regaleSnapshot.map((regal) => ({
//           regalId: regal.regalId,
//           id: regal.id,
//         }));
//         setRegale(updatedRegale);
//       });

//     // Cleanup subscriber when the component unmounts
//     return () => regaleSubscriber.unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
//     );
//   }

//   const RenderArtikel = ({ item, regalId }) => {
//     const [artikel, setArtikel] = useState(null);

//     useEffect(() => {
//       const fetchAndSubscribe = async () => {
//         // Fetch the artikel details before setting up the subscription
//         try {
//           const fetchedArtikel = await item.artikel.fetch();
//           const gwId = fetchedArtikel.gwId; // Assuming gw_id is available after fetching

//           // Set initial state from the fetched data

//           // Subscription to the "artikel" table for the fetched "gw_id"
//           const subscriber = database.collections
//             .get("artikel")
//             .query(Q.where("gw_id", gwId))
//             .observe()
//             .subscribe((artikelSnapshot) => {
//               if (artikelSnapshot.length > 0) {
//                 const updatedArtikel = artikelSnapshot[0]; // Assuming gw_id is unique
//                 const updatedData = {
//                   gwId: updatedArtikel.gwId,
//                   name: updatedArtikel.beschreibung,
//                   status: updatedArtikel.status,
//                 };
//                 setArtikel(updatedData); // Update state to trigger re-render
//               } else {
//                 setArtikel(null); // Reset artikel if not found
//               }
//             });

//           // Cleanup the subscription when component unmounts
//           return () => subscriber.unsubscribe();
//         } catch (error) {
//           console.error("Error fetching artikel:", error);
//         }
//       };

//       fetchAndSubscribe();

//       // Empty dependency array, so this only runs on mount and unmount
//     }, [item.artikel]); // Re-run effect whenever item changes

//     // Return the rendering of the article's data
//     if (!artikel) {
//       return null; // Or a loading spinner or placeholder
//     }
//     return (
//       <View style={localStyles.row}>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.name}>{artikel.name}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.cellText}>{artikel.gwId}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text style={localStyles.cellText}>{item.menge}</Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text
//             numberOfLines={1}
//             style={[localStyles.cellText, localStyles[artikel.status]]}
//           >
//             {artikel.status || "Unbekannt"}
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={localStyles.cell}
//           onPress={() => {
//             setAction({ gwId: artikel.gwId, regalId: regalId });
//           }}
//         >
//           <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const RenderRegal = ({ item }) => {
//     const regalId = item.regalId;
//     return (
//       <View style={localStyles.regalContainer}>
//         <Text style={localStyles.regalBez}>{item.regalId}</Text>
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
//             keyExtractor={(artikel) => artikel.id.toString()}
//             renderItem={({ item }) => (
//               <RenderArtikel item={item} regalId={regalId} />
//             )}
//             estimatedItemSize={50}
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
//         estimatedItemSize={20}
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
//             await ArtikelBesitzerService.deleteArtikelOwnerByArtikelIdAndRegalId(
//               confirm.gwId,
//               confirm.regalId
//             );
//             await LogService.BackupLogByArtikelId(confirm.gwId);

//             console.log("Artikel deleted " + confirm.gwId);

//             Toast.show({
//               type: "success",
//               text1: "Erfolgreich",
//               text2: "Artikel mit der GWID " + confirm.gwId + " gelöscht",
//               visibilityTime: 1000,
//             });
//             setConfirm(null);
//           }}
//         />
//       </Modal>
//     </View>
//   );
// };
