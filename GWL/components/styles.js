import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
export const styles = {
  //Background Colors
  backgroundColor: "#FFFFFF",
  white: "#F8F8FF",
  //Text Colors
  greyedText: "#AFAFAF",
  textColor: "#292D32",
  boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",

  //Textstyle
  textInputBackgroundColor: "D9D9D9",
  header: {
    fontSize: RFPercentage(3.7),
    fontFamily: "inter",
    fontWeight: "700",
    textAlign: "left",
    color: "#292D32",
  },

  subHeader: {
    fontSize: RFPercentage(2),
    fontFamily: "inter",
    fontWeight: "700",
    textAlign: "left",
    color: "#292D32",
  },

  text: {
    fontSize: RFPercentage(1.7),
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    
  },
  title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
      marginBottom: 20,
  },
  card: {
      backgroundColor: "#f8f8ff",
      padding: 20,
      borderRadius: 15,
      width: "90%",
      alignItems: "center",
  },
  fileBox: {
      backgroundColor: "#d9d9d9",
      padding: 10,
      borderRadius: 10,
      marginBottom: 15,
      width: "100%",
      alignItems: "center",
  },
  fileText: {
      color: "#202020",
  },
  buttonWhite: {
      backgroundColor: "#ffffff",
      padding: 10,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      marginBottom: 10,
  },
  buttonBlue: {
      backgroundColor: "#70BBDF33",
      padding: 10,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      marginBottom: 10,
  },
  buttonText: {
      color: "#202020",
      fontWeight: "bold",
  },
  buttonTextLightBlue: {
    color: "#30A6DE",
    fontWeight: "bold",
},
  //Accent Colors
  //light
  lightLightBlue: "#70BBDF33",
  lightBlue: "#70BBDF",
  lightGreen: "#CDEDD8",
  lightYellow: "#FFE9C7",
  lightRed: "#FFDADB",
  //normal
  green: "#4CA868",
  red: "#E89091",
  yellow: "#EFBD76",
  blue: "#30A6DE",

  //dark
  darkRed: "#FF0202",
};
