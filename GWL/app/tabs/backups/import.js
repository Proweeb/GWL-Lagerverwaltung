import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { Component, useState } from "react";
import RegalService from "../../../database/datamapper/RegalHelper";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import { column } from "@nozbe/watermelondb/QueryDescription";
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

const ImportScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Liste Importieren</Text>
            <View style={styles.card}>
                <View style={styles.fileBox}>
                    <Text style={styles.fileText}>FileName.csv</Text>
                </View>
                <TouchableOpacity style={styles.buttonWhite}>
                    <Text style={styles.buttonText}>Hochladen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonBlue}>
                    <Text style={styles.buttonTextLightBlue}>Importieren</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};



export default ImportScreen;
