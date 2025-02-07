import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { request, PERMISSIONS } from "react-native-permissions";
import { useCameraPermission } from "react-native-vision-camera";
import TopTabNavigation from "../../components/utils/TopTabNavigation/TopTabNavigation";
import { Easing, View, Text } from "react-native";
import { useNavigation } from "expo-router";

export default function Layout() {
  const { hasPermission } = useCameraPermission();
  useEffect(() => {
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
    <Tabs
      screenOptions={{
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          },
        },
        animation: "shift",
        headerShown: false,
        tabBarPosition: "top",
      }}
      tabBar={(props) => <TopTabNavigation {...props} />}
    >
      <Tabs.Screen name="barcode" options={{ title: "Barcode" }} />
      <Tabs.Screen name="qrcode" options={{ title: "Qrcode" }} />
    </Tabs>
  );
}
