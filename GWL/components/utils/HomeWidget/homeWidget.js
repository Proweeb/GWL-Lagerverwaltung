import { View, Text } from "react-native";
import { styles } from "../../styles";

export default function HomeWidget({
  title,
  flexValue,
  containerFlex,
  children,
  containerStyle,
}) {
  return (
    <View
      style={{
        flex: containerFlex,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={[
          styles.subHeader,
          { alignSelf: "flex-start", paddingVertical: 10 },
        ]}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: styles.white,
          width: "100%",
          flex: flexValue,
          borderRadius: 20,
          elevation: 8,
        }}
      >
        <View style={[{ padding: 20 }, containerStyle]}>{children}</View>
      </View>
    </View>
  );
}
