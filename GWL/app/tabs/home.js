import React from "react";
import { View, Text, Dimensions } from "react-native";

import { styles } from "../../components/styles";

import ActionGrid from "../../components/utils/ActionGrid";
import InventoryWidget from "../../components/utils/InventoryWidget";
console.log(Dimensions.get("screen").width);
const actions = [
  [
    {
      screen: "ArtikelNachfüllenNavigator",
      iconName: "cart-heart", // Represents adding/refilling items
      iconType: "MaterialCommunityIcons",
      label: "Art.-Nachfüllen ",
      route: "ArtikelNachfüllenNavigator",
    },
    {
      screen: "PlatzHinzufügenNavigator",
      iconName: "package-variant-closed", // Represents adding a storage location
      iconType: "MaterialCommunityIcons",
      label: "LP-Hinzufügen",
      route: "PlatzHinzufügenNavigator",
    },

    {
      screen: "ArtikelEinlagernNavigator",
      iconName: "cart-plus", // Represents storing an item
      iconType: "MaterialCommunityIcons",
      label: "Art.-Einlagern",
      route: "ArtikelEinlagernNavigator",
    },
  ],
  [
    {
      screen: "LagerNavigator",
      iconName: "warehouse", // Represents a warehouse
      iconType: "MaterialCommunityIcons",
      label: "Lager-Verwalten",
      route: "LagerNavigator",
    },
    {
      screen: "ArtikelPlatzHinzufügenNavigator",
      iconName: "package-variant", // Represents assigning an item to a place
      iconType: "MaterialCommunityIcons",
      label: "Art. & LP-Ergänzen",
      route: "ArtikelPlatzHinzufügenNavigator",
    },
    {
      screen: "ArtikelEntnehmenNavigator",
      iconName: "cart-minus", // Represents taking an item out
      iconType: "MaterialCommunityIcons",
      label: "Art.-Entnehmen",
      route: "ArtikelEntnehmenNavigator",
    },
  ],
];

function HomeScreen() {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: 20,

          backgroundColor: styles.backgroundColor,
        },
        Dimensions.get("screen").width > 599 && {
          paddingHorizontal: 100,
        },
      ]}
    >
      <HomeWidget
        flexValue={0.9}
        containerFlex={0.7}
        title={"Benachrichtungen"}
        containerStyle={{ overflow: "hidden" }}
      />
      <HomeWidget
        flexValue={0.95}
        containerFlex={1}
        title={"Aktionen"}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <ActionGrid actions={actions} />
      </HomeWidget>
      <HomeWidget
        flexValue={0.8}
        containerFlex={1}
        title={"Lagerbewegungen"}
        containerStyle={{
          padding: 0,
          paddingVertical: Dimensions.get("screen").height < 800 ? 20 : 25,
          paddingHorizontal: 35,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <InventoryWidget></InventoryWidget>
      </HomeWidget>
    </View>
  );
}

const HomeWidget = ({
  title,
  flexValue,
  containerFlex,
  children,
  containerStyle,
}) => {
  return (
    <View
      style={{
        flex: containerFlex,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={[
          styles.subHeader,
          { alignSelf: "flex-start", paddingVertical: 10 },
        ]}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: styles.white,
          width: "100%",
          flex: flexValue,
          borderRadius: 20,
          elevation: 8,
        }}
      >
        <View style={[{ padding: 20 }, containerStyle]}>{children}</View>
      </View>
    </View>
  );
};

export default HomeScreen;
