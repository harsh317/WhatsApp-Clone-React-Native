import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2Ei7fiKbjZrgqXzvvb80WIV-afdIowPc",
  authDomain: "whatsapp-clone-tutorial-fa52b.firebaseapp.com",
  databaseURL:
    "https://whatsapp-clone-tutorial-fa52b-default-rtdb.firebaseio.com",
  projectId: "whatsapp-clone-tutorial-fa52b",
  storageBucket: "whatsapp-clone-tutorial-fa52b.appspot.com",
  messagingSenderId: "836976116573",
  appId: "1:836976116573:web:5d3eb38f53b20d13af5eb4",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const storage = firebase.storage();

export { storage };
