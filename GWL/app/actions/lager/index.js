import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../../../components/styles";
import { MaterialIcons } from "@expo/vector-icons";


export default function IndexScreen() {
  const data = [
    { name: "Baby Oil", id: "#3451F", menge: "x3", status: "out" },
    { name: "Kiwi", id: "#6341E", menge: "x265", status: "high" },
    { name: "Keyboard", id: "#8253A", menge: "x60", status: "low" },
    { name: "Mouse", id: "#5434R", menge: "x1", status: "out" },
    { name: "Cup", id: "#1244T", menge: "x4", status: "out" },
    
   
  ];

  const handlePress = () => {
    console.log('Action was pressed!');
  };

  
  return (
    <ScrollView contentContainerStyle={localStyles.scrollContainer}>
        <View style={localStyles.table}>
          <View style={[localStyles.row, localStyles.rowBorder]}>
            <Text style={localStyles.tableContent}>Produkt Name</Text>
            <Text style={localStyles.tableContent}>Produkt ID</Text>
            <Text style={localStyles.tableContent}>Menge</Text>
            <Text style={localStyles.tableContent}>Status</Text>
            <Text style={localStyles.tableContent}>Aktion</Text>
          </View>
          {/* Table Rows */}
          {data.map((item, index) => (
            <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
              <Text style={localStyles.name}>{item.name}</Text>
              <Text style={localStyles.cell}>{item.id}</Text>
              <Text style={localStyles.cell}>{item.menge}</Text>
              <Text style={[localStyles.cell, localStyles[item.status]]}>{item.status}</Text>
              <TouchableOpacity onPress={handlePress}><MaterialIcons name="more-horiz" size={24} color="#D3D3D3"/></TouchableOpacity>
            </View>
          ))}
        </View>


        <View style={localStyles.table}>
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <Text style={localStyles.tableContent}>Produkt Name</Text>
          <Text style={localStyles.tableContent}>Produkt ID</Text>
          <Text style={localStyles.tableContent}>Menge</Text>
          <Text style={localStyles.tableContent}>Status</Text>
          <Text style={localStyles.tableContent}>Aktion</Text>
        </View>
          {/* Table Rows */}
          {data.map((item, index) => (
            <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
              <Text style={localStyles.name}>{item.name}</Text>
              <Text style={localStyles.cell}>{item.id}</Text>
              <Text style={localStyles.cell}>{item.menge}</Text>
              <Text style={[localStyles.cell, localStyles[item.status]]}>{item.status}</Text>
              <TouchableOpacity onPress={handlePress}><MaterialIcons name="more-horiz" size={24} color="#D3D3D3"/></TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={localStyles.table}>
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <Text style={localStyles.tableContent}>Produkt Name</Text>
          <Text style={localStyles.tableContent}>Produkt ID</Text>
          <Text style={localStyles.tableContent}>Menge</Text>
          <Text style={localStyles.tableContent}>Status</Text>
          <Text style={localStyles.tableContent}>Aktion</Text>
        </View>
          {/* Table Rows */}
          {data.map((item, index) => (
            <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
              <Text style={localStyles.name}>{item.name}</Text>
              <Text style={localStyles.cell}>{item.id}</Text>
              <Text style={localStyles.cell}>{item.menge}</Text>
              <Text style={[localStyles.cell, localStyles[item.status]]}>{item.status}</Text>
              <TouchableOpacity onPress={handlePress}><MaterialIcons name="more-horiz" size={24} color="#D3D3D3"/></TouchableOpacity>
            </View>
          ))}
        </View>





     
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: styles.backgroundColor,
    paddingVertical: 20, // Optional: Adds spacing
  },
  table: {
    borderRadius: 20,
    backgroundColor: "#F8F8FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    width: 349,
    height: 282,
    flexShrink: 0,
    marginBottom: 20,
    overflowY: "auto", 
    padding: 10, 
  },
  tableContent: {
    color: "#AFAFAF", 
    fontFamily: "Inter", 
    fontSize: 12, 
    fontStyle: "normal",
    fontWeight: "400", 
    marginTop: 10,
  },
  row: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    width: "100%", 
    paddingHorizontal: 10, 
    marginBottom: 5,
    height:35,
  },
  cell: {
    fontSize: 12,
    color: "#AFAFAF",
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
  },
  high: {
    backgroundColor: "#DFFFD8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "green",
    fontSize: 10,
  },
  low: {
    backgroundColor: "#FFF4D8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "orange",
    fontSize: 10,
  },
  rowBorder: {
    borderBottomWidth: 1, 
    borderBottomColor: "#EEE", 
  },
  name:{
    fontSize: 12,
    color: "#333",
  },
  button: {
    padding: 10, 
    alignItems: "center",
    justifyContent: "center",
  },
});
