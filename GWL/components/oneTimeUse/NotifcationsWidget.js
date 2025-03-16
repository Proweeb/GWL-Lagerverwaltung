import { View, Text } from "react-native";

export default function NotificationsWidget() {
  return (
<<<<<<< Updated upstream
    <View
      style={{ backgroundColor: "red", width: "100%", height: "100%" }}
    ></View>
  );
}
=======
    <View style={notificationstyle.container}>
      {expiredArticles.length === 0 ? (
        <Text style={notificationstyle.noNotifications}>
          Keine Benachrichtigungen
        </Text>
      ) : (
        <View
          style={{
            flex: 1,
            width: "100%",
            //elevation: 5,
            //backgroundColor: styles.backgroundColor,
            borderRadius: 10,
          }}
        >
          <FlashList
            data={expiredArticles}
            estimatedItemSize={120}
            // showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{}}></View>}
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
                  {item.ablaufdatum.toLocaleString("de-DE", {
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
    marginVertical: 10,
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
>>>>>>> Stashed changes
