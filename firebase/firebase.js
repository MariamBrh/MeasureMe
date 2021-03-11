import ReactNative from "react-native";
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB2yD3qJ-mPOb1dtD2Brjo5hrh-CMfpo4Q",
    authDomain: "measureme-e1e96.firebaseapp.com",
    projectId: "measureme-e1e96",
    storageBucket: "measureme-e1e96.appspot.com",
    messagingSenderId: "209614213591",
    appId: "1:209614213591:web:c1b4fe34d4f649b2857b92",
    measurementId: "G-5WFE5WZEGH"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore()
  const auth = firebase.auth();

  export {db, auth};