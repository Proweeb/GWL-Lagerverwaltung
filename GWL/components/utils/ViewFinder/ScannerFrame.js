import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { styles } from "../../styles";

export default function ScannerFrame({
  size = 250,
  borderColor = "#30A6DE",
  heightMultiplier = 1,
  containerstyle = {},
  animationStart = false,
  setAnimation = () => {},
}) {
  const height = size * heightMultiplier;
  const width = size;
  const cornerSize = size * 0.2;

  // Use Reanimated shared value for opacity
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (animationStart) {
      // Run animation with reanimated
      opacityValue.value = withSequence(
        withTiming(1, { duration: 300, easing: Easing.linear }),
        withTiming(0, { duration: 150, easing: Easing.linear })
      );

      // Reset animation flag after completion
      setTimeout(() => setAnimation(false), 300);
    }
  }, [animationStart]);

  // Create an animated style
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  return (
    <View style={[Framestyles.container, { width, height }, containerstyle]}>
      {/* Animated Inner Flash */}
      <Animated.View
        style={[
          {
            position: "absolute",
            flex: 1,
            width: width - 20,
            height: height - 20,
            backgroundColor: styles.lightGreen,
          },
          animatedStyle,
        ]}
      />

      {/* Scanner Frame Corners */}
      <View
        style={[
          Framestyles.corner,
          Framestyles.topLeft,
          { borderColor, width: cornerSize, height: cornerSize },
        ]}
      />
      <View
        style={[
          Framestyles.corner,
          Framestyles.topRight,
          { borderColor, width: cornerSize, height: cornerSize },
        ]}
      />
      <View
        style={[
          Framestyles.corner,
          Framestyles.bottomLeft,
          { borderColor, width: cornerSize, height: cornerSize },
        ]}
      />
      <View
        style={[
          Framestyles.corner,
          Framestyles.bottomRight,
          { borderColor, width: cornerSize, height: cornerSize },
        ]}
      />
    </View>
  );
}

const Framestyles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 5,
    borderRightWidth: 5,
  },
});
