import { Text, View, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../components/styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import { FlashList } from "@shopify/flash-list";
import CustomPopup from "../../../components/Modals/CustomPopUp";
import Toast from "react-native-toast-message";
import { database } from "../../../database/database";
import ConfirmPopup from "../../../components/Modals/ConfirmPopUp";
import LogService from "../../../database/datamapper/LogHelper";
import { useRoute } from "@react-navigation/native";
import { Q } from "@nozbe/watermelondb";

const RegallisteScreen = () => {
  const navigation = useNavigation();
  const [jsonData, setJsonData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [action, setAction] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const isFocused = useIsFocused();

  const route = useRoute();
  const passedRegalId = route.params?.regalId;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: passedRegalId,
    });

    const fetchData = async () => {
      try {
        const regal = await RegalService.getRegalById(passedRegalId);
        if (!regal) {
          console.error("Regal not found");
          return;
        }

        const artikelList =
          await ArtikelBesitzerService.getArtikelOwnersByRegalId(passedRegalId);

        const artikelWithDetails = await Promise.all(
          artikelList.map(async (artikelOwner) => {
            const artikel = await artikelOwner.artikel.fetch();
            return {
              regalId: passedRegalId,
              gwId: artikel.gwId,
              beschreibung: artikel.beschreibung,
              status: artikel.status,
              artikelOwnerId: artikelOwner.id,
              menge: artikelOwner.menge,
            };
          })
        );

        setJsonData(artikelWithDetails);

        const subscriber = database.collections
          .get("artikel_besitzer")
          .query(Q.where("regal_id", regal.id))
          .observe()
          .subscribe(async (artikelBesitzerSnapshot) => {
            const updatedArtikelList = await Promise.all(
              artikelBesitzerSnapshot.map(async (artikelOwner) => {
                const artikel = await artikelOwner.artikel.fetch();
                return {
                  regalId: passedRegalId,
                  gwId: artikel.gwId,
                  beschreibung: artikel.beschreibung,
                  status: artikel.status,
                  artikelOwnerId: artikelOwner.id,
                  menge: artikelOwner.menge,
                };
              })
            );

            setJsonData(updatedArtikelList);
          });

        return () => subscriber.unsubscribe();
      } catch (error) {
        console.error("Fehler beim Abrufen der Artikel:", error);
      }
    };

    fetchData();
  }, [isFocused]);

  //Sorting Function
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
        onPress={() => setAction({ gwId: item.gwId, regalId: item.regalId })}
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
          greenButtonText="Nachfüllen"
          redButtonText="Löschen"
          yellowButtonText="Bearbeiten"
          cancelCallback={() => setAction(null)}
          greenCallBack={() => {
            navigation.navigate("Actions", {
              screen: "ArtikelNachfüllenNavigator",
              params: { screen: "ArtikelNachfüllen", params: action },
            });
            setAction(null);
          }}
          redCallback={() => {
            setConfirm(action);
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
            await ArtikelBesitzerService.deleteArtikelOwnerByArtikelIdAndRegalId(
              confirm.gwId,
              confirm.regalId
            );

            Toast.show({
              type: "success",
              text1: "Erfolgreich",
              text2: `Artikel mit GWID ${confirm.gwId} gelöscht`,
              visibilityTime: 1000,
            });

            setConfirm(null);
          }}
        />
      </Modal>
    </View>
  );
};

export default RegallisteScreen;

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
    fontWeight: "bold",
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
