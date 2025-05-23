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
import CustomPopup from "../../components/Modals/CustomPopUp";
import Toast from "react-native-toast-message";
import { database } from "../../database/database"; // Import your WatermelonDB database instance
import ConfirmPopup from "../../components/Modals/ConfirmPopUp";
import LogService from "../../database/datamapper/LogHelper";
import { ToastMessages } from "../../components/enum";

const WarenScreen = () => {
  const navigation = useNavigation();
  const [jsonData, setJsonData] = useState([]);
  const [action, setAction] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [sortColumn, setSortColumn] = useState("gwId");
  const [sortDirection, setSortDirection] = useState("asc");
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
        if (sortColumn != "gwId") {
          handleSort(sortColumn);
        }
        setJsonData(artikelData);
      });

    // Cleanup subscription on component unmount
    return () => subscriber.unsubscribe();
  }, [isFocused]); // The effect will re-run when the screen gains focus

  const handleSort = (column) => {
    let newDirection = "asc";
    if (sortColumn === column && sortDirection === "asc") {
      newDirection = "desc"; // Toggle direction
    }

    const statusOrder = { ok: 1, low: 2, out: 3 };

    const sortedData = [...jsonData].sort((a, b) => {
      if (column === "status") {
        // Custom order for status
        return newDirection === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      } else if (column === "beschreibung") {
        // String comparison
        return newDirection === "asc"
          ? a.beschreibung.localeCompare(b.beschreibung)
          : b.beschreibung.localeCompare(a.beschreibung);
      } else if (column === "gwId") {
        // Number comparison
        return newDirection === "asc" ? a.gwId - b.gwId : b.gwId - a.gwId;
      } else if (column === "menge") {
        // Numeric comparison
        return newDirection === "asc" ? a.menge - b.menge : b.menge - a.menge;
      }
      return 0;
    });

    setJsonData(sortedData);
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  // Table Headers Map
  const tableHeaders = [
    { key: "beschreibung", label: "Name" },
    { key: "gwId", label: "GWID" },
    { key: "menge", label: "Menge" },
    { key: "status", label: "Status" },
    { key: "action", label: "Aktion" },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[localStyles.row, localStyles.rowBorder]}
        onPress={() => setAction(item.gwId)}
        activeOpacity={0.6}
      >
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.name}>
            {item.beschreibung}
          </Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.cellText}>
            {item.gwId}
          </Text>
        </View>
        <View style={localStyles.cell}>
          <Text numberOfLines={1} style={localStyles.cellText}>
            {item.menge}
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
          <MaterialIcons name="more-horiz" size={24} color="#D3D3D3" />
        </View>
      </TouchableOpacity>
    );
  };

  if (!jsonData || jsonData.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: styles.backgroundColor,
        }}
      >
        <Text>Keine Artikel vorhanden</Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, padding: 10, backgroundColor: styles.backgroundColor }}
    >
      {/* Table */}
      <View style={localStyles.table}>
        {/* Table Header */}
        <View style={[localStyles.row, localStyles.rowBorder]}>
          {tableHeaders.map((header) =>
            header.label != "Aktion" ? (
              <TouchableOpacity
                key={header.key}
                style={localStyles.cell}
                onPress={() => handleSort(header.key)}
              >
                <Text style={localStyles.tableContent}>
                  {header.label}{" "}
                  {sortColumn === header.key
                    ? sortDirection === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={localStyles.cell} key={header}>
                <Text numberOfLines={1} style={localStyles.tableContent}>
                  {header.label}
                </Text>
              </View>
            )
          )}
        </View>

        {/* FlashList */}
        <FlashList
          data={jsonData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={localStyles.listContainer}
          estimatedItemSize={37}
          ListEmptyComponent={() => (
            <View
              style={{
                height: "100%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Keine Artikel vorhanden</Text>
            </View>
          )}
        />
      </View>
      <Modal
        visible={!!action}
        transparent
        statusBarTranslucent
        onRequestClose={() => setAction(null)}
      >
        <CustomPopup
          cancelButtonText="Abbrechen"
          redButtonText="Löschen"
          yellowButtonText="Bearbeiten"
          greenButtonText="Lagerplätze"
          yellowCallback={() => {
            navigation.navigate("Bearbeiten", {
              gwId: action,
            });
            setAction(null);
          }}
          cancelCallback={() => setAction(null)}
          redCallback={() => {
            setConfirm(action);
            setAction(null);
          }}
          greenCallback={() => {
            navigation.navigate("Actions", {
              screen: "LagerNavigator",
              params: { screen: "Lager", params: { gwId: action } },
            });
            setAction(null);
          }}
        />
      </Modal>

      <Modal
        visible={!!confirm}
        transparent
        statusBarTranslucent
        onRequestClose={() => setConfirm(null)}
      >
        <ConfirmPopup
          greenMode={false}
          greyCallback={() => {
            setAction(confirm);
            setConfirm(null);
          }}
          colorCallback={async () => {
            await ArtikelBesitzerService.deleteArtikelOwnerByArtikelId(confirm);
            await ArtikelService.deleteArtikel(confirm);

            Toast.show({
              type: "success",
              text1: ToastMessages.ERFOLG,
              text2: ToastMessages.ARTICLE_DELETED + " " + confirm,
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
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    width: 40,
  },
  ok: {
    backgroundColor: styles.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "green",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    width: 40,
  },
  low: {
    backgroundColor: "#FFF4D8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    color: "orange",
    fontWeight: "bold",
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
