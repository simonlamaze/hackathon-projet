import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth";
import { doc,setDoc} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage" ;
import { signOut } from "firebase/auth";
import '../css/styles.css'

//----//Fin des imports

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
const db = getFirestore ( app);
const storage = getStorage(app);



document.getElementById("signup-form").addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;
  const username = e.target.username.value; 

  try {
    // 1️⃣ Création Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 2️⃣ Met à jour seulement le displayName dans Auth
    await updateProfile(user, { displayName: username });
    
    // 3️⃣ Crée le doc Firestore avec tes listes
    await setDoc(doc(db, "users", user.uid), {
      displayName: username,
      myTrainers: [],
      myStudents: [],
      myFiles: [],
      createdAt: new Date().toISOString()
    });

    
    // 5️⃣ Feedback et redirection
    document.getElementById('signup-message').textContent = "Inscription réussie !";
    window.location.href = 'login.html';
    await signOut(auth);
  } catch (error) {
    document.getElementById('signup-message').textContent = `Erreur : ${error.message}`;
  }
});