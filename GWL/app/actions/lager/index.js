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

      // Table Start v
      <Text style= {localStyles.regalBez}>Regal Bezeichnung</Text>
      <View style={localStyles.table}>
        {/* Table Header */}
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Produkt Name</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Produkt ID</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Menge</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Status</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Aktion</Text>
          </View>
        </View>
        
        {/* Table Rows */}
        {data.map((item, index) => (
          <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
            <View style={localStyles.cell}>
              <Text style={localStyles.name}>{item.name}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={localStyles.cellText}>{item.id}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={localStyles.cell}>{item.menge}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={[localStyles.cell, localStyles[item.status]]}>{item.status}</Text>
            </View>
            <View style={localStyles.cell}>
              <TouchableOpacity onPress={handlePress}>
                <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      // Table End ^








      <Text style= {localStyles.regalBez}>Regal Bezeichnung</Text>

      <View style={localStyles.table}>
        {/* Table Header */}
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Produkt Name</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Produkt ID</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Menge</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Status</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Aktion</Text>
          </View>
        </View>
        
        {/* Table Rows */}
        {data.map((item, index) => (
          <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
            <View style={localStyles.cell}>
              <Text style={localStyles.name}>{item.name}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={localStyles.cellText}>{item.id}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={localStyles.cell}>{item.menge}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={[localStyles.cell, localStyles[item.status]]}>{item.status}</Text>
            </View>
            <View style={localStyles.cell}>
              <TouchableOpacity onPress={handlePress}>
                <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

















      <Text style= {localStyles.regalBez}>Regal Bezeichnung</Text>

      <View style={localStyles.table}>
        {/* Table Header */}
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Produkt Name</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Produkt ID</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Menge</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Status</Text>
          </View>
          <View style={localStyles.cell}>
            <Text style={localStyles.tableContent}>Aktion</Text>
          </View>
        </View>
        
        {/* Table Rows */}
        {data.map((item, index) => (
          <View key={index} style={[localStyles.row, localStyles.rowBorder]}>
            <View style={localStyles.cell}>
              <Text style={localStyles.name}>{item.name}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={localStyles.cellText}>{item.id}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={localStyles.cell}>{item.menge}</Text>
            </View>
            <View style={localStyles.cell}>
              <Text style={[localStyles.cell, localStyles[item.status]]}>{item.status}</Text>
            </View>
            <View style={localStyles.cell}>
              <TouchableOpacity onPress={handlePress}>
                <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
              </TouchableOpacity>
            </View>
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
    paddingVertical: 20,
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
    marginBottom: 20,
    padding: 5,
  },
  regalBez: {
    color: "#292D32", // Text color
    fontFamily: "Inter", // Font family
    fontSize: 12, // Font size in points
    fontStyle: "normal", // Normal font style
    fontWeight: "400", // Font weight
    lineHeight: 16, // lineHeight, you can adjust it based on your design preference
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
    width: 40
  },
  high: {
    backgroundColor: "#DFFFD8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "green",
    fontSize: 10,
    textAlign: "center",
    width: 40
  },
  low: {
    backgroundColor: "#FFF4D8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "orange",
    fontSize: 10,
    textAlign: "center",
    width: 40
  },
  name: {
    fontSize: 12,
    color: "#333",
    textAlign: "left",
  },
});
