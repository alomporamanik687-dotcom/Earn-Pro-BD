import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDQHOaLwHrdWFhyaUCKyid3A526_VjCfVg",
  authDomain: "earn-pro-d69f1.firebaseapp.com",
  projectId: "earn-pro-d69f1",
  storageBucket: "earn-pro-d69f1.firebasestorage.app",
  messagingSenderId: "197193236556",
  appId: "1:197193236556:web:5dc40d97562dbfe9baf4e9",
  measurementId: "G-C41GFLX6ZM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
