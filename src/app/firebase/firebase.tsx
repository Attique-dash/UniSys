import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCBknKdh1ajPG8z1JcPzaLFDLNjVtwI3tw",
  authDomain: "unisys-66fe0.firebaseapp.com",
  projectId: "unisys-66fe0",
  storageBucket: "unisys-66fe0.firebasestorage.app",
  messagingSenderId: "493317449263",
  appId: "1:493317449263:web:2e43e9f98cd859c7fe48da",
  measurementId: "G-SDGH51GEL1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db };