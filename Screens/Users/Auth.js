import React, { useReducer, useState, useCallback, useEffect } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  ToastAndroid, // a small message displayed on the screen, similar to a tool tip or other similar popup notification --Google
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  ActivityIndicator, // For showing a loading spinner
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../../Constants/Colors"; // Import our Colors constant
import Input from "../../components/Input"; // *Code for the Input component is below*
import * as AuthActions from "../../store/actions/Auth"; // Our all redux authentication actions

const formReducer = (state, action) => {
  // It's just just like a redux reducer but not not connected to redux at all
  if (action.type === "FORM_INPUT_UPDATE") {
    // when we change any input
    const updatedValues = {
      // Change our inputValues state
      ...state.inputValues, // Return all other inputs values
      [action.input]: action.value, // But change the value of that specific input
    };
    const updateValidities = {
      // Change our inputValidities state
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let FormisValid = false; // Initiallt its false
    for (const key in updateValidities) {
      //  If all inputs are valid then change it to true
      FormisValid = FormisValid && updateValidities[key];
    }
    return {
      formIsValid: FormisValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state; // return our state
};

const Auth = ({ navigation }) => {
  const [SignUp, setSignUp] = useState(false); // Signup State used to change to login and signup
  const [loading, setloading] = useState(false); // Loading state
  const [error, seterror] = useState(); // error state
  const dispatch = useDispatch();

  const TouchableButton =
    Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

  const [formState, dispatchformState] = useReducer(formReducer, {
    // Our useReducer describing all our states
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    // If any error show
    if (error) {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  }, [error]);

  const AuthHandler = async () => {
    // Executed when pressed Sign Up or Login
    let action;
    if (SignUp) {
      // if signUp
      action = AuthActions.SignUp(
        // set our action var to our redux Signup Func
        formState.inputValues.email, // pass the email and
        formState.inputValues.password // password
      );
    } else {
      action = AuthActions.Login(
        // set our action var to our redux Login Func
        formState.inputValues.email, // pass the email and
        formState.inputValues.password // password
      );
    }
    seterror(null); // set any error to null
    setloading(true); // show the loading spinner
    try {
      await dispatch(action); // dispatch our redux action
      if (SignUp) {
        navigation.navigate("AddDetails"); // If Signup was pressed navigate to AddDetails Screen
      } else {
        navigation.navigate("WhatsAppMain"); // Else Main screen
      }
    } catch (e) {
      seterror(e.message);
      setloading(false);
    }
  };

  const inputChangeHandler = useCallback(
    // Our inputChangeHandler func
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
        <Text style={styles.Headtext}>Welcome to WhatsApp</Text>
        <Image
          source={require("../../assets/logo1.png")} // In the assets folder, put a whatsapp image which u can download below
          style={styles.image}
        />
        <Text style={styles.text}>
          Welcome To{" "}
          <Text style={{ fontFamily: "open-sans-bold" }}>WhatsApp Clone </Text>
          Please Sign Up Or Login Below to continue
        </Text>
        <Input // Our Input Component. *Remember some params it takes here is forwarded to the real Input component*
          id="email" // field Id
          label="Email" // Label for our Input
          initialValue="" // Initial Value for our input. i.e ""
          keyboardType="email-address" // Set keyboard type
          required // It is a required field
          email // Our custom email validation
          onInputChange={inputChangeHandler} // Do this when text inout value changes
          initiallyValid={false} // It shouldn't be initially valid
        />
        <Input //
          id="password" // field Id
          label="Password" // Label for our Input
          initialValue="" // Initial Value for our input. i.e ""
          keyboardType="default" // Set keyboard type
          secureTextEntry // Show **** as it is a password field
          minLength={5} // A minimum length of 5 or else error
          required // It is a required field
          onInputChange={inputChangeHandler} // // Do this when text inout value changes
          initiallyValid={false} // It shouldn't be initially valid
        />
        <View style={styles.submit}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Button
              title={SignUp ? "SignUp" : "Login"}
              color={Colors.primary}
              style={{ marginTop: 10 }}
              onPress={AuthHandler}
            />
          )}

          <TouchableButton
            onPress={() => {
              setSignUp(!SignUp);
            }}
          >
            <Text style={styles.text}>
              {SignUp
                ? "Already Have an Account? Login"
                : "Don't Have an Account? Sign Up"}
            </Text>
          </TouchableButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

Auth.navigationOptions = () => {
  // Set A Header Title
  return {
    headerTitle: "Authenticate To WhatsApp",
  };
};

const styles = StyleSheet.create({
  // All the Styles
  Headtext: {
    textAlign: "center",
    fontSize: 25,
    fontFamily: "open-sans-bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  container: {
    margin: 10,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.primary,
    marginTop: 10,
    fontFamily: "open-sans",
  },
  submit: {
    marginHorizontal: 10,
    marginTop: 15,
  },
});

export default Auth;
