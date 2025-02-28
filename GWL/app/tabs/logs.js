import { Text, View } from "react-native";
import { styles } from "../../components/styles";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import LogsWidget from "../../components/utils/LogsWidget";
export default function LogsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const germanMonths = [
    { label: "Januar", value: 1 },
    { label: "Februar", value: 2 },
    { label: "März", value: 3 },
    { label: "April", value: 4 },
    { label: "Mai", value: 5 },
    { label: "Juni", value: 6 },
    { label: "Juli", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "Oktober", value: 10 },
    { label: "November", value: 11 },
    { label: "Dezember", value: 12 },
  ];

  return (
    <View
      style={{ flex: 1, padding: 10, backgroundColor: styles.backgroundColor }}
    >
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(value) => setSelectedMonth(value)}
      >
        {germanMonths.map((month) => (
          <Picker.Item
            key={month.value}
            label={month.label}
            value={month.value}
          />
        ))}
      </Picker>

      <LogsWidget selectedMonth={selectedMonth} />
    </View>
  );
}
