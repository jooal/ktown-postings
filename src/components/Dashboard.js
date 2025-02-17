// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import JobPostingForm from "./JobPostingForm";
import JobList from "./JobList";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Get current company (user)
  const user = auth.currentUser;

  useEffect(() => {
    // Redirect to login if not logged in
    if (!user) {
      navigate("/");
      return;
    }
    // Listen for job postings by this company (using user.uid)
    const unsubscribe = firestore
      .collection("jobs")
      .where("companyId", "==", user.uid)
      .onSnapshot(snapshot => {
        const jobData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobData);
      });
    return () => unsubscribe();
  }, [user, navigate]);

  return (
    <div>
      <h2>Your Postings</h2>

      <JobList jobs={jobs} />
      <hr />

      <h2>Company Dashboard</h2>
      <JobPostingForm />
    </div>
  );
};

export default Dashboard;
