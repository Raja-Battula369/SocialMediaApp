// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4fOp3YD_Cy0jkK6x6-Bu0lBXRKzdJljM",
    authDomain: "uploadimages-4de3e.firebaseapp.com",
    projectId: "uploadimages-4de3e",
    storageBucket: "uploadimages-4de3e.appspot.com",
    messagingSenderId: "882191424921",
    appId: "1:882191424921:web:222593f29034e2a4c18708",
    measurementId: "G-FYW1ESJFYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);