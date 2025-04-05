import { Text, View } from "react-native";
import { styles } from "../../../components/styles";
import TextInputField from "../../../components/utils/TextInputs/textInputField";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { ToastMessages } from "../../../components/enum";
export default function Storagemenu({
  formData,
  setFormData,
  regalIdValid,
  setRegalIdValid,
}) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "column",
        margin: 10,
      }}
    >
      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        RegalID*
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInputField
            value={formData.regalId}
            onChangeText={(text) => {
              const regex = /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

              // Überprüfen, ob das Format gültig ist
              if (regex.test(text)) {
                setRegalIdValid(true); // Gültig
              } else {
                setRegalIdValid(false); // Ungültig
                Toast.show({
                  type: "warning",
                  text1: ToastMessages.WARNING,
                  text2: ToastMessages.REGALFORMAT_FALSCH,
                  position: "bottom",
                });
              }

              setFormData((prevData) => ({ ...prevData, regalId: text })); // Text setzen
              const split = text.split(".");
              setFormData((prevData) => ({
                ...prevData,
                regalname: split[0],
                fachname: split[1],
              }));
            }}
            textColor={regalIdValid ? "black" : "red"} // Textfarbe ändern, wenn ungültig
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Scan\\Barcode", {
              onScan: (code) => {
                setFormData((prevData) => ({ ...prevData, regalId: code }));
                const split = code.split(".");
                setFormData((prevData) => ({
                  ...prevData,
                  regalname: split[0],
                  fachname: split[1],
                }));
              },
            });
          }}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: styles.white,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons
            name={"barcode-scan"}
            size={25}
            color={"black"}
          />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: RFPercentage(1.8) }}>Regal Name*</Text>
      <TextInputField
        value={formData.regalname}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, regalname: text }))
        }
      />

      <Text style={{ fontSize: RFPercentage(1.8), marginTop: 8 }}>
        Fach Name*
      </Text>
      <TextInputField
        value={formData.fachname}
        onChangeText={(text) =>
          setFormData((prevData) => ({ ...prevData, fachname: text }))
        }
      />
    </View>
  );
}
