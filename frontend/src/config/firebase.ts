import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqQzoizI88bEeQJx18MJxJzw7Ilqy9xs8",
  authDomain: "moneymatex-kathir.firebaseapp.com",
  projectId: "moneymatex-kathir",
  storageBucket: "moneymatex-kathir.firebasestorage.app",
  messagingSenderId: "163215880560",
  appId: "1:163215880560:web:9bbb4cefe359b92d1a1fb5",
  measurementId: "G-Z0FSQME4ZW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
