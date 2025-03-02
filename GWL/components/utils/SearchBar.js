import React from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";

const SearchBar = ({ gwId, setGwId, onSearch }) => {
  const navigation = useNavigation();

  return (
    <View style={{ width: "95%", borderRadius: 20, padding: 20 }}>
      <Text style={styles.subHeader}>GWID</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <View style={{ flex: 1, height: 40 }}>
          <TextInput
            value={gwId}
            onChangeText={setGwId}
            onSubmitEditing={onSearch} // Triggers search when Enter/Done is pressed
            returnKeyType="search" // Sets keyboard button to "Search"
            style={{
              padding: 10,
              fontSize: 16,
              backgroundColor: styles.white,
              borderRadius: 10,
            }}
          />
        </View>

        {gwId !== "" && (
          <TouchableOpacity
            onPress={() => setGwId("")}
            style={{
              marginLeft: 10,
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: styles.white,
              justifyContent: "center",
              alignItems: "center",
              elevation: 3,
            }}
          >
            <MaterialCommunityIcons
              name={"arrow-u-left-bottom"}
              size={24}
              color={"black"}
            />
          </TouchableOpacity>
        )}

        {gwId === "" && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Scan", { onScan: (code) => setGwId(code) })
            }
            style={{
              marginLeft: 10,
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: styles.white,
              justifyContent: "center",
              alignItems: "center",
              elevation: 3,
            }}
          >
            <Text style={{ color: "black", fontSize: 20 }}>[III]</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onSearch}
          style={{
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: styles.white,
            justifyContent: "center",
            alignItems: "center",
            elevation: 3,
          }}
        >
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
