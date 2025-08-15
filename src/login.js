import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../css/styles.css'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//-----// Fin des imports 

const firebaseConfig = {
  apiKey: "AIzaSyAA4Mg_ipfQmZH7BH6aNW7vin7q_GduYjc",
  authDomain: "hackathonprojet.firebaseapp.com",
  projectId: "hackathonprojet",
  storageBucket: "hackathonprojet.firebasestorage.app",
  messagingSenderId: "124381869657",
  appId: "1:124381869657:web:430b6a66888aedc6faa348",
  measurementId: "G-XQ5CTN4SFE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  const messageDiv = document.getElementById('message');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    messageDiv.textContent = "Connexion réussie";

    localStorage.setItem('token', token);

    // Rediriger vers ta page principale
    window.location.href = "/main.html"; // ou autre
  } catch (error) {
    messageDiv.textContent = "Erreur de connexion : " + error.message;
  }
});