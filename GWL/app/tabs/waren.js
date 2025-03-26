// import {
//   Button,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
//   Modal,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { styles } from "../../components/styles";
// import { useIsFocused, useNavigation } from "@react-navigation/native";
// import { useState, useEffect } from "react";
// import { StyleSheet } from "react-native";
// import ArtikelService from "../../database/datamapper/ArtikelHelper";
// import RegalService from "../../database/datamapper/RegalHelper";
// import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
// import { FlashList } from "@shopify/flash-list";
// import ArtikelBesitzerService from "../../database/datamapper/ArtikelBesitzerHelper";
// import CustomPopup from "../../components/utils/Modals/CustomPopUp";
// import Toast from "react-native-toast-message";

// const WarenScreen = () => {
//   const navigation = useNavigation();
//   const [jsonData, setJsonData] = useState([]);
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [Action, setAction] = useState(null);
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     LoadArtikel();
//     OrderArtikel();
//   }, []);

//   useEffect(() => {
//     setAction(null);
//   }, [isFocused]);

//   async function OrderArtikel() {
//     try {
//       const regaleundso = await RegalService.getAllRegal();
//       //console.log("Regale:", regaleundso);

//       const orderedData = {}; // This object will store our results

//       for (let i = 0; i < regaleundso.length; i++) {
//         const regalId = regaleundso[i].regalId;
//         //const artikel = await ArtikelService.getArtikelByRegalId(regalId);
//         const artikel = await ArtikelBesitzerService.getArtikelOwnersByRegalId(
//           regalId
//         );

//         console.log("Regal ID:", regalId);
//         if (artikel[0]) {
//           console.log("Artikel:", artikel[0].gwId);
//         } else {
//           console.log("keine Artikel");
//         }

//         // If there are no articles, skip to the next regal
//         if (artikel.length === 0) {
//           continue;
//         }

//         // Save the artikel data into the object with regalId as the key
//         orderedData[regalId] = artikel.map((item) => ({
//           gwId: item.gwId,
//           beschreibung: item.beschreibung,
//           menge: item.menge,
//           mindestmenge: item.mindestmenge,
//           status: item.status,
//         }));

//         // Logging the orderedData object for verification
//         // console.log("Ordered Data:", orderedData);
//       }

//       // Do something with the orderedData, for example, you can save it to a state if you need to display it
//       // setOrderedData(orderedData);
//     } catch (error) {
//       console.error("Fehler beim Abrufen der Artikel:", error);
//     }
//   }

//   async function LoadArtikel() {
//     try {
//       const artikel = await ArtikelService.getAllArtikel();
//       // console.log("Alle Artikel:", artikel);
//       setJsonData(artikel);
//     } catch (error) {
//       console.error("Fehler beim Abrufen der Artikel1:", error);
//     }
//   }

//   const handlePress = () => {
//     console.log("Mehr Optionen");
//   };

//   const renderItem = ({ item }) => {
//     const { menge, mindestmenge, beschreibung, gw_id } = item._raw;
//     //const status = getStatus(menge, mindestmenge);

//     return (
//       <TouchableOpacity
//         style={[localStyles.row, localStyles.rowBorder]}
//         onPress={() => {
//           setAction(gw_id);
//         }}
//       >
//         <View style={localStyles.cell}>
//           <Text numberOfLines={1} style={localStyles.name}>
//             {beschreibung}
//           </Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text numberOfLines={1} style={localStyles.cellText}>
//             {gw_id}
//           </Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text numberOfLines={1} style={localStyles.cellText}>
//             {menge}
//           </Text>
//         </View>
//         <View style={localStyles.cell}>
//           <Text
//             numberOfLines={1}
//             style={[localStyles.cellText, localStyles[item.status]]}
//           >
//             {item.status || "Unbekannt"}
//           </Text>
//         </View>
//         <View style={localStyles.cell}>
//           <View
//           // onPress={() => {
//           //   console.log(gw_id);
//           //   setAction(gw_id);
//           // }}
//           >
//             <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View
//       style={{ flex: 1, padding: 10, backgroundColor: styles.backgroundColor }}
//     >
//       {/* Table */}
//       <View style={localStyles.table}>
//         {/* Table Header */}
//         <View style={[localStyles.row, localStyles.rowBorder]}>
//           <View style={localStyles.cell}>
//             <Text numberOfLines={1} style={localStyles.tableContent}>
//               Produkt Name
//             </Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text numberOfLines={1} style={localStyles.tableContent}>
//               Produkt ID
//             </Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text numberOfLines={1} style={localStyles.tableContent}>
//               Menge
//             </Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text numberOfLines={1} style={localStyles.tableContent}>
//               Status
//             </Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text numberOfLines={1} style={localStyles.tableContent}>
//               Aktion
//             </Text>
//           </View>
//         </View>

//         {/* FlatList */}
//         <FlashList
//           data={jsonData}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={localStyles.listContainer}
//           estimatedItemSize={37}
//         />
//       </View>
//       <Modal
//         visible={Action ? true : false}
//         transparent={true}
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
//               screen: "ArtikelNachfüllenNavigator", // Name of the nested screen inside "Actions"
//               params: { screen: "ArtikelNachfüllen", params: { gwId: Action } },
//             });

//             setAction(null);
//           }}
//           redCallback={async () => {
//             console.log(await ArtikelService.getArtikelById(Action));
//             await ArtikelService.deleteArtikel(Action);
//             console.log("Artikel deleted " + Action);

//             Toast.show({
//               type: "success",
//               text1: "Erfolgreich",
//               text2: "Artikel mit der GWID " + Action + " gelöscht",
//             });
//             setAction(null);
//             console.log(await ArtikelService.getArtikelById(Action));
//           }}
//         />
//       </Modal>
//     </View>
//   );
// };

// export default WarenScreen;

// const localStyles = StyleSheet.create({
//   listContainer: {
//     paddingBottom: 0,
//   },
//   table: {
//     borderRadius: 20,
//     backgroundColor: "#F8F8FF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 4,
//     width: "100%",
//     marginBottom: 20,
//     padding: 5,

