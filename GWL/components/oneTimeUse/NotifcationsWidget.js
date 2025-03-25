import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { styles } from "../styles";
import ArtikelService from "../../database/datamapper/ArtikelHelper";

export default function NotificationsWidget() {
  const [expiredArticles, setExpiredArticles] = React.useState([]);

  React.useEffect(() => {
    const fetchExpiredArticles = async () => {
      const allArticles = await ArtikelService.getAllArtikel();
      const filteredArticles = allArticles.filter((article) =>
        ["Kritisch", "Abgelaufen", "Warnung"].includes(article.isExpired)
      );
      setExpiredArticles(filteredArticles);
    };

    fetchExpiredArticles();
  }, []);

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
    <View style={notificationstyle.container}>
      {expiredArticles.length === 0 ? (
        <Text style={notificationstyle.noNotifications}>
          Keine Benachrichtigungen
        </Text>
      ) : (
        <View style={{ width: "100%", height: "100%" }}>
          <FlashList
            data={expiredArticles}
            estimatedItemSize={120}
            showsVerticalScrollIndicator={true}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
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
    </View>
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
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    borderColor: styles.red,
    borderWidth: 1,
  },
  articleText: {
    fontSize: 18,
    flex: 1,
    textAlign: "center",

    color: styles.textColor,
  },
  statusText: {
    fontSize: 18,
    color: styles.darkRed,
    textAlign: "center",

    flex: 1,
  },
});
