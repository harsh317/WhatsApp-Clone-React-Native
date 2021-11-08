import React from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import Colors from "../Constants/Colors";

const ImgPicker = ({ image, OnpressBtn }) => {
  return (
    <View style={styles.imagePicker}>
      <TouchableOpacity
        onPress={() => {
          OnpressBtn();
        }}
        style={styles.Preview}
      >
        {!image ? (
          <View>
            <Text style={styles.text}>No Image Picked Yet...Pick an Image</Text>
            <Button
              title="Pick Image"
              color={Colors.primary}
              onPress={OnpressBtn}
            />
          </View>
        ) : (
          <ImageBackground
            imageStyle={{ opacity: 0.5 }}
            source={{ uri: image }}
            style={styles.image}
          >
            <Text>Click To Change Image</Text>
          </ImageBackground>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  Preview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  text: {
    fontFamily: "open-sans",
    margin: 10,
  },
});

export default ImgPicker;
