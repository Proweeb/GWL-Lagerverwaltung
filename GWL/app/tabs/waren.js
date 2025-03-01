import { Button, Text, View, TouchableOpacity, TextInput } from "react-native";
import { styles } from "../../components/styles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function WarenScreen() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const navigation = useNavigation();

  const showDatePicker = (currentDate, setDate) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setDate(selectedDate);
        }
      },
      mode: "date",
      display: "calendar",
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: styles.backgroundColor,
      }}
    >
      <TouchableOpacity onPress={() => showDatePicker(fromDate, setFromDate)}>
        <TextInput
          style={{
            marginTop: 10,
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            textAlign: "center",
            backgroundColor: "white",
          }}
          value={fromDate.toDateString()}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => showDatePicker(toDate, setToDate)}>
        <TextInput
          style={{
            marginTop: 10,
            height: 40,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            textAlign: "center",
            backgroundColor: "white",
          }}
          value={toDate.toDateString()}
          editable={false}
        />
      </TouchableOpacity>

      <Button title="Waren" />
    </View>
  );
}
