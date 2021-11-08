import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  // Our Input reducer
  switch (action.type) {
    case INPUT_CHANGE: // When Input Value Changes
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR: // When Input is not in Focus (we move to the next input)
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "", // The initial Value that we passed
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id } = props; // Destructore out our id and OnInputChange so that the we dont pass props in useEffect

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    // Do all the validation work
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // Email formatt is correct or not
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      // If input is required but the input value is null
      isValid = false; // then error
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      // If its a email input but email is invalid
      isValid = false; // then error
    }
    if (props.max != null && +text > props.max) {
      // In input value is greater than the maximum value we specified
      isValid = false; // then error
    }
    if (props.minLength != null && text.length < props.minLength) {
      // In input value is less than the minimum value we specified
      isValid = false; // then error
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    // When Input losts its focus or becomes blur
    dispatch({ type: INPUT_BLUR }); // dispactch this action
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please Enter a Valid {id}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
  },
  errorContainer: {
    marginVertical: 3,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default Input;
