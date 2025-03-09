import { Text, View } from "react-native";
import { styles } from "../../styles";
import { TextInput } from "react-native-gesture-handler";

export default function TextInputField(props) {
  return (
    <View
      style={{
        marginTop: 5,
        height: 40,
        elevation: 2,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: styles.white,
      }}
    >
      <TextInput
        style={[
          {
            width: "100%",
            textAlign: "left",
            paddingHorizontal: 5,
            color: "black",
          },
          styles.text,
        ]}
        {...props}
      />
    </View>
  );
}
