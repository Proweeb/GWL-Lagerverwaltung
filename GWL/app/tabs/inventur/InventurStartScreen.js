import { View, Modal } from "react-native";
import React, { useState } from "react";
import InventurButton from "../../../components/oneTimeUse/InventurButton";
import { styles } from "../../../components/styles";
import { useNavigation } from "@react-navigation/native";
import LogService from "../../../database/datamapper/LogHelper";
import ConfirmPopup from "../../../components/Modals/ConfirmPopUp";
import Toast from "react-native-toast-message";
import { logTypes } from "../../../components/enum";

const InventurStartScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        flex: 1,
        alignItems: "center",
      }}
    >
      <InventurButton
        onPress={() => {
          setModalVisible(true);
        }}
      ></InventurButton>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ConfirmPopup
          colorCallback={async () => {
            try {
              navigation.navigate("Tabs", {
                screen: "Inventur",
                params: { screen: "inventurscreen" },
              });
              await LogService.createLog(
                {
                  beschreibung: logTypes.StartInventur,
                },
                null,
                null
              );
              Toast.show({
                type: "success",
                text1: "Inventur",
                text2: "Inventur gestartet.",
                position: "bottom",
              });
              setModalVisible(false);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Inventur",
                text2: "Inventur konnte nicht gestartet werden." + error,
                position: "bottom",
              });
            }
          }}
          greyCallback={() => {
            Toast.show({
              type: "warning",
              text1: "Inventur",
              text2: "Inventur wurde abgebrochen.",
              position: "bottom",
            });
            setModalVisible(false);
          }}
          text={"Sind Sie sicher, dass Sie die Inventur starten möchten?"}
        ></ConfirmPopup>
      </Modal>
    </View>
  );
};
export default InventurStartScreen;
