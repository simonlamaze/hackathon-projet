import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../css/styles.css'
import { doc, getDoc,setDoc } from "firebase/firestore";
import {getFirestore} from "firebase/firestore";
import { createElement } from "react";

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


// Fonction qui crée une requète d'un entraîneur à un élève
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
//Fonction qui récupère l'ID d'un nom
async function getId(name){
  const ids =await getUserids();
  const names = await getDisplayNames();
  const idx = names.indefOf(name);
  if (!idx) {
    alert ("utilisateur non trouvé");
    return;
  }
  return ids[idx];
}

//Fonction qui récupère le nom d'un Id
async function getName(id){
  const ids =await getUserids();
  const names = await getDisplayNames();
  const idx = ids.indefOf(id);
  if (!idx) {
    alert ("utilisateur non trouvé");
    return;
  }
  return names[idx];
}


//Fonction qui rejette une demande
async function rejectRequest(requestid){

}

//Fonction qui annule une demande
async function cancelRequest(requestid){
  
}
//Fonction qui accepte une demande
async function acceptRequest(requestid){
  
}
//Fonction qui récupère une liste des requètes recues en cours et les affiche
async function showComingRequests(userId){
  const snap = await getDoc(doc(db, "requests", "pending"));
  if (snap.exists()) {
  const data = snap.data();
  const allArrays = Object.entries(data); //On récupère une liste de listes [ requestid , requestArray]
  const rightArrays= allArrays.filter(sousListe => sousListe[1][1] === userId); // On filtre pour garder que celles qui nous intéressent
  
  const requestlist =document.getElementById("recieved-requests-list")
  rightArrays.forEach(array => {
    const requestId= array[0]; // l'ID de la demande
    const issuername= getName(array[1][0]); // récupère le nom de celui qui a fait la demande

      const requestline = document.createElement("p");
      requestline.innerHTML= issuername + " voudrait pouvoir vous partager des fichiers";
      requestlist.appendChild(requestline);
      //Bouton pour accepter
      const acceptline = document.createElement("button");
      acceptline.innerHTML="Accepter la demande";
      acceptline.addEventListener("click", acceptRequest(requestId));
      requestlist.appendChild(requestline);
      // Bouton pour refuser
      const rejectline = document.createElement("button");
      rejectline.innerHTML="Refuser la demande";
      rejectline.addEventListener("click", rejectRequest(requestId));
      requestlist.appendChild(requestline);
      


  });
}
}

//Fonction qui récupère une liste des requètes envoyées en cours et les affiche
async function showComingRequests(userId){
  const snap = await getDoc(doc(db, "requests", "pending"));
  if (snap.exists()) {
  const data = snap.data();
  const allArrays = Object.entries(data); //On récupère une liste de listes [ requestid , requestArray]
  const rightArrays= allArrays.filter(sousListe => sousListe[1][1] === userId); // On filtre pour garder que celles qui nous intéressent
  
  const requestlist =document.getElementById("issued-requests-list")
  rightArrays.forEach(array => {
    const requestId= array[0]; // l'ID de la demande
    const studentname= getName(array[1][1]); // récupère le nom de celui qui a fait la demande

      const requestline = document.createElement("p");
      requestline.innerHTML=  " vous voudriez partager des fichiers à"+ studentname ;
      requestlist.appendChild(requestline);
      // on rajoute un bouton pour annuler les demandes qu'on a envoyées
      const acceptline = document.createElement("button");
      acceptline.innerHTML="Annuler la demande";
      acceptline.addEventListener("click", cancelRequest(requestId));
      requestlist.appendChild(requestline);
      

  });
}
}