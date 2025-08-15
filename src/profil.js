import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../css/styles.css'
import { doc, getDoc,setDoc } from "firebase/firestore";
import {getFirestore} from "firebase/firestore";

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
const db = getFirestore(app);

document.getElementById("username-change").addEventListener( "click" , changerUsername)
onAuthStateChanged(auth, (user) => {
  if (user) {
    
      
    document.getElementById("username-display").textContent = user.displayName;
    document.getElementById("username-info").textContent = user.displayName;
    document.getElementById("email-info").textContent = user.email;
  } else {
    
    document.getElementById("username-display").textContent = "Non connecté";
  }
});

async function changerUsername() {
  
}

async function getDisplayNames() {
  const ref = doc(db, "usernames", "site-users");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    const names = data.usersnames;
    console.log(names); 
    return names;
  }
  else{
    console.log("document not found");
    return[];
  }
}

async function getUserids() {
  const ref = doc(db, "usernames", "site-users");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    const ids = data.usersids;
   
    return ids;
  }
  else{
    console.log("document not found");
    return[];
  }
}


document.getElementById("requestbtn").addEventListener( "click" , async () => {
  const names = await getDisplayNames() ;
  document.getElementById("users-choice-container").classList.remove("hidden");
  const searchInput = document.getElementById("search");
  const suggestionsContainer = document.getElementById("suggestions");
 // On affiche la liste des utilisateurs qui correspondent à la recherche
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestionsContainer.innerHTML = "";

  if (query.length === 0) return;

  const filtered = names.filter(user =>
    user.toLowerCase().includes(query)
  ).slice(0,5);

  filtered.forEach(user => {
    const div = document.createElement("div");
    div.textContent = user;
    div.onclick = () => {
      searchInput.value = user;
      suggestionsContainer.innerHTML = "";
    };
    suggestionsContainer.appendChild(div);
    });
    });
  searchInput.addEventListener("dblclick",sendRequest(user.uid , searchInput.value));
  //double-cliquer sur  l'input envoie une requète à un ami
}) ;



async function sendRequest(fromId , toName , names){
  const userindex = names.indexOf(toName)
  const ids = await getUserids();
  const toId = ids[userindex];  
  // maintenant créer une requête sous la forme [fromId , toId, pending]
  const ref = doc(db, "requests", "pending");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await setDoc(doc(db, "requests", "pending"), {
    myArray: [fromId, toId, pending]
      });
}
  else{
    console.log("document not found");
    alert("Souci dans la création de demande");
  }

}