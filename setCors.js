// Fichier pour configurer le CORS via Node.js
import { Storage } from '@google-cloud/storage';

const storage = new Storage(
  {
    keyFilename: './serviceAccountKey.json' 
  }
);
const bucketName= "hackathonprojet.firebasestorage.app" ;
async function setCors() {
  const bucket = storage.bucket(bucketName);

  const corsConfiguration = [
    {
      origin: ['http://localhost:5173'], 
      method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      maxAgeSeconds: 3600,
      responseHeader: ['Content-Type', 'Authorization'],
    },
  ];

  await bucket.setCorsConfiguration(corsConfiguration);
  console.log(`CORS configuré pour le bucket ${bucketName}`);
}

setCors().catch(console.error);