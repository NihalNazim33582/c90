import React from "react";

import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  FlatList,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { Input } from "react-native-elements";
import db from "../config";

import firebase from "firebase";

import MyHeader from "../components/MyHeader";
//import { BookSearch } from "react-native-google-books";
import { BookSearch } from "react-native-google-books";
//import { FlatList } from "react-native-gesture-handler";

export default class BookRequestScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      userId: firebase.auth().currentUser.email,

      bookName: "",

      reasonToRequest: "",

      IsBookRequestActive: "",

      bookStatus: "",

      requestId: "",

      userDocId: "",

      docId: "",

      imageLink: "",

      dataSource: "",

      showFlatList: false,

      requestedImageLink: "",

      requestedBookName: "",
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonToRequest) => {
    var userId = this.state.userId;

    var randomRequestId = this.createUniqueId();

    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyAPb3cyi3evO-ns6alP9FUvLaElQ43Ku7Y"
    );
    db.collection("requested_books").add({
      user_id: userId,

      book_name: bookName,

      reason_to_request: reasonToRequest,

      request_id: randomRequestId,

      bookStatus: "requested",

      date: firebase.firestore.FieldValue.serverTimestamp,

      imageLink: books.data[0].volumeInfo.imageLinks.smallThumbnail,
    });

    await this.getBookRequest();

    db.collection("users")
      .where("email_id", "==", userId)
      .get()

      .then()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: true,
          });
        });
      });

    this.setState({
      bookName: "",

      reasonToRequest: "",

      requestId: randomRequestId,
    });

    return Alert.alert("Book Requested Successfully");
  };

  receivedBooks = (bookName) => {
    var useId = this.state.userId;

    var requestId = this.state.requestId;

    db.collection("recevied_books").add({
      user_id: useId,

      Book_Name: bookName,

      request_id: requestId,

      bookStatus: "received",
    });
  };

  getIsBookRequestActive = () => {
    db.collection("users")

      .where("email_id", "==", this.state.userId)

      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsBookRequestActive: doc.data().IsBookRequestActive,

            userDocId: doc.id,
          });
        });
      });
  };

  getBookRequest = () => {
    // getting the requested book

    var bookRequest = db
      .collection("requested_books")

      .where("user_id", "==", this.state.userId)

      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().bookStatus !== "received") {
            this.setState({
              requestId: doc.data().request_id,

              requestedBookName: doc.data().book_name,

              bookStatus: doc.data().bookStatus,

              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name

    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;

          var lastName = doc.data().last_name;

          // to get the donor id and book nam

          db.collection("AllNotifications")
            .where("requestId", "==", this.state.requestId)
            .get()

            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().DonorId;

                var bookName = doc.data().bookName;

                //targert user id is the donor id to send notification to the user

                db.collection("AllNotifications").add({
                  targeted_user_id: donorId,

                  message:
                    name + " " + lastName + " received the book " + bookName,

                  notification_status: "unread",

                  book_name: bookName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getBookRequest();

    this.getIsBookRequestActive();
  }

  updateBookRequestStatus = () => {
    //updating the book status after receiving the book

    db.collection("requested_books")
      .doc(this.state.docId)

      .update({
        bookStatus: "recieved",
      });

    //getting the  doc id to update the users doc

    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()

      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc

          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: false,
          });
        });
      });
  };

  getBookApi = async (bookName) => {
    this.setState({
      bookName: bookName,
    });

    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyAPb3cyi3evO-ns6alP9FUvLaElQ43Ku7Y"
      );
      console.log("resp", books.data);
      console.log("I work.");
      this.setState({
        dataSource: books.data,
        showFlatList: true,
      });
    }
  };

  renderItem = ({ item, i }) => {
    let objects = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };
    return (
      <View>
        <TouchableHighlight
          activeOpacity={0.85}
          underlayColor={"blue"}
          onPress={() => {
            this.setState({
              showFlatList: false,
              bookName: item.volumeInfo.title,
            });
          }}
          bottomDivider
          style={styles.touchableopacity}
        >
          <Text>{item.volumeInfo.title}</Text>
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    if (this.state.IsBookRequestActive === true) {
      return (
        // Status screen
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Book Status" navigation={this.props.navigation} />
          </View>
          <View style={styles.ImageView}>
            <Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.bookstatus}>
            <Text
              style={{
                fontSize: RFValue(20),
              }}
            >
              Name of the book
            </Text>
            <Text style={styles.requestedbookName}>
              {this.state.requestedBookName}
            </Text>
            <Text style={styles.status}>Status</Text>
            <Text style={styles.bookStatus}>{this.state.bookStatus}</Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateBookRequestStatus();
                this.receivedBooks(this.state.requestedBookName);
              }}
            >
              <Text style={styles.buttontxt}>Book Recived</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      // Form screen
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Book Name"}
            placeholder={"Book name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => this.getBookApi(text)}
            onClear={(text) => this.getBookApi("")}
            value={this.state.bookName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"Reason"}
                placeholder={"Why do you need the book"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.bookName,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text style={styles.requestbuttontxt}>Request</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: { flex: 1, alignItems: "center", justifyContent: "center" },
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderWidth: 1,
    padding: 10,
  },
  ImageView: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  imageStyle: {
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  bookstatus: { flex: 0.4, alignItems: "center" },
  requestedbookName: {
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
    fontWeight: "bold",
    alignItems: "center",
    marginLeft: RFValue(60),
  },
  status: { fontSize: RFValue(20), marginTop: RFValue(30) },
  bookStatus: {
    fontSize: RFValue(30),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView: { flex: 0.2, justifyContent: "center", alignItems: "center" },
  buttontxt: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});
