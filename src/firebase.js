import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyArU2XtN87DeBJacRQD_ARHOPPkh62FsRc",
  authDomain: "mern-blog-1f9d7.firebaseapp.com",
  projectId: "mern-blog-1f9d7",
  storageBucket: "mern-blog-1f9d7.appspot.com",
  messagingSenderId: "842594341363",
  appId: "1:842594341363:web:b1426be6b55b4361688286",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
