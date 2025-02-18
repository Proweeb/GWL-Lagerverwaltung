import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { request, PERMISSIONS } from "react-native-permissions";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ScannerFrame from "../../components/utils/ViewFinder/ScannerFrame";
import { styles } from "../../components/styles";
import { Audio } from "expo-av";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";

// Check for Haptics Support

// export default function QrCodeScreen() {
//   const camera = useRef(null);
//   const [switched, setSwitch] = useState("back");
//   const [scannedCodes, setScannedCodes] = useState(new Set()); // Track scanned QR codes
//   const [shownCode, setCode] = useState("");
//   const device = useCameraDevice(switched);
//   const { hasPermission, requestPermission } = useCameraPermission();

//   const [ScannedAnimation, setScannedAnimation] = useState(false);
//   const [isActive, setIsActive] = useState(false);

//   const [isBarcodeMode, setIsBarcodeMode] = useState("barcode");
//   const [codes, setCodes] = useState({
//     saveQrCode: false,
//     saveBarcode: false,
//     qrCode: "",
//     barcode: "",
//   });

//   // Request camera permission on mount
//   useEffect(() => {}, [isActive]);

//   useEffect(() => {
//     request(PERMISSIONS.ANDROID.CAMERA).then((status) => {});
//   }, []);

//   const playSound = async () => {
//     const { sound } = await Audio.Sound.createAsync(
//       require("../../assets/scanned.mp3") // Ensure the correct path to your file
//     );
//     await sound.playAsync();
//   };
//   // QR code scanner logic
//   const codeScanner = useCodeScanner({
//     codeTypes: [isBarcodeMode ? "ean-8" : "qr"],
//     onCodeScanned: (codes) => {
//       for (const code of codes) {
//         if (!scannedCodes.has(code.value)) {
//           setScannedCodes((prevCodes) => new Set(prevCodes).add(code.value));
//           setScannedAnimation(true);
//           playSound();
//           setCode(code.value);
//         }
//       }
//     },
//   });

//   // Switch between front and back camera

//   if (!hasPermission) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: styles.backgroundColor,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text>Requesting Camera Permission...</Text>
//       </View>
//     );
//   }

//   if (!device) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: styles.backgroundColor,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text>No Camera Device Found</Text>
//       </View>
//     );
//   }

//   // Animate opacity when isActive changes
//   const opacity = useSharedValue(0);

//   // Animate opacity whenever isBarcodeMode changes (no condition for toggle)
//   useEffect(() => {
//     // Trigger fade-out animation when isBarcodeMode changes
//     opacity.value = withTiming(1, { duration: 700 }); // Fade out over 500ms

//     // Optionally, you can fade back in after some time if necessary
//     const timeout = setTimeout(() => {
//       opacity.value = withTiming(0, { duration: 300 }); // Fade in after a brief pause
//     }, 700); // Delay for 500ms after fade-out starts

//     return () => clearTimeout(timeout); // Clean up timeout on component unmount
//   }, [isBarcodeMode]); // Trigger whenever

//   // Animated style for the camera overlay
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       opacity: opacity.value,
//     };
//   });

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: styles.backgroundColor,
//         paddingTop: heightPercentageToDP(10),
//         flexDirection: "column",
//       }}
//     >
//       {/* Camera Preview */}
//       <ScanModeSelector setIsBarcodeMode={setIsBarcodeMode} />
//       <View
//         style={{
//           flex: 0.8,
//           margin: 10,
//           padding: 8,
//           backgroundColor: styles.white,
//           boxShadow: styles.boxShadow,
//           borderRadius: 13,
//           elevation: 4,
//         }}
//       >
//         <View
//           style={{
//             overflow: "hidden",
//             borderRadius: 13,
//             flex: 1,
//           }}
//         >
//           <Animated.View
//             style={[
//               {
//                 position: "absolute",
//                 flex: 1,
//                 backgroundColor: "black",
//                 width: "100%",
//                 height: "100%",
//                 zIndex: 2,
//               },
//               animatedStyle,
//             ]}
//           />
//           <Camera
//             ref={camera}
//             style={{
//               flex: 1,
//               borderRadius: 13,
//               width: "100%",
//             }}
//             device={device}
//             isActive={true}
//             codeScanner={codeScanner}
//             enableZoomGesture={true}
//             preview={true}
//           />
//         </View>
//         <View
//           style={{
//             position: "absolute",
//             height: "100%",
//             width: "100%",
//             borderRadius: 13,
//             margin: 8,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <ScannerFrame
//             heightMultiplier={isBarcodeMode ? 0.5 : 1}
//             borderColor={styles.white}
//             animationStart={ScannedAnimation}
//             setAnimation={setScannedAnimation}
//             containerstyle={
//               {
//                 //backgroundColor: "rgba(0,0,0,0.24)",
//               }
//             }
//           ></ScannerFrame>
//         </View>
//       </View>

//       <View
//         style={{
//           flex: 0.2,
//           justifyContent: "center",
//           flexDirection: "row",
//           paddingTop: 20,
//         }}
//       >
//         <View
//           style={{
//             marginLeft: 0,
//             width: "75%",
//             height: 40,
//             elevation: 2,
//             borderRadius: 10,
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: styles.white,
//           }}
//         >
//           <TextInput style={{ textAlign: "center", fontSize: 20 }}>
//             {shownCode}
//           </TextInput>
//         </View>
//         <TouchableOpacity
//           style={{
//             marginLeft: 10,
//             width: 40,
//             height: 40,
//             elevation: 2,
//             borderRadius: 10,
//             backgroundColor: styles.lightBlue,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Ionicons name={"camera-outline"} size={20} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
export default function QrCodeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const [switched, setSwitch] = useState("back");
  const [scannedCodes, setScannedCodes] = useState(new Set()); // Track scanned QR codes
  const [shownCode, setCode] = useState("");
  const device = useCameraDevice(switched);
  const { hasPermission, requestPermission } = useCameraPermission();

  const [ScannedAnimation, setScannedAnimation] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [isBarcodeMode, setIsBarcodeMode] = useState(true); // Boolean: false for QR, true for Barcode
  const [codes, setCodes] = useState({
    saveQrCode: false,
    saveBarcode: false,
    qrCode: "",
    barcode: "",
  });
  const onScan = route.params?.onScan;
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Request camera permission on mount
  useEffect(() => {}, [isActive]);
  useEffect(() => {
    if (codes.saveQrCode) {
      onScan(codes.qrCode);
      navigation.goBack();
    }

    if (codes.saveBarcode) {
      onScan(codes.barcode);
      navigation.goBack();
    }
  }, [codes]);

  useEffect(() => {
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => {});
  }, []);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/scanned.mp3") // Ensure the correct path to your file
    );
    await sound.playAsync();
  };

  // QR code scanner logic
  const codeScanner = useCodeScanner({
    codeTypes: [isBarcodeMode ? "ean-8" : "qr"], // Conditionally set QR or Barcode
    onCodeScanned: (codes) => {
      for (const code of codes) {
        if (!scannedCodes.has(code.value)) {
          setScannedCodes((prevCodes) => new Set(prevCodes).add(code.value));

          if (isBarcodeMode) {
            setCode(code.value);
            setCodes((prev) => ({ ...prev, barcode: code.value }));

            if (!codes.saveBarcode) {
              setScannedAnimation(true);
              playSound();
            }
          } else {
            setCode(code.value);
            setCodes((prev) => ({ ...prev, qrCode: code.value }));

            if (!codes.saveQrCode) {
              setScannedAnimation(true);
              playSound();
            }
          }
        }
      }
    },
  });
  // Animate opacity when isActive changes
  const opacity = useSharedValue(0);

  // Animate opacity whenever isBarcodeMode changes (no condition for toggle)
  useEffect(() => {
    // Trigger fade-out animation when isBarcodeMode changes
    opacity.value = withTiming(1, { duration: 1000 }); // Fade out over 500ms

    // Optionally, you can fade back in after some time if necessary
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }); // Fade in after a brief pause
    }, 1000); // Delay for 500ms after fade-out starts

    return () => clearTimeout(timeout); // Clean up timeout on component unmount
  }, [isBarcodeMode]); // Trigger whenever

  // Animated style for the camera overlay
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleConfirmCode = () => {
    handleScreenPress();
    if (isBarcodeMode && !codes.saeBarcode) {
      setCodes((prev) => ({ ...prev, saveBarcode: true }));
    } else if (!isBarcodeMode && !codes.saveQrCode) {
      setCodes((prev) => ({ ...prev, saveQrCode: true }));
    }
  };

  const handleScreenPress = () => {
    inputRef.current?.blur(); // Removes the typing indicator (cursor)
  };

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
        paddingTop: heightPercentageToDP(10),
        flexDirection: "column",
      }}
    >
      {/* Camera Preview */}
      <ScanModeSelector setIsBarcodeMode={setIsBarcodeMode} />
      <KeyboardAvoidingView
        style={{
          flex: 0.8,
          margin: 10,
          padding: 8,
          backgroundColor: styles.white,
          boxShadow: styles.boxShadow,
          borderRadius: 13,
          elevation: 4,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 13,
            flex: 1,
          }}
        >
          <Animated.View
            style={[
              {
                position: "absolute",
                flex: 1,
                backgroundColor: "black",
                width: "100%",
                height: "100%",
                zIndex: 2,
              },
              animatedStyle,
            ]}
          />
          <Camera
            style={{
              flex: 1,
              borderRadius: 13,
              width: "100%",
            }}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            enableZoomGesture={true}
            preview={true}
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
            heightMultiplier={isBarcodeMode ? 0.5 : isInputFocused ? 0.5 : 1}
            borderColor={styles.white}
            animationStart={ScannedAnimation}
            setAnimation={setScannedAnimation}
            containerstyle={
              {
                //backgroundColor: "rgba(0,0,0,0.24)"},
              }
            }
          />
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          flex: 0.2,
          justifyContent: "center",
          flexDirection: "row",
          paddingTop: 20,
        }}
      >
        <View
          style={{
            marginLeft: 0,
            width: "75%",
            height: 40,
            elevation: 2,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: styles.white,
          }}
        >
          <TextInput
            ref={inputRef}
            style={{ textAlign: "center", fontSize: 20, width: "100%" }}
            editable={isBarcodeMode ? !codes.saveBarcode : !codes.saveQrCode}
            value={isBarcodeMode ? codes.barcode : codes.qrCode}
            onChangeText={(text) => {
              if (isBarcodeMode) {
                setCodes((prev) => ({ ...prev, barcode: text }));
              } else {
                setCodes((prev) => ({ ...prev, qrCode: text }));
              }
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
        </View>
        <TouchableOpacity
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            elevation: 2,
            borderRadius: 10,
            backgroundColor: styles.lightGreen,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleConfirmCode} // Call handleConfirmCode with no parameter
        >
          <MaterialCommunityIcons name={"checkbox-marked"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ScanModeSelector({ setIsBarcodeMode }) {
  const [isBarcodeFocused, setIsBarcodeFocused] = useState(true);

  const handlePress = (mode) => {
    setIsBarcodeFocused(mode === "barcode");
    setIsBarcodeMode(mode === "barcode");
  };

  return (
    <View style={{ backgroundColor: "white", width: "100%" }}>
      <Text style={TopBarStyles.scanModeText}>Scan Mode</Text>
      <View style={TopBarStyles.container}>
        <TouchableOpacity
          onPress={() => handlePress("barcode")}
          style={TopBarStyles.tabButton}
        >
          {isBarcodeFocused && (
            <LinearGradient
              colors={["rgba(0,0,0,0.17)", "rgba(0,0,0,0.05)"]}
              style={TopBarStyles.insetShadow}
            />
          )}
          <Ionicons name="barcode-outline" size={20} color={"black"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePress("qr")}
          style={TopBarStyles.tabButton}
        >
          {!isBarcodeFocused && (
            <LinearGradient
              colors={["rgba(0,0,0,0.17)", "rgba(0,0,0,0.05)"]}
              style={TopBarStyles.insetShadow}
            />
          )}
          <Ionicons name="qr-code-outline" size={20} color={"black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const TopBarStyles = StyleSheet.create({
  scanModeText: {
    fontSize: 10,
    color: "#C0C0C0",
    fontWeight: "400",
    marginLeft: 20,
  },
  container: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#F8F8FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    marginLeft: 20,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
    width: widthPercentageToDP(25),
  },
  tabButton: {
    padding: 10,
  },
  insetShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
});
