import React from "react";
import { BaseToast } from "react-native-toast-message";
import { View, Text } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { styles } from "./styles";

const defaultToastProps = {
  position: 'bottom',
  bottomOffset: 20,
};

export const toastConfig = {
  success: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      {...defaultToastProps}
      style={{ borderLeftColor: "#4CAF50", backgroundColor: "#E9F7EF" }}
      contentContainerStyle={{ backgroundColor: "#E9F7EF" }}
      text1Style={{
        fontSize: RFPercentage(1.7),
        fontWeight: "500",
        color: "#2E7D32",
      }}
      text2Style={{ fontSize: RFPercentage(1.5), color: "#388E3C" }}
      text1={text1}
      text2={text2}
    />
  ),
  warning: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      {...defaultToastProps}
      style={{ borderLeftColor: "#FFC107", backgroundColor: "#FFF8E1" }}
      contentContainerStyle={{ backgroundColor: "#FFF8E1" }}
      text1Style={{
        fontSize: RFPercentage(1.7),
        fontWeight: "500",
        color: "#FF8F00",
      }}
      text2Style={{ fontSize: RFPercentage(1.5), color: "#FFA000" }}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      {...defaultToastProps}
      style={{ borderLeftColor: "#F44336", backgroundColor: "#FFEBEE" }}
      contentContainerStyle={{ backgroundColor: "#FFEBEE" }}
      text1Style={{
        fontSize: RFPercentage(1.7),
        fontWeight: "500",
        color: "#D32F2F",
      }}
      text2Style={{ fontSize: RFPercentage(1.5), color: "#C62828" }}
      text1={text1}
      text2={text2}
    />
  ),
  default: ({ text1, text2, props }) => (
    <BaseToast
      {...props}
      {...defaultToastProps}
      style={{
        borderLeftColor: styles.lightBlue,
        backgroundColor: "#F5F5F5",
      }}
      contentContainerStyle={{ backgroundColor: "#F5F5F5" }}
      text1Style={{
        fontSize: RFPercentage(1.7),
        fontWeight: "500",
      }}
      text2Style={{ fontSize: RFPercentage(1.5) }}
      text1={text1}
      text2={text2}
    />
  ),
};
