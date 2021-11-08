// This is the Screen that the App will open first before any screen (evem Auth)
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as AuthActions from "../store/actions/Auth";
import Colors from "../Constants/Colors";

const StartUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const TryAuth = async () => {
      const userData = await AsyncStorage.getItem("UserData");

      if (!userData) {
        navigation.navigate("Auth");
        return;
      }

      const transformedAsyncData = JSON.parse(userData);
      const { token, userId, ExpireDate } = transformedAsyncData;
      const ExpirationDate = new Date(ExpireDate);

      if (ExpirationDate <= new Date() || !token || !userId) {
        navigation.navigate("Auth");
        return;
      }

      const expirationTime = ExpirationDate.getTime() - new Date().getTime();

      navigation.navigate("WhatsAppMain");
      dispatch(AuthActions.authenticate(token, userId, expirationTime));
    };
    TryAuth();
  }, [dispatch]);

  return (
    <View style={styles.window}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  window: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartUpScreen;
