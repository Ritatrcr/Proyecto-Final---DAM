// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.API_KEY,
  authDomain: Constants.expoConfig?.extra?.AUTH_DOMAIN,
  projectId: Constants.expoConfig?.extra?.PROJECT_ID,
  storageBucket: Constants.expoConfig?.extra?.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig?.extra?.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig?.extra?.APP_ID,
  measurementId: Constants.expoConfig?.extra?.MEASUREMENT_ID,
};



const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 
export const db = getFirestore(app);
export const auth = getAuth(app);
