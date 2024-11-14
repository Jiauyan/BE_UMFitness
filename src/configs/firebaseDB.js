const { getFirestore } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { getStorage } = require("firebase/storage");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL_FIREBASE,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

const connectfirebaseDB = async () => {
  try {
    console.log("Firebase connected")
    return db;
  } catch (err) {
    console.error("Firebase Connection Error", err.message);
  }
};

module.exports = {
  connectfirebaseDB,
  app,
  auth,
  db,
  storage,
  database
};