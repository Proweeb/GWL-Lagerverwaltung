// import {
//   Text,
//   View,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { styles } from "../../../components/styles";
// import { MaterialIcons } from "@expo/vector-icons";

// export default function IndexScreen() {

//   const data = [
//     { name: "Baby Oil", id: "#3451F", menge: "x3", status: "out" },
//     { name: "Kiwi", id: "#6341E", menge: "x265", status: "high" },
//     { name: "Keyboard", id: "#8253A", menge: "x60", status: "low" },
//     { name: "Mouse", id: "#5434R", menge: "x1", status: "out" },
//     { name: "Cup", id: "#1244T", menge: "x4", status: "out" },
//   ];

//   async function OrderArtikel() {
//     try {
//       const regaleundso = await RegalService.getAllRegal();
//       console.log("Regale:", regaleundso);

//       const orderedData = {}; // This object will store our results

//       for (let i = 0; i < regaleundso.length; i++) {
//         const regalId = regaleundso[i].regalId;
//         const artikel = await ArtikelService.getArtikelByRegalId(regalId);

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
//         }));

//         // Logging the orderedData object for verification
//         console.log("Ordered Data:", orderedData);
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
//       console.log("Alle Artikel:", artikel);
//       setJsonData(artikel);
//     } catch (error) {
//       console.error("Fehler beim Abrufen der Artikel1:", error);
//     }
//   }

//   const handlePress = () => {
//     console.log("Action was pressed!");
//   };

//   return (
//     <ScrollView contentContainerStyle={localStyles.scrollContainer}>
//       <Text style={localStyles.regalBez}>Regal Bezeichnung</Text>
//       <View style={localStyles.table}>
//         {/* Table Header */}
//         <View style={[localStyles.row, localStyles.rowBorder]}>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Produkt Name</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Produkt ID</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Menge</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Status</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Aktion</Text>
//           </View>
//         </View>

//         {/* Table Rows */}
//         {data.map((item, index) => (
//           <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.name}>{item.name}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.cellText}>{item.id}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.cell}>{item.menge}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={[localStyles.cell, localStyles[item.status]]}>
//                 {item.status}
//               </Text>
//             </View>
//             <View style={localStyles.cell}>
//               <TouchableOpacity onPress={handlePress}>
//                 <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>
//       <Text style={localStyles.regalBez}>Regal Bezeichnung</Text>
//       <View style={localStyles.table}>
//         {/* Table Header */}
//         <View style={[localStyles.row, localStyles.rowBorder]}>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Produkt Name</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Produkt ID</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Menge</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Status</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Aktion</Text>
//           </View>
//         </View>

//         {/* Table Rows */}
//         {data.map((item, index) => (
//           <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.name}>{item.name}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.cellText}>{item.id}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.cell}>{item.menge}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={[localStyles.cell, localStyles[item.status]]}>
//                 {item.status}
//               </Text>
//             </View>
//             <View style={localStyles.cell}>
//               <TouchableOpacity onPress={handlePress}>
//                 <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>
//       <Text style={localStyles.regalBez}>Regal Bezeichnung</Text>
//       <View style={localStyles.table}>
//         {/* Table Header */}
//         <View style={[localStyles.row, localStyles.rowBorder]}>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Produkt Name</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Produkt ID</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Menge</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Status</Text>
//           </View>
//           <View style={localStyles.cell}>
//             <Text style={localStyles.tableContent}>Aktion</Text>
//           </View>
//         </View>

//         {/* Table Rows */}
//         {data.map((item, index) => (
//           <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.name}>{item.name}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.cellText}>{item.id}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={localStyles.cell}>{item.menge}</Text>
//             </View>
//             <View style={localStyles.cell}>
//               <Text style={[localStyles.cell, localStyles[item.status]]}>
//                 {item.status}
//               </Text>
//             </View>
//             <View style={localStyles.cell}>
//               <TouchableOpacity onPress={handlePress}>
//                 <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingVertical: 20,
  },
  regalContainer: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    borderRadius: 20,
    backgroundColor: "#F8F8FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
    margin: 20,
    padding: 5,
  },
  regalBez: {
    color: "#292D32", // Text color
    fontFamily: "Inter", // Font family
    fontSize: 18, // Font size in points
    fontStyle: "normal", // Normal font style
    fontWeight: "400", // Font weight

    marginBottom: 10,
  },
  tableContent: {
    color: "#AFAFAF",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 5,
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
    flex: 1,
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
export default LagerScreen;
