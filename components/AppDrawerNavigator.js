import React from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

import db from "../config";
import firebase from "firebase";
import MyDonation from "../screens/MyDonationScreen";
import { AppTabNavigator } from "./AppTabNavigator";
import { createDrawerNavigator } from "react-navigation-drawer";
import CustomSideBar from "./CustomSideBarMenu";
import Settings from "../screens/Settings";
import Notification from "../screens/Notifcation";
import BooksRiceved from "../screens/MyRecivedBooks";

export const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },
    MyDonation: {
      screen: MyDonation,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "My Donations",
      },
    },
    Notification: {
      screen: Notification,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel: "Notifications",
      },
    },
    BooksRiceved: {
      screen: BooksRiceved,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "My Received Books",
      },
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="fontawesome5" />,
        drawerLabel: "Settings",
      },
    },
  },
  { contentComponent: CustomSideBar },
  { initialRouteName: "Home" }
);
