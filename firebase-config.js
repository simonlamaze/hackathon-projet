
import express from "express";
import admin from "firebase-admin";
import dotenv from "dotenv";


dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  })
});


const app = express();
app.use(express.json());

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Token manquant");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Token invalide");
  }
}

app.post("/upload", verifyToken, (req, res) => {
  // Traitement upload PGN ici
  res.send("Upload OK");
});

app.listen(3000, () => console.log("Serveur démarré sur le port 3000"));