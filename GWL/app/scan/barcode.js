import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
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
import { styles } from "../../components/styles"; // Keeping your existing styles
import { Audio } from "expo-av";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BarcodeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const [switched, setSwitch] = useState("back");
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const [shownCode, setCode] = useState("");
  const device = useCameraDevice(switched);
  const { hasPermission, requestPermission } = useCameraPermission();

  const [ScannedAnimation, setScannedAnimation] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const [codes, setCodes] = useState({
    saveBarcode: false,
    barcode: "",
  });

  const clearButtonOpacity = useSharedValue(0); // For animating "X" button

  const onScan = route.params?.onScan;

  useEffect(() => {
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
      require("../../assets/scanned.mp3")
    );
    await sound.playAsync();
  };

  // QR Code Scanner Logic
  const codeScanner = useCodeScanner({
    codeTypes: ["code-128"],
    onCodeScanned: (codes) => {
      if (!showClearButton) {
        // Prevent scanning when a code is displayed
        for (const code of codes) {
          if (!scannedCodes.has(code.value)) {
            setShowClearButton(true); // Show "X" button
            clearButtonOpacity.value = withTiming(1, { duration: 300 });

            setScannedCodes((prevCodes) => new Set(prevCodes).add(code.value));
            setCode(code.value);
            setCodes((prev) => ({ ...prev, barcode: code.value }));

            setScannedAnimation(true);
            playSound();
            break; // Stop after scanning one code
          }
        }
      }
    },
  });

  const handleClearCode = () => {
    setCode("");
    setCodes({ saveBarcode: false, barcode: "" });
    clearButtonOpacity.value = withTiming(0, { duration: 300 }, () =>
      setShowClearButton(false)
    );
  };

  const handleConfirmCode = () => {
    if (!codes.saveBarcode) {
      setCodes((prev) => ({ ...prev, saveBarcode: true }));
    }
  };

  if (!hasPermission) {
    return (
      <View style={screenStyles.centeredView}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={screenStyles.centeredView}>
        <Text>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View style={screenStyles.container}>
      <KeyboardAvoidingView style={screenStyles.scannerContainer}>
        <View style={screenStyles.cameraContainer}>
          <Animated.View style={[screenStyles.overlay, { opacity: 0.5 }]} />
          <Camera
            style={screenStyles.camera}
            device={device}
            isActive={!showClearButton}
            codeScanner={codeScanner}
            enableZoomGesture={true}
            preview={true}
          />
        </View>

        <View style={screenStyles.scannerFrameContainer}>
          <ScannerFrame
            heightMultiplier={0.5}
            borderColor="white"
            animationStart={ScannedAnimation}
            setAnimation={setScannedAnimation}
          />
        </View>
      </KeyboardAvoidingView>

      <View style={screenStyles.inputContainer}>
        <View style={screenStyles.textInputWrapper}>
          {showClearButton && (
            <Animated.View style={[{ opacity: clearButtonOpacity }]}>
              <TouchableOpacity onPress={handleClearCode}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
            </Animated.View>
          )}
          <TextInput
            ref={inputRef}
            style={screenStyles.textInput}
            editable={!codes.saveBarcode}
            value={codes.barcode}
            onChangeText={(text) => {
              setCodes((prev) => ({ ...prev, barcode: text }));
              if (text !== "") {
                setShowClearButton(true);
                clearButtonOpacity.value = withTiming(1, { duration: 1000 });
              } else {
                clearButtonOpacity.value = withTiming(
                  0,
                  { duration: 300 },
                  () => setShowClearButton(false)
                );
              }
            }}
          />
        </View>

        {/* ✅ Confirm Button Added Back */}
        <TouchableOpacity
          style={screenStyles.confirmButton}
          onPress={handleConfirmCode}
        >
          <MaterialCommunityIcons name="checkbox-marked" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Reusable styles (renamed to screenStyles)
const screenStyles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: heightPercentageToDP(2),
    flexDirection: "column",
  },
  scannerContainer: {
    flex: 0.8,
    margin: 10,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 13,
    elevation: 4,
  },
  cameraContainer: {
    overflow: "hidden",
    borderRadius: 13,
    flex: 1,
  },
  overlay: {
    position: "absolute",
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  camera: {
    flex: 1,
    borderRadius: 13,
    width: "100%",
  },
  scannerFrameContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 0.2,
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 20,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "75%",
    height: 40,
    elevation: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
  },
  confirmButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "lightgreen",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: styles.lightGreen,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
};
