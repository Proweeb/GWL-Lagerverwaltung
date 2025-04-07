import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { styles } from "../../../components/styles";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { Q } from "@nozbe/watermelondb";
import * as Progress from "react-native-progress";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { database } from "../../../database/database";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
const LagerScreen = () => {
  const navigation = useNavigation();
  const [groupedRegale, setGroupedRegale] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const gwId = route.params?.gwId;

  useEffect(() => {
    let regaleSubscription;
    let artikelBesitzerSubscription;

    navigation.setOptions({
      headerLeft: ({ canGoBack, onPress }) =>
        navigation.canGoBack() ? (
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={styles.textColor}
            style={{ marginLeft: 10 }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        ) : null,
    });
    const setupSubscriptions = async () => {
      if (gwId) {
        try {
          // First get the artikel by gwId
          const artikel = await ArtikelService.getArtikelById(gwId);
          if (!artikel) {
            setLoading(false);
            return;
          }

          // Then subscribe to artikel_besitzer changes for this specific article
          artikelBesitzerSubscription = database
            .get("artikel_besitzer")
            .query(Q.where("gw_id", artikel.id))
            .observe()
            .subscribe(async (artikelBesitzerData) => {
              try {
                // Get all regale that have this article
                const regaleWithArtikel = await Promise.all(
                  artikelBesitzerData.map(async (besitzer) => {
                    const regal = await besitzer.regal.fetch();

                    return {
                      id: regal.id,
                      regalId: regal.regalId,
                      regalName: regal.regalName,
                      fachName: regal.fachName,
                      artikelMenge: 1,
                      hasTargetArticle: true,
                    };
                  })
                );

                // Group by regalName
                const grouped = regaleWithArtikel.reduce((acc, regal) => {
                  if (!acc[regal.regalName]) {
                    acc[regal.regalName] = {
                      regalName: regal.regalName,
                      fachList: [],
                    };
                  }
                  acc[regal.regalName].fachList.push({
                    id: regal.id,
                    regalId: regal.regalId,
                    fachName: regal.fachName,
                    artikelMenge: regal.artikelMenge,
                    hasTargetArticle: regal.hasTargetArticle,
                  });
                  return acc;
                }, {});

                // Sort regale by name
                const sortedRegale = Object.values(grouped).sort((a, b) => {
                  return a.regalName.localeCompare(b.regalName);
                });

                setGroupedRegale(sortedRegale);
                setLoading(false);
              } catch (error) {
                console.error("Error fetching observed data:", error);
                setLoading(false);
              }
            });
        } catch (error) {
          console.error("Error fetching artikel:", error);
          setLoading(false);
        }
      } else {
        // Original subscription for all regale
        regaleSubscription = database
          .get("regale")
          .query()
          .observe()
          .subscribe(async (regaleData) => {
            try {
              const regaleWithArtikel = await Promise.all(
                regaleData.map(async (regal) => {
                  const artikelList = await database
                    .get("artikel_besitzer")
                    .query(Q.where("regal_id", regal.id))
                    .fetch();

                  return {
                    id: regal.id,
                    regalId: regal.regalId,
                    regalName: regal.regalName,
                    fachName: regal.fachName,
                    artikelMenge: artikelList.length,
                    hasTargetArticle: false,
                  };
                })
              );

              const grouped = regaleWithArtikel.reduce((acc, regal) => {
                if (!acc[regal.regalName]) {
                  acc[regal.regalName] = {
                    regalName: regal.regalName,
                    fachList: [],
                  };
                }
                acc[regal.regalName].fachList.push({
                  id: regal.id,
                  regalId: regal.regalId,
                  fachName: regal.fachName,
                  artikelMenge: regal.artikelMenge,
                  hasTargetArticle: regal.hasTargetArticle,
                });
                return acc;
              }, {});

              // Sort regale by name
              const sortedRegale = Object.values(grouped).sort((a, b) => {
                return a.regalName.localeCompare(b.regalName);
              });

              setGroupedRegale(sortedRegale);
              setLoading(false);
            } catch (error) {
              console.error("Error fetching observed data:", error);
              setLoading(false);
            }
          });

        // Also subscribe to artikel_besitzer changes to update counts
        artikelBesitzerSubscription = database
          .get("artikel_besitzer")
          .query()
          .observe()
          .subscribe(async () => {
            // When artikel_besitzer changes, refetch all regale data
            const regaleData = await database.get("regale").query().fetch();
            const regaleWithArtikel = await Promise.all(
              regaleData.map(async (regal) => {
                const artikelList = await database
                  .get("artikel_besitzer")
                  .query(Q.where("regal_id", regal.id))
                  .fetch();

                return {
                  id: regal.id,
                  regalId: regal.regalId,
                  regalName: regal.regalName,
                  fachName: regal.fachName,
                  artikelMenge: artikelList.length,
                  hasTargetArticle: false,
                };
              })
            );

            const grouped = regaleWithArtikel.reduce((acc, regal) => {
              if (!acc[regal.regalName]) {
                acc[regal.regalName] = {
                  regalName: regal.regalName,
                  fachList: [],
                };
              }
              acc[regal.regalName].fachList.push({
                id: regal.id,
                regalId: regal.regalId,
                fachName: regal.fachName,
                artikelMenge: regal.artikelMenge,
                hasTargetArticle: regal.hasTargetArticle,
              });
              return acc;
            }, {});

            // Sort regale by name
            const sortedRegale = Object.values(grouped).sort((a, b) => {
              return a.regalName.localeCompare(b.regalName);
            });

            setGroupedRegale(sortedRegale);
          });
      }
    };

    setupSubscriptions();

    return () => {
      if (regaleSubscription) regaleSubscription.unsubscribe();
      if (artikelBesitzerSubscription)
        artikelBesitzerSubscription.unsubscribe();
    };
  }, [gwId]);

  if (!groupedRegale || groupedRegale.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: styles.backgroundColor,
        }}
      >
        <Text>Keine Lagerplätze vorhanden</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: styles.backgroundColor,
        }}
      >
        <Progress.Circle
          size={50}
          indeterminate={true}
          color={styles.lightBlue}
        />
      </View>
    );
  }
  const RenderFach = ({ item }) => {
    const artikelMenge = item.artikelMenge;
    useEffect(() => {}, [artikelMenge]);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Actions", {
            screen: "LagerNavigator",
            params: { screen: "Regalliste", params: { regalId: item.regalId } },
          });
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
