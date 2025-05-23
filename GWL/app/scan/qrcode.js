import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { request, PERMISSIONS } from "react-native-permissions";
import ScannerFrame from "../../components/utils/ViewFinder/ScannerFrame";
import { Audio } from "expo-av";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function QrcodeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [startanimation, setAnimation] = useState(false);
  const scannedCodes = useRef(new Set());
  const [sound, setSound] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [torch, setTorch] = useState(false);

  const onScan = route.params?.onScan;

  useEffect(() => {
    request(PERMISSIONS.ANDROID.CAMERA).then((status) => {});

    // Set up audio mode and load sound
    const setUpAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

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
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

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
      if (!isProcessing) {
        setIsProcessing(true);
        for (const code of codes) {
          handleCodeScanned(code.value);
        }
        setIsProcessing(false);
      }
    },
  });

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
            torch={torch ? "on" : "off"}
            style={screenStyles.camera}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            enableZoomGesture={true}
            preview={true}
          />
        </View>
        <View style={screenStyles.scannerFrameContainer}>
          <TouchableOpacity
            style={screenStyles.torchButton}
            onPress={() => setTorch(!torch)}
          >
            <MaterialCommunityIcons
              name={torch ? "flashlight-off" : "flashlight"}
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <ScannerFrame
            heightMultiplier={1}
            borderColor="white"
            animationStart={startanimation}
            setAnimation={setAnimation}
          />
        </View>
      </KeyboardAvoidingView>
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
  torchButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
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
    right: 0,
    top: 0,
  },
  centeredView: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
};
