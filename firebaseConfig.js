import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBv09I88nfb5DUNW-RqTaQbiKhzyvX_Tk",
  authDomain: "fixeroo-b432a.firebaseapp.com",
  projectId: "fixeroo-b432a",
  storageBucket: "fixeroo-b432a.firebasestorage.app",
  messagingSenderId: "754946654033",
  appId: "1:754946654033:web:27435530d6c1f4c2625d70",
  measurementId: "G-JXMPW72GSM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);