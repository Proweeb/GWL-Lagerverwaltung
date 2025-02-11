import { useEffect, useState } from "react";
import { View, Text, Easing } from "react-native";
import { request, PERMISSIONS } from "react-native-permissions";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useCameraPermission } from "react-native-vision-camera";
import { isFabric } from "react-native-gesture-handler/src/utils";
import TopTabNavigation from "../../components/utils/TopTabNavigation/TopTabNavigation";
import BarcodeScreen from "./barcode";
import QrCodeScreen from "./qrcode";

const Tab = createMaterialTopTabNavigator();

export default function Layout() {
  const { hasPermission } = useCameraPermission();
  useEffect(() => {
    console.log(global._IS_FABRIC);
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => console.log(status));
  }, []);

  // If permission is not granted, show a message
  if (!hasPermission) {
    return (
      <View>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          },
        },
        tabBarPosition: "top",
      }}
      tabBar={(props) => <TopTabNavigation {...props} />}
    >
      <Tab.Screen
        name="Barcode"
        component={BarcodeScreen}
        options={{ title: "Barcode" }}
      />
      <Tab.Screen
        name="QR Code"
        component={QrCodeScreen}
        ptions={{ title: "Qrcode" }}
      />
    </Tab.Navigator>
  );
}
