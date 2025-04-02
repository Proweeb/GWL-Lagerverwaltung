import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel"; // Carousel import
import { styles } from "../styles";
import ArtikelService from "../../database/datamapper/ArtikelHelper";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { useIsFocused } from "@react-navigation/native";

export default function NotificationsWidget() {
  const [expiredArticles, setExpiredArticles] = React.useState([]);
  const IsFocused = useIsFocused();
  React.useEffect(() => {
    const fetchExpiredArticles = async () => {
      const allArticles = await ArtikelService.getAllArtikel();
      const filteredArticles = allArticles.filter((article) =>
        ["Kritisch", "Abgelaufen", "Warnung"].includes(article.isExpired)
      );
      setExpiredArticles(filteredArticles);
    };

    fetchExpiredArticles();
  }, [IsFocused]);

  // Function to determine background color based on the status
  const getBackgroundColor = (status) => {
    const colors = {
      Warnung: styles.lightYellow,
      Abgelaufen: "black",
      Kritisch: styles.lightRed,
    };
    const borderColors = {
      Warnung: "orange",
      Abgelaufen: "violet",
      Kritisch: styles.red,
    };
    return {
      backgroundColor: colors[status],
      borderColor: borderColors[status],
    };
  };

  const getTextColor = (status) => {
    const colors = {
      Warnung: "orange",
      Abgelaufen: "violet",
      Kritisch: styles.darkRed,
    };
    return { color: colors[status] };
  };

  const getArticleTextColor = (status) => {
    const colors = {
      Warnung: styles.textColor,
      Abgelaufen: "white",
      Kritisch: styles.textColor,
    };
    return { color: colors[status] };
  };

  return (
    <SafeAreaView style={notificationstyle.container}>
      {expiredArticles.length === 0 ? (
        <Text style={notificationstyle.noNotifications}>
          Keine Benachrichtigungen
        </Text>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Carousel
            loop
            autoPlay
            width={widthPercentageToDP(80)} // Dynamic width for the carousel
            //height={widthPercentageToDP(80) * 0.25}
            data={expiredArticles}
            scrollAnimationDuration={1000}
            //onSnapToItem={(index) => console.log("Active Index: ", index)} // Optional: Log active index
            renderItem={({ item, index }) => (
              <View
                style={[
                  notificationstyle.notificationItem,
                  getBackgroundColor(item.isExpired),
                ]}
              >
                <Text
                  style={[
                    notificationstyle.articleText,
                    getArticleTextColor(item.isExpired),
                  ]}
                >
                  {item.beschreibung}
                </Text>
                <Text
                  style={[
                    notificationstyle.statusText,
                    getTextColor(item.isExpired),
                  ]}
                >
                  {new Date(item.ablaufdatum).toLocaleString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const notificationstyle = StyleSheet.create({
  container: {
    backgroundColor: styles.white,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    height: "100%",
    borderRadius: 10,
    paddingTop: 5,
  },
  noNotifications: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
  },
  notificationItem: {
    padding: 2,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "column", // Use column layout for the carousel
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 10, // Margin for spacing between carousel items
  },
  articleText: {
    fontSize: 18,
    textAlign: "center",
    color: styles.textColor,
  },
  statusText: {
    fontSize: 18,
    color: styles.darkRed,
    textAlign: "center",
  },
});