//     flex: 1,
//   },
//   tableContent: {
//     color: "#AFAFAF",
//     fontFamily: "Inter",
//     fontSize: 12,
//     fontWeight: "400",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 10,
//     marginBottom: 2,
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
//     width: 60,
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
import { Button, Text, View, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../components/styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import ArtikelService from "../../database/datamapper/ArtikelHelper";
import RegalService from "../../database/datamapper/RegalHelper";
import ArtikelBesitzerService from "../../database/datamapper/ArtikelBesitzerHelper";
import { FlashList } from "@shopify/flash-list";
import CustomPopup from "../../components/utils/Modals/CustomPopUp";
import Toast from "react-native-toast-message";
import { database } from "../../database/database"; // Import your WatermelonDB database instance
import ConfirmPopup from "../../components/utils/Modals/ConfirmPopUp";
import LogService from "../../database/datamapper/LogHelper";

const WarenScreen = () => {
  const navigation = useNavigation();
  const [jsonData, setJsonData] = useState([]);
  const [Action, setAction] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch initial data from the database
        const artikel = await ArtikelService.getAllArtikel();
        setJsonData(artikel);
      } catch (error) {
        console.error("Fehler beim Abrufen der Artikel:", error);
      }
    };

    fetchData();

    // Set up a real-time listener for changes in the `artikel` table
    const subscriber = database.collections
      .get("artikel")
      .query()
      .observe()
      .subscribe((artikelSnapshot) => {
        const artikelData = artikelSnapshot.map((artikel) => ({
          gwId: artikel.gwId,
          beschreibung: artikel.beschreibung,
          menge: artikel.menge,
          status: artikel.status,
        }));

        // Update the state with the new data to trigger re-render
        setJsonData(artikelData);
      });

    // Cleanup subscription on component unmount
    return () => subscriber.unsubscribe();
  }, [isFocused]); // The effect will re-run when the screen gains focus

  const renderItem = ({ item }) => {
    const { menge, beschreibung, gwId } = item;

    return (
      <TouchableOpacity
        style={[localStyles.row, localStyles.rowBorder]}
        onPress={() => {
          setAction(gwId);
        }}
      >
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.name}>
            {beschreibung}
          </Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.cellText}>
            {gwId}
          </Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.cellText}>
            {menge}
          </Text>
        </View>

        <View style={localStyles.cell}>
          <Text
            numberOfLines={1}
            style={[localStyles.cellText, localStyles[item.status]]}
          >
            {item.status || "Unbekannt"}
          </Text>
        </View>
        <View style={localStyles.cell}>
          <View>
            <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{ flex: 1, padding: 10, backgroundColor: styles.backgroundColor }}
    >
      {/* Table */}
      <View style={localStyles.table}>
        {/* Table Header */}
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <View style={localStyles.cell}>
            <Text numberOfLines={1} style={localStyles.tableContent}>
              Name
            </Text>
          </View>
          <View style={localStyles.cell}>
            <Text numberOfLines={1} style={localStyles.tableContent}>
              GWID
            </Text>
          </View>
          <View style={localStyles.cell}>
            <Text numberOfLines={1} style={localStyles.tableContent}>
              Menge
            </Text>
          </View>
          <View style={localStyles.cell}>
            <Text numberOfLines={1} style={localStyles.tableContent}>
              Status
            </Text>
          </View>
          <View style={localStyles.cell}>
            <Text numberOfLines={1} style={localStyles.tableContent}>
              Aktion
            </Text>
          </View>
        </View>

        {/* FlashList */}
        <FlashList
          data={jsonData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={localStyles.listContainer}
          estimatedItemSize={37}
        />
      </View>

      <Modal
        visible={Action ? true : false}
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setAction(null);
          console.log("closed");
        }}
      >
        <CustomPopup
          cancelButtonText={"Abbrechen"}
          greenButtonText={"Nachfüllen"}
          redButtonText={"Löschen"}
          yellowButtonText={"Bearbeiten"}
          cancelCallback={() => setAction(null)}
          greenCallBack={() => {
            navigation.navigate("Actions", {
              screen: "ArtikelNachfüllenNavigator",
              params: { screen: "ArtikelNachfüllen", params: { gwId: Action } },
            });
            setAction(null);
          }}
          redCallback={async () => {
            // console.log(await ArtikelService.getArtikelById(Action));
            // await ArtikelService.deleteArtikel(Action);
            // console.log("Artikel deleted " + Action);
            // Toast.show({
            //   type: "success",
            //   text1: "Erfolgreich",
            //   text2: "Artikel mit der GWID " + Action + " gelöscht",
            // });
            // setAction(null);
            // console.log(await ArtikelService.getArtikelById(Action));
            const value = Action;
            setAction(null);
            setConfirm(value);
          }}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={confirm ? true : false}
        onRequestClose={() => {
          setAction(null);
          setConfirm(false);
          console.log("closed");
        }}
      >
        <ConfirmPopup
          greenMode={false}
          greyCallback={() => {
            const value = confirm;
            setConfirm(null);
            setAction(value);
          }}
          colorCallback={async () => {
            await ArtikelBesitzerService.deleteArtikelOwnerByArtikelId(confirm);
            await LogService.BackupLogByArtikelId(confirm);
            await ArtikelService.deleteArtikel(confirm);

            console.log("Artikel deleted " + confirm);

            Toast.show({
              type: "success",
              text1: "Erfolgreich",
              text2: "Artikel mit der GWID " + confirm + " gelöscht",
              visibilityTime: 1000,
            });
            setConfirm(null);
          }}
        />
      </Modal>
    </View>
  );
};

export default WarenScreen;

const localStyles = StyleSheet.create({
  listContainer: {
    paddingBottom: 0,
  },
  table: {
    borderRadius: 20,
    backgroundColor: "#F8F8FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: "100%",
    marginBottom: 20,
    padding: 5,
    flex: 1,
  },
  tableContent: {
    color: "#AFAFAF",
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 2,
    height: 35,
  },
  cellText: {
    fontSize: 12,
    color: "#AFAFAF",
    textAlign: "center",
  },
  cell: {
    fontSize: 12,
    color: "#AFAFAF",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: 60,
  },
  rowBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff",
  },
  out: {
    backgroundColor: "#FFEEEE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "red",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  high: {
    backgroundColor: "#DFFFD8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "green",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  low: {
    backgroundColor: "#FFF4D8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "orange",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  name: {
    fontSize: 12,
    color: "#333",
    textAlign: "left",
  },
});
