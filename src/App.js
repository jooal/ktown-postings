// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import JobDetail from "./components/JobDetail"; // Optional detailed view
import SignUp from "./components/Signup";
import ApplicationDetail from "./components/ApplicantDetail";
import CompanyJobDetail from "./components/CompanyJobDetail";
import JobPostingForm from "./components/JobPostingForm";
import EditJob from "./components/EditJob";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public Home Page */}
          <Route path="/" element={<Home />} />

          {/* Sign Up Page */}
          <Route path="/signup" element={<SignUp />} />

          {/* Company Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Company Dashboard (requires login) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-job" element={<JobPostingForm />} />

          {/* Optional: Job Detail Page */}
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/dashboard/job/:jobId" element={<CompanyJobDetail />} />

          <Route path="/edit-job/:jobId" element={<EditJob />} />
          {/* Application detail view: shows details for a specific applicant */}
          <Route
            path="/dashboard/job/:jobId/applicants/:applicationId"
            element={<ApplicationDetail />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
