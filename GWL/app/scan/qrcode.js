import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
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
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
 
export default function BarcodeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  const [startanimation, setAnimation] = useState(false);
  const [codes, setCodes] = useState({
    saveQrCode: false,
    qrCode: "",
  });
  const scannedCodes = useRef(new Set());
  const [sound, setSound] = useState(null);

  const onScan = route.params?.onScan;

  // useEffect(() => {
  //   if (codes.saveQrCode) {
  //     onScan(codes.qrCode);
  //     navigation.goBack();
  //   }
  // }, [codes]);

  useEffect(() => {
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => {});
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    // Set up audio mode and load sound
    const setUpAudio = async () => {
      try {
        // Set audio mode to play even in silent mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Load the sound
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/scanned.mp3"),
          { shouldPlay: false }
        );
        setSound(sound);
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    };

    setUpAudio();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      // Clean up sound
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (sound) {
        // Reset position and play
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCodeScanned = async (codeValue) => {
    if (!scannedCodes.current.has(codeValue)) {
      scannedCodes.current.add(codeValue);
      setAnimation(true);
      await playSound();
      onScan(codeValue);
      const currentRoute = navigation.getState().routes[navigation.getState().index].name;
      if (currentRoute === 'Scan\\Qrcode') {
        navigation.goBack();
        scannedCodes.current.clear();
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (!isKeyboardVisible && !showClearButton && !isProcessing) {
        setIsProcessing(true);
        for (const code of codes) {
          handleCodeScanned(code.value);
        }
        setIsProcessing(false);
      }
    },
  });

  const handleClearCode = () => {
    setCodes({ saveQrCode: false, qrCode: "" });
    setShowClearButton(false);
  };

  const handleConfirmCode = () => {
    if (!codes.saveQrCode) {
      setCodes((prev) => ({ ...prev, saveQrCode: true }));
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
          <Camera
            style={screenStyles.camera}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            enableZoomGesture={true}
            preview={true}
          />
        </View>
        <View style={screenStyles.scannerFrameContainer}>
          <ScannerFrame
            heightMultiplier={isKeyboardVisible ? 0.5 : 1}
            borderColor="white"
            animationStart={startanimation}
            setAnimation={setAnimation}
          />
        </View>
      </KeyboardAvoidingView>

      {/* <View style={screenStyles.inputContainer}>
        <View style={screenStyles.textInputWrapper}>
          {showClearButton && (
            <TouchableOpacity onPress={handleClearCode}>
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="red"
              />
            </TouchableOpacity>
          )}
          <TextInput
            ref={inputRef}
            style={screenStyles.textInput}
            editable={!codes.saveQrCode}
            value={codes.qrCode}
            onChangeText={(text) => {
              setCodes((prev) => ({ ...prev, qrCode: text }));
              setShowClearButton(text !== "");
            }}
          />
        </View>

        <TouchableOpacity
          style={screenStyles.confirmButton}
          onPress={handleConfirmCode}
        >
          <MaterialCommunityIcons name="checkbox-marked" size={20} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const screenStyles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: heightPercentageToDP(2),
    flexDirection: "column",
  },
  scannerContainer: {
    flex: 1,
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
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
};
