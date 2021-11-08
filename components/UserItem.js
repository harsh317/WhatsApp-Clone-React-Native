import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"; // styling not right

const UserItem = ({ name, description, image, userId, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.UserItem}
      onPress={() => {
        navigation.navigate("Messages", {
          userId: userId,
          name: name,
          image: image,
        });
      }}
    >
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: image,
          }}
        />
        <View style={styles.detailscontainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.lastmsg}>This was the Last Message</Text>
        </View>
      </View>
      <Text style={styles.msgsent}>10:50 pm</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  UserItem: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 200,
  },
  container: {
    marginVertical: 10,
    flexDirection: "row",
  },
  detailscontainer: {
    flexDirection: "column",
    marginHorizontal: 10,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 15,
  },
  lastmsg: {
    color: "#808080",
    fontSize: 13,
  },
  msgsent: {
    color: "#808080",
    fontSize: 10,
    marginBottom: 10,
  },
});

export default UserItem;
