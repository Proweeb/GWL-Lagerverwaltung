import React from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "../styles";
import { FlashList } from "@shopify/flash-list";

const ArtikelVorschau = ({ artikelList, changedMenge }) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Artikel Vorschau
      </Text>
      <View
        style={{
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
        }}
      >
        <View
          style={{
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
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: 60,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#AFAFAF",
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: "400",
              }}
            >
              Produkt Name
            </Text>
          </View>
          <View
            style={{
              fontSize: 12,
              color: "#AFAFAF",
              justifyContent: "center",
              width: 60,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#AFAFAF",
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: "400",
              }}
            >
              Produkt ID
            </Text>
          </View>
          <View
            style={{
              fontSize: 12,
              color: "#AFAFAF",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: 60,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#AFAFAF",
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: "400",
              }}
            >
              Soll
            </Text>
          </View>
          <View
            style={{
              fontSize: 12,
              color: "#AFAFAF",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              width: 60,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#AFAFAF",
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: "400",
              }}
            >
              Haben
            </Text>
          </View>
        </View>
        <FlashList
          estimatedItemSize={37}
          data={artikelList}
          keyExtractor={(item) => item.gwId.toString()}
          contentContainerStyle={{ paddingBottom: 0 }}
          renderItem={({ item }) => (
            <View
              style={{
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
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#333",
                  textAlign: "left",
                  width: "25%",
                }}
              >
                {item.beschreibung}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#AFAFAF",
                  textAlign: "center",
                  width: "25%",
                }}
              >
                {item.gwId}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#AFAFAF",
                  textAlign: "center",
                  width: "25%",
                }}
              >
                {item.menge}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#AFAFAF",
                  textAlign: "center",
                  width: "25%",
                }}
              >
                {changedMenge[item.gwId] != null
                  ? changedMenge[item.gwId]
                  : item.menge}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default ArtikelVorschau;
