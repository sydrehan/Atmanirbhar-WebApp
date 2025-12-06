import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your team's configuration
const firebaseConfig = {
  // We only need the databaseURL for this specific setup as rules are public
  databaseURL: "https://deepsightsih2025-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const db = getDatabase(app);
