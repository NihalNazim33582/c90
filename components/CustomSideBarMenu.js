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

import { RFValue } from "react-native-responsive-fontsize";

import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar, Icon } from "react-native-elements";
import db from "../config";
import firebase from "firebase";

export default class CustomSideBar extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      proflieName: "",
      docId: "",
      image: "#",
    };
  }

  getUserProflieName = () => {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            proflieName: doc.data().first_name + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  };

  selectAPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.uploadAnImage(uri, this.state.userId);
    }
  };

  /*selectAPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypesOptions.All,
      allowsEditing: true,
      aspect: [250, 250],
      quality: 1,
    });
    if (!cancelled) {
      this.uplaodAnImage(uri, this.state.userId);
    }
  };*/

  uploadAnImage = async (uri, imageName) => {
    var Image = await fetch(uri);
    var blob = await Image.blob();
    var AddingImageFeild = firebase
      .storage()
      .ref()
      .child("UserProflieImage/" + imageName);
    return AddingImageFeild.put(blob).then((Response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var data = firebase
      .storage()
      .ref()
      .child("UserProflieImage/" + imageName);
    data.getDownloadURL().then((uri) => {
      this.setState({
        image: uri,
      });
    });
  };

  componentDidMount = () => {
    this.getUserProflieName();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#32867d",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={"xlarge"}
            onPress={() => this.selectAPicture()}
            showEditButton
          />
          <Text
            style={{
              fontWeight: "300",
              fontSize: RFValue(20),
              color: "#fff",
              padding: RFValue(10),
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <View style={{ flex: 0.6 }}>
          <DrawerItems {...this.props} />
        </View>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              width: "100%",
              height: "100%",
            }}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >
            <Icon
              name="logout"
              type="antdesign"
              size={RFValue(20)}
              iconStyle={{ paddingLeft: RFValue(10) }}
            />

            <Text
              style={{
                fontSize: RFValue(15),
                fontWeight: "bold",
                marginLeft: RFValue(30),
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
    flexDirection: "row",
  },
logOutButton: {
    height: 30,
    width: "85%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

