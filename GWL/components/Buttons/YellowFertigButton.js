import { TouchableOpacity, Text, View } from "react-native";
import { styles } from "../styles";

const YellowFertigButton = ({ onPress, disabled }) => {
  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={{
          backgroundColor: styles.lightYellow,
          padding: 10,
          borderRadius: 5,
          height: 50,
          width: 100,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ color: "orange", fontSize: 20 }}>Ändern</Text>
      </TouchableOpacity>
    </View>
  );
};

export default YellowFertigButton;
