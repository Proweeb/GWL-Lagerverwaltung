import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ArtikelVorschauView from "./ArtikelVorschauViews";

const ArtikelVorschau = ({ artikelList, changedMenge }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Artikel Vorschau</Text>

      <View style={styles.card}>
        <View style={styles.rowHeader}>
          <View style={styles.column}>
            <Text style={styles.headerColumnText} numberOfLines={1}>
              Name
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.headerColumnText} numberOfLines={1}>
              GWID
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.headerColumnText} numberOfLines={1}>
              Regal ID
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.headerColumnText} numberOfLines={1}>
              Soll
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.headerColumnText} numberOfLines={1}>
              Ist
            </Text>
          </View>
        </View>

        <FlashList
          estimatedItemSize={37}
          data={artikelList}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ArtikelVorschauView item={item} changedMenge={changedMenge} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
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
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 2,
    height: 35,
    borderBottomWidth: 2,
    padding: 5,
    borderBottomColor: "#ffffff",
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerColumnText: {
    color: "#AFAFAF",
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "400",
  },
  listContent: {
    paddingBottom: 0,
  },
});

export default ArtikelVorschau;
