import React, { useReducer, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import Modal from "react-native-modal"; // We will be using to show the modal
import * as ImagePicker from "expo-image-picker"; // To choose photo from Gallery or Click form Camera.
import { Camera } from "expo-camera"; // Get Camera Permissions
import { useDispatch } from "react-redux";

import Colors from "../../Constants/Colors"; // Our Colors constants
import Input from "../../components/Input"; // The code for the input component wil be below this code snippet
import ImgPicker from "../../components/ImagePicker"; // The code for the Image component will be shown in the video below
import * as UserActions from "../../store/actions/AllUsers"; // Our all Redux User actions
import { storage } from "../../config/FirebaseConf"; //  Firebase conf file will be shown in the video

const formReducer = (state, action) => {
  // Check the Above File and Comment Explanation
  if (action.type === "FORM_INPUT_UPDATE") {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let FormisValid = true;
    for (const key in updateValidities) {
      FormisValid = FormisValid && updateValidities[key];
    }
    return {
      formIsValid: FormisValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

export default function AddDetails({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false); // Our modal state
  const [image, setImage] = useState(); // Our image state
  const [loading, setloading] = useState(false); // Loading state to show loading spinner whenever state is true
  const [error, seterror] = useState(); // Our error state
  const dispatch = useDispatch();

  const [formState, dispatchformState] = useReducer(formReducer, {
    // Check the Above File and Comment Explanation
    inputValues: {
      name: "",
      description: "",
      profileImageUrl: "",
    },
    inputValidities: {
      name: false,
      description: false,
      profileImageUrl: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    // Show a Toeast wherever there is a error
    if (error) {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  }, [error]);

  const OnpressBtn = () => {
    // Show modal handler
    setModalVisible(true);
  };

  const DispatchAction = async (name, image, description) => {
    // This will dispatch Our action
    try {
      await dispatch(UserActions.Create_User(name, image, description));
      navigation.navigate("WhatsAppMain");
    } catch (e) {
      setloading(false);
      seterror(e.message);
    }
  };

  const uploadImage = async (uri) => {
    // When Create My Account Button will be pressed this will run
    if (uri) {
      // If user Uploads a Image Upload Image to firebase
      const responce = await fetch(uri);
      const blob = await responce.blob();
      const upload = storage.ref().child(`UserProfile/${Date.now()}`).put(blob);
      upload.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          setloading(false);
          seterror("Oops There was a error");
        },
        async () => {
          await upload.snapshot.ref.getDownloadURL().then(async (url) => {
            // When we get the Image Link
            DispatchAction(
              // Dispatch our actio
              formState.inputValues.name,
              url,
              formState.inputValues.description
            );
          });
        }
      );
    } else {
      // If we dont upload Image then a dummy link
      DispatchAction(
        formState.inputValues.name,
        "https://image.flaticon.com/icons/png/512/17/17004.png",
        formState.inputValues.description
      );
    }
  };

  const GetCameraPermmissions = async () => {
    // Camera Permisions Func which will return true of false according to permission
    const result = await Camera.requestPermissionsAsync();
    if (result.status != "granted") {
      Alert.alert(
        "No Permissions!",
        "You need to grant camera permissions in Oder to Continue",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };

  const TakePhotoFromCamera = async () => {
    // Click Photo func
    const HasPermissions = await GetCameraPermmissions(); // execute above function and check if has permissions or not
    if (!HasPermissions) {
      // If no permissions, then just return
      return;
    }
    const Imageresult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!Imageresult.cancelled) {
      setImage(Imageresult.uri);
    }
    setModalVisible(false); // Modal shouldn't be visible now
  };

  const ChooseFromGallery = async () => {
    // choose from Gammery function
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // If we dont cancel picking then
      setImage(result.uri); // Set our Image state to the temporary uri
    }
    setModalVisible(false);
  };

  const dispatchUserHandler = async () => {
    setloading(true);
    seterror(null);
    uploadImage(image);
  };

  const inputChangeHandler = useCallback(
    // explained in the Auth.js snippet
    (inputIdentifier, inputvalue, inputisValid) => {
      dispatchformState({
        type: "FORM_INPUT_UPDATE",
        value: inputvalue,
        isValid: inputisValid,
        input: inputIdentifier,
      });
    },
    [dispatchformState]
  );

  return (
    <KeyboardAvoidingView behavior="position">
      <ScrollView style={styles.container}>
        <Text style={styles.Headtext}>Enter Your Details </Text>
        <Text style={styles.text}>
          Please fill the following information.{" "}
          <Text
            style={{
              fontFamily: "open-sans-bold",
            }}
          >
            This will be visible in your profile and to other users too
          </Text>
        </Text>
        <Input // Remember it passes the props to the real Input component provided by react
          id="name" // Id which will be used to recogonise field
          keyboardType="default" // default keyboard type
          autoCapitalize="sentences"
          returnKeyType="next" // Show next in keyboard
          label="Your Name" // Label for our input
          onInputChange={inputChangeHandler} // When text in input changes
          initialValue={""} // InitialVallue is ""
          initiallyValid={false} // Shouldn't be initially valid
          required // It is a required field
          minLength={3} // Min Length of field is 3
        />
        <Input
          id="description"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          label="About YourSelf"
          onInputChange={inputChangeHandler}
          multiline
          numberOfLines={3}
          initialValue={""}
          initiallyValid={false}
          required
          minLength={10}
        />
        <ImgPicker OnpressBtn={OnpressBtn} image={image} />
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            title={"Create My Account"}
            color={Colors.accent}
            style={{ marginTop: 10 }}
            onPress={dispatchUserHandler}
          />
        )}
      </ScrollView>
      <Modal // Modal code
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        swipeDirection="down"
        avoidKeyboard={true}
        isVisible={isModalVisible}
        style={styles.modal}
        animationInTiming={600}
      >
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.Headtext}>Upload Photo</Text>
            <Text style={styles.text}>Select Pic for your profile picture</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.ModalButton}
              onPress={TakePhotoFromCamera}
            >
              <Text style={styles.ModalButtonText}>Click Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ModalButton}
              onPress={ChooseFromGallery}
            >
              <Text style={styles.ModalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ModalButton}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.ModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  Headtext: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "open-sans-bold",
    color: Colors.primary,
  },
  container: {
    margin: 15,
  },
  text: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 10,
    fontFamily: "open-sans",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  ModalButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: "center",
    marginVertical: 5,
  },
  ModalButtonText: {
    fontSize: 17,
    fontFamily: "open-sans-bold",
    color: "white",
  },
});
