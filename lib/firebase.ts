import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD4_tfSSzNRNhodd08BMNxAOSnqM_9ASJU",
    authDomain: "agriconnect-42482.firebaseapp.com",
    projectId: "agriconnect-42482",
    storageBucket: "agriconnect-42482.firebasestorage.app",
    messagingSenderId: "368614265321",
    appId: "1:368614265321:web:5994eddcf0c655371bfb78",
    measurementId: "G-WVH0NFF58W"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
