import { Button, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../components/styles";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import ArtikelService from "../../database/datamapper/ArtikelHelper";
import RegalService from "../../database/datamapper/RegalHelper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const WarenScreen = () => {
  const navigation = useNavigation();
  const [jsonData, setJsonData] = useState([]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  useEffect(() => {
    LoadArtikel();
  }, []);

  const showDatePicker = (currentDate, setDate) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setDate(selectedDate);
        }
      },
      mode: "date",
      display: "calendar",
    });
  };

  async function orderArtikel() {
    try {
      const allArtikel = await ArtikelService.getAllArtikel();
      const allRegale = [];
      for (const item of allArtikel) {
        allRegale.push(item._raw.regal_id);
      }

      console.log("Alle Regale:", allRegale);

      for (let i = 0; i < allRegale.length; i++) {
        const artikelliste = await ArtikelService.getArtikelByRegalId(allRegale[i]);
        console.log(artikelliste);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Artikel:", error);
    }
  }

  async function LoadArtikel() {
    try {
      const artikel = await ArtikelService.getAllArtikel();
      console.log("Alle Artikel:", artikel);
      setJsonData(artikel);
    } catch (error) {
      console.error("Fehler beim Abrufen der Artikel:", error);
    }
  }

  const handlePress = () => {
    console.log("Mehr Optionen");
  };

  const getStatus = (menge, mindestmenge) => {
    if (menge === 0) return "out";
    if (menge < mindestmenge) return "low";
    return "high";
  };

  const renderItem = ({ item }) => {
    const { menge, mindestmenge, beschreibung, gw_id } = item._raw;
    const status = getStatus(menge, mindestmenge);

    return (
      <View style={[localStyles.row, localStyles.rowBorder]}>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.name}>{beschreibung}</Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.cellText}>{gw_id}</Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.cellText}>{menge}</Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={[localStyles.cellText, localStyles[status]]}>
            {status || "Unbekannt"}
          </Text>
        </View>
        <View style={localStyles.cell}>
          <TouchableOpacity onPress={handlePress}>
            <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Date Picker */}
      <TouchableOpacity onPress={() => showDatePicker(fromDate, setFromDate)}>
        <TextInput
          style={{
            marginTop: 10,
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            textAlign: "center",
            backgroundColor: "white",
          }}
          value={fromDate.toDateString()}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => showDatePicker(toDate, setToDate)}>
        <TextInput
          style={{
            marginTop: 10,
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            textAlign: "center",
            backgroundColor: "white",
          }}
          value={toDate.toDateString()}
          editable={false}
        />
      </TouchableOpacity>

     

      {/* Buttons */}
      <TouchableOpacity style={styles.buttonWhite} onPress={LoadArtikel}>
        <Text numberOfLines={1} style={styles.buttonText}>1</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonWhite} onPress={orderArtikel}>
        <Text numberOfLines={1} style={styles.buttonText}>2</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={localStyles.table}>
        {/* Table Header */}
        <View style={[localStyles.row, localStyles.rowBorder]}>
          <View style={localStyles.cell}><Text numberOfLines={1} style={localStyles.tableContent}>Produkt Name</Text></View>
          <View style={localStyles.cell}><Text numberOfLines={1} style={localStyles.tableContent}>Produkt ID</Text></View>
          <View style={localStyles.cell}><Text numberOfLines={1} style={localStyles.tableContent}>Menge</Text></View>
          <View style={localStyles.cell}><Text numberOfLines={1} style={localStyles.tableContent}>Status</Text></View>
          <View style={localStyles.cell}><Text numberOfLines={1} style={localStyles.tableContent}>Aktion</Text></View>
        </View>

        {/* FlatList */}
        <FlatList
          data={jsonData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={localStyles.listContainer}
        />
      </View>
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
