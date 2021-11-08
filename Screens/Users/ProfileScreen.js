import React from "react";
import { View, Text, StyleSheet, ImageBackground, Button } from "react-native";
import { useSelector } from "react-redux";
import { Logout } from "../../store/actions/Auth";

const Profile = ({ navigation }) => {
  const UserId = useSelector((state) => state.auth.userId);
  const CurrentUser = useSelector((state) =>
    state.users.users.find((user) => user.userId == UserId)
  );
  return (
    <View>
      <ImageBackground
        style={styles.image}
        imageStyle={{ opacity: 0.5 }}
        source={{ uri: CurrentUser.profileImageUrl }}
      >
        <Text style={styles.text}>{CurrentUser.name}</Text>
      </ImageBackground>
      <Text
        style={{
          textAlign: "center",
          margin: 15,
          fontSize: 15,
          fontFamily: "open-sans",
        }}
      >
        {CurrentUser.description}
      </Text>
      <View style={styles.btnStyle}>
        <Button
          title="Logout"
          color="red"
          onPress={() => {
            Logout();
            navigation.navigate("Auth");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    fontFamily: "open-sans-bold",
    color: "white",
  },
  btnStyle: {
    marginTop: 10,
    paddingHorizontal: 30,
  },
});

export default Profile;
