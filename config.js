import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyAPb3cyi3evO-ns6alP9FUvLaElQ43Ku7Y",
    authDomain: "book-santa-cebd8.firebaseapp.com",
    projectId: "book-santa-cebd8",
    storageBucket: "book-santa-cebd8.appspot.com",
    messagingSenderId: "142527470516",
    appId: "1:142527470516:web:9c47edec5503083ffa30e1"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
