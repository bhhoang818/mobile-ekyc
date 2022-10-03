import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDrBRCoq-IOEsw3i7M7cnY4SzMJJZOBiYM",
    authDomain: "hdbank-a1066.firebaseapp.com",
    databaseURL: "https://hdbank-a1066-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hdbank-a1066",
    storageBucket: "hdbank-a1066.appspot.com",
    messagingSenderId: "944054541564",
    appId: "1:944054541564:web:ccaf3387c3ea1d0e11cb79",
    measurementId: "G-7FE5R12C45"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const fireBaseInstance = getFirestore(firebaseApp);

export { fireBaseInstance };