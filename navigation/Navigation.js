import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Chat from "../Screens/WhatsApp/Chat";
import Camera from "../Screens/WhatsApp/Camera";
import Calls from "../Screens/WhatsApp/Calls";
import Message from "../Screens/WhatsApp/Messages";
import Status from "../Screens/WhatsApp/Status";
import AddDetails from "../Screens/Users/AddDetails";
import Profile from "../Screens/Users/ProfileScreen";
import Auth from "../Screens/Users/Auth";
import StartUpScreen from "../Screens/StartUpScreen";
import Colors from "../Constants/Colors";
import HeaderButton from "../components/HeaderButton";

const WhatsAppTopTabNav = createMaterialTopTabNavigator(
  {
    Camera: {
      screen: Camera,
      navigationOptions: {
        tabBarVisible: false,
        tabBarLabel: (TabBarInfo) => {
          return (
            <Ionicons
              name={Platform.OS === "ios" ? "ios-camera" : "md-camera"}
              color="black"
              size={25}
            />
          );
        },
      },
    },
    Chats: Chat,
    Status: Status,
    Calls: Calls,
  },
  {
    initialRouteName: "Chats",
    tabBarOptions: {
      labelStyle: {
        fontSize: 12,
        fontFamily: "open-sans-bold", // The Font that we imported
      },
      indicatorStyle: {
        backgroundColor: "white",
      },
      activeTintColor: "white",
      inactiveTintColor: "#D3D3D3",
      pressColor: "white",
      style: {
        backgroundColor: Colors.accent,
      },
    },
  }
);

const WhatsAppNavigator = createStackNavigator({
  MainNav: {
    screen: WhatsAppTopTabNav,
    navigationOptions: {
      headerTitle: "WhatsApp",
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            IconComponent={Ionicons}
            title="Search"
            iconName={Platform.OS === "android" ? "md-search" : "ios-search"}
          ></Item>
          <Item
            IconComponent={MaterialIcons}
            title="MoreVert"
            iconName="more-vert"
          ></Item>
        </HeaderButtons>
      ),
      headerTitleStyle: {
        color: "white",
      },
      headerStyle: {
        backgroundColor: Colors.accent,
        elevation: 0,
        shadowOpacity: 0,
      },
    },
  },
  Messages: Message,
  Profile: Profile,
});

const AuthNav = createStackNavigator({
  Auth: Auth,
  AddDetails: AddDetails,
});

const MainNavigator = createSwitchNavigator({
  StartUpScreen: StartUpScreen,
  Auth: AuthNav,
  WhatsAppMain: WhatsAppNavigator,
});

export default createAppContainer(MainNavigator);
