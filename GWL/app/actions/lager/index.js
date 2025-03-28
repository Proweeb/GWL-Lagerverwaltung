import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import { styles } from "../../../components/styles";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Q } from "@nozbe/watermelondb";

import { database } from "../../../database/database";
const LagerScreen = () => {
  const navigation = useNavigation();
  const [groupedRegale, setGroupedRegale] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = database
      .get("regale") // Assuming your table is called "regale"
      .query() // Query all "Regal" items
      .observe()
      .subscribe(async (regaleData) => {
        try {
          // Fetch articles for each regal reactively
          const regaleWithArtikel = await Promise.all(
            regaleData.map(async (regal) => {
              const artikelList = await database
                .get("artikel_besitzer") // Assuming table name is "artikel_besitzer"
                .query(Q.where("regal_id", regal.id))
                .fetch();

              return {
                id: regal.id,
                regalId: regal.regalId, // Each Regal has a unique regalId
                regalName: regal.regalName,
                fachName: regal.fachName,
                artikelMenge: artikelList.length, // Number of articles in this Regal
              };
            })
          );

          // Group by regalName but preserve individual regalId for each fach
          const grouped = regaleWithArtikel.reduce((acc, regal) => {
            if (!acc[regal.regalName]) {
              acc[regal.regalName] = {
                regalName: regal.regalName,
                fachList: [],
              };
            }
            // Each fach gets its own regalId, even though they are in the same regalName group
            acc[regal.regalName].fachList.push({
              id: regal.id, // Unique ID for the fach
              regalId: regal.regalId, // Unique regalId for this fach
              fachName: regal.fachName, // Name of the fach
              artikelMenge: regal.artikelMenge, // Number of articles in this fach
            });

            return acc;
          }, {});

          // Convert object to array for rendering
          setGroupedRegale(Object.values(grouped));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching observed data:", error);
        }
      });

    return () => subscription.unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size={"large"}
        color={styles.lightBlue}
        style={{ backgroundColor: styles.backgroundColor, flex: 1 }}
      />
    );
  }
  const RenderFach = ({ item }) => {
    useEffect(() => {});
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item.regalId);
        }}
        style={[
          {
            height: heightPercentageToDP(10),
            flex: 1,
            borderRadius: 10,
            marginHorizontal: 5,
            marginVertical: 5,
            justifyContent: "center",
            alignItems: "center",
          },
          item.artikelMenge < 1
            ? { backgroundColor: "#FFDADB" }
            : { backgroundColor: "#C7E5F3" },
        ]}
      >
        <Text
          style={[
            localStyles.MengeAnzeige,
            item.artikelMenge < 1 ? { color: "#fc2024" } : { color: "#30a6de" },
          ]}
        >
          {item.fachName}
        </Text>
      </TouchableOpacity>
    );
  };
  const RenderRegal = ({ item }) => {
    return (
      <View style={[localStyles.regalContainer]}>
        <Text style={localStyles.regalBez}>{item.regalName}</Text>

        <View style={{ flex: 1, width: "100%" }}>
          <FlashList
            data={item.fachList}
            numColumns={3}
            renderItem={({ item }) => <RenderFach item={item}></RenderFach>}
            estimatedItemSize={100}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={localStyles.container}>
      <FlashList
        data={groupedRegale}
        renderItem={({ item }) => <RenderRegal item={item} />}
        estimatedItemSize={100}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: styles.backgroundColor,
    paddingVertical: 0,
    paddingTop: 10,
  },
  regalContainer: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: styles.white,
    flex: 1,
    marginHorizontal: 25,
    marginBottom: 20,
    elevation: 5,
    padding: 10,
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
    //color: "#292D32", // Text color
    fontFamily: "Inter", // Font family
    fontSize: 50, // Font size in points
    //fontStyle: "bold", // Normal font style
    fontWeight: "800", // Font weight

    marginVertical: 10,
  },
  MengeAnzeige: {
    fontSize: 20,
    fontWeight: "800",
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
});
export default LagerScreen;
