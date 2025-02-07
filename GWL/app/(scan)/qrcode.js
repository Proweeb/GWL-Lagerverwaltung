import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { request, PERMISSIONS } from "react-native-permissions";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ScannerFrame from "../../components/utils/ViewFinder/ScannerFrame";
import { styles } from "../../components/styles";
import { Audio } from "expo-av";

// Check for Haptics Support

export default function iventurscreen() {
  const camera = useRef(null);
  const [switched, setSwitch] = useState("back");
  const [scannedCodes, setScannedCodes] = useState(new Set()); // Track scanned QR codes
  const [shownCode, setCode] = useState("");
  const device = useCameraDevice(switched);
  const { hasPermission, requestPermission } = useCameraPermission();

  const isFocused = useIsFocused();
  const [isActive, setIsActive] = useState(false);
  const [ScannedAnimation, setScannedAnimation] = useState(false);

  useEffect(() => {
    setIsActive(isFocused);
  }, [isFocused]);

  // Request camera permission on mount
  useEffect(() => {
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => {
      console.log(status);
    });
  }, []);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/scanned.mp3") // Ensure the correct path to your file
    );
    await sound.playAsync();
  };
  // QR code scanner logic
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        if (!scannedCodes.has(code.value)) {
          setScannedCodes((prevCodes) => new Set(prevCodes).add(code.value));
          setScannedAnimation(true);
          playSound();
          setCode(code.value);
        }
      }
    },
  });

  // Switch between front and back camera

  if (!hasPermission) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: styles.backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: styles.backgroundColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: styles.backgroundColor,

        flexDirection: "column",
      }}
    >
      {/* Camera Preview */}
      <View
        style={{
          flex: 0.8,
          margin: 10,
          padding: 8,
          backgroundColor: styles.white,
          boxShadow: styles.boxShadow,
          borderRadius: 13,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 13,
            flex: 1,
          }}
        >
          <Camera
            ref={camera}
            style={{
              flex: 1,

              borderRadius: 13,
              width: "100%",
            }}
            device={device}
            isActive={isActive}
            codeScanner={codeScanner}
            preview={isActive}
            enableZoomGesture={true}
          />
        </View>
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            borderRadius: 13,
            margin: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScannerFrame
            heightMultiplier={1}
            borderColor={styles.white}
            animationStart={ScannedAnimation}
            setAnimation={setScannedAnimation}
            containerstyle={
              {
                //backgroundColor: "rgba(0,0,0,0.24)",
              }
            }
          ></ScannerFrame>
        </View>
      </View>

      <View
        style={{
          flex: 0.2,
          justifyContent: "center",
          flexDirection: "row",
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            marginLeft: 0,
            width: "75%",
            height: 40,
            boxShadow: styles.boxShadow,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20 }}>{shownCode}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            boxShadow: styles.boxShadow,
            borderRadius: 10,
            backgroundColor: styles.lightBlue,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name={"camera-outline"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
