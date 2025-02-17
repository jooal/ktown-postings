// src/seedJobs.js
import { firestore } from "./firebase";
import firebase from "firebase/compat/app"; // Using compat if you use compat imports

const seedJob = async () => {
  try {
    await firestore.collection("jobs").add({
      title: "Frontend Developer",
      location: "Seoul, South Korea",
      description:
        "We are looking for a creative frontend developer to join our team and work on modern web applications.",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), // sets the server timestamp
    });
    console.log("Mock job posting created successfully!");
  } catch (error) {
    console.error("Error creating job posting: ", error);
  }
};

seedJob();
