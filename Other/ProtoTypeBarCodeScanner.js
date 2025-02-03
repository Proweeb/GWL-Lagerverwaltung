import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";

export default function App() {
  const camera = useRef(null); // Fix: Proper useRef initialization
  const [switched, setSwitch] = useState("back");
  const device = useCameraDevice(switched); // Removed unnecessary options
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission]);

  // Barcode scanner
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-8", "ean-13"],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        //rconsole.log("Scanned Code:", code.value);
        Alert.alert("Scanned Code", code.value); // Optional: Show alert
      }
    },
  });
  async function picpic() {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({ flash: "off" });
        console.log("Photo Taken:", photo);
        console.log("Temporary photo URI:", photo.path);

        await MailComposer.composeAsync({
          recipients: ["example@example.com"], // Change to recipient email
          subject: "Subject of the email",
          body: "This is the email body.",
          attachments: [photo.path], // Attach the selected file
        });
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    } else {
      console.warn("Camera not ready");
    }
  }

  // Function to take a photo
  async function switchCamera() {
    if (switched === "back") {
      setSwitch("front");
    } else {
      setSwitch("back");
    }
  }

  // If permission is not granted, show a message
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  // Check if device is available
  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      {/* Camera Preview */}
      <View style={{ flex: 1, backgroundColor: "blue", zIndex: -1 }}>
        <Camera
          ref={camera} // Fix: Attach ref to the Camera component
          style={{ flex: 1 }}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
          photo={true}
        />
      </View>

      {/* Capture Button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity onPress={picpic} style={styles.captureButton}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={switchCamera}
          style={{
            marginLeft: 10,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "green",
            marginBottom: 20,
          }}
        ></TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  captureContainer: {
    flex: 1,
    position: "absolute", // Make it overlay
    backgroundColor: "rgba(0, 0, 255, 0.05)",
    zIndex: 2, // Ensure it stays on top
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  captureButton: {
    width: 100,
    height: 100,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    opacity: 0.9,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
