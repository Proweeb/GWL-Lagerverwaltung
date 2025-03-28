import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, Keyboard } from "react-native";

import { styles } from "../../components/styles";

import ActionGrid from "../../components/utils/ActionGrid";
import InventoryWidget from "../../components/utils/InventoryWidget";
import HomeWidget from "../../components/utils/HomeWidget/homeWidget";
import NotificationsWidget from "../../components/oneTimeUse/NotifcationsWidget";

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
      screen: "ArtikelEinlagernNavigator",
      iconName: "cart-plus", // Represents storing an item
      iconType: "MaterialCommunityIcons",
      label: "Art.-Einlagern",
      route: "ArtikelEinlagernNavigator",
    },
    {
      screen: "ArtikelEntnehmenNavigator",
      iconName: "cart-minus", // Represents taking an item out
      iconType: "MaterialCommunityIcons",
      label: "Art.-Entnehmen",
      route: "ArtikelEntnehmenNavigator",
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
      screen: "PlatzHinzufügenNavigator",
      iconName: "package-variant-closed", // Represents adding a storage location
      iconType: "MaterialCommunityIcons",
      label: "LP-Hinzufügen",
      route: "PlatzHinzufügenNavigator",
    },
    {
      screen: "ArtikelPlatzHinzufügenNavigator",
      iconName: "package-variant", // Represents assigning an item to a place
      iconType: "MaterialCommunityIcons",
      label: "Art. & LP-Ergänzen",
      route: "ArtikelPlatzHinzufügenNavigator",
    },
  ],
];

function HomeScreen() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    // Cleanup listeners when component unmounts
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
        containerStyle={[{ alignItems: "center", flex: 1, width: "100%" }]}
      >
        {!keyboardVisible && <NotificationsWidget />}
      </HomeWidget>
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

export default HomeScreen;
