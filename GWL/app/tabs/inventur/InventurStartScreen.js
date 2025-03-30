import { View, Modal } from "react-native";
import React, { useState } from "react";
import InventurButton from "../../../components/oneTimeUse/InventurButton";
import { styles } from "../../../components/styles";
import { useNavigation } from "@react-navigation/native";
import LogService from "../../../database/datamapper/LogHelper";
import ConfirmPopup from "../../../components/Modals/ConfirmPopUp";

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
        onPress={async () => {
          await LogService.createLog(
            {
              beschreibung: "Inventur gestartet",
            },
            null,
            null
          );
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
          colorCallback={() => {
            navigation.navigate("Tabs", {
              screen: "Inventur",
              params: { screen: "inventurscreen" },
            });
            setModalVisible(false);
          }}
          greyCallback={() => setModalVisible(false)}
          text={"Sind Sie sicher, dass Sie die Inventur starten möchten?"}
        ></ConfirmPopup>
      </Modal>
    </View>
  );
};
export default InventurStartScreen;
