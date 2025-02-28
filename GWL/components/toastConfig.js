import { BaseToast } from "react-native-toast-message";
import { styles } from "./styles";
import { RFPercentage } from "react-native-responsive-fontsize";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: styles.green }}
      contentContainerStyle={{ backgroundColor: "white" }}
      text2Style={{
        fontSize: RFPercentage(1.5),
      }}
      text1Style={{
        fontSize: RFPercentage(2.5),
        fontWeight: "400",
      }}
    />
  ),
};
