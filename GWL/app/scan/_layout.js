import React, { useEffect } from "react";
import { View, Text, Easing } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { request, PERMISSIONS } from "react-native-permissions";
import { useCameraPermission } from "react-native-vision-camera";

import BarcodeScreen from "./barcode";
import QrCodeScreen from "./qrcode";

import TopTabNavigation from "../../components/utils/TopTabNavigation/TopTabNavigation";

// Create Tab Navigator
const Tab = createMaterialTopTabNavigator();

export default function TopTabNavigator() {
  const { hasPermission } = useCameraPermission();

  useEffect(() => {
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => {});
  }, []);

  // If permission is not granted, show a message
  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      tabBar={(props) => <TopTabNavigation {...props} />}
      screenOptions={{
        tabBarPosition: "top",
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          },
        },
      }}
    >
      <Tab.Screen
        name="Barcode"
        component={BarcodeScreen}
        options={{ title: "Barcode" }}
      />
      <Tab.Screen
        name="QR Code"
        component={QrCodeScreen}
        options={{ title: "QR Code" }}
      />
    </Tab.Navigator>
  );
}
