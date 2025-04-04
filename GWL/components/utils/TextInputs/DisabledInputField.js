import { Text, View } from "react-native";
import { styles } from "../../styles";
import { TextInput } from "react-native-gesture-handler";

export default function DisabledInputField({ textColor, ...props }) {
  return (
    <View
      style={{
        marginTop: 5,
        height: 40,
        elevation: 2,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#e0e0e0',
        opacity: 0.8,
        borderColor: '#999999',
        borderWidth: 1,
      }}
    >
      <TextInput
        style={[
          {
            width: "100%",
            textAlign: "left",
            paddingHorizontal: 5,
            color: textColor || "#444444",
          },
          styles.text,
        ]}
        editable={false}
        selectTextOnFocus={false}
        {...props}
      />
    </View>
  );
}
