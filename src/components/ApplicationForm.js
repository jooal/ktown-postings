// src/components/ApplicationForm.js
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";

const ApplicationForm = ({ jobId }) => {
  // New state fields for the updated form:
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [willingToRelocate, setWillingToRelocate] = useState("Maybe");

  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  // Check localStorage to see if the user has already applied
  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
    if (appliedJobs.includes(jobId)) {
      setApplied(true);
    }
  }, [jobId]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // For this MVP, we'll simply store the file's name.
      // In a full implementation, you'd upload the file to Firebase Storage.
      const resumeFileName = resumeFile ? resumeFile.name : "";

      // Save the application in a subcollection "applications" under the job document
      await firestore
        .collection("jobs")
        .doc(jobId)
        .collection("applications")
        .add({
          firstName,
          lastName,
          email: appEmail,
          resumeFileName, // Save the file name; replace with URL after upload if needed
          coverLetter,
          willingToRelocate,
          appliedAt: new Date(),
        });
      // Tag the job as applied in localStorage
      const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
      appliedJobs.push(jobId);
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
      setApplied(true);
      setMessage("Application submitted successfully!");
    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage("There was an error submitting your application.");
    }
  };

  if (applied) {
    return (
      <div className="alert alert-info">You have applied for this job.</div>
    );
  }

  return (
    <div className="card p-3">
      <h4>Apply for this Job</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>
        {/* Last Name */}
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>
        {/* Email Address */}
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={appEmail}
            onChange={e => setAppEmail(e.target.value)}
            required
          />
        </div>
        {/* Resume Upload */}
        <div className="mb-3">
          <label className="form-label">Resume Upload</label>
          <input
            type="file"
            className="form-control"
            onChange={e => setResumeFile(e.target.files[0])}
            required
          />
        </div>
        {/* Cover Letter */}
        <div className="mb-3">
          <label className="form-label">Cover Letter</label>
          <textarea
            className="form-control"
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            required
          />
        </div>
        {/* Willing to Relocate */}
        <div className="mb-3">
          <label className="form-label">Willing to Relocate</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="relocate"
                id="relocateYes"
                value="Yes"
                checked={willingToRelocate === "Yes"}
                onChange={e => setWillingToRelocate(e.target.value)}
              />
              <label className="form-check-label" htmlFor="relocateYes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="relocate"
                id="relocateNo"
                value="No"
                checked={willingToRelocate === "No"}
                onChange={e => setWillingToRelocate(e.target.value)}
              />
              <label className="form-check-label" htmlFor="relocateNo">
                No
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="relocate"
                id="relocateMaybe"
                value="Maybe"
                checked={willingToRelocate === "Maybe"}
                onChange={e => setWillingToRelocate(e.target.value)}
              />
              <label className="form-check-label" htmlFor="relocateMaybe">
                Maybe
              </label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
