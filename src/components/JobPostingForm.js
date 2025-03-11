// src/components/JobPostingForm.js
import React, { useState } from "react";
import { firestore, auth } from "../firebase";

const JobPostingForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [languageNeeds, setLanguageNeeds] = useState("Korean-Beginner");
  const [yearsOfExperience, setYearsOfExperience] = useState("0-1");
  const [officePolicy, setOfficePolicy] = useState("Remote");
  const [visaSponsorship, setVisaSponsorship] = useState("No");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await firestore.collection("jobs").add({
        title,
        description,
        location,
        languageNeeds,
        yearsOfExperience,
        officePolicy,
        visaSponsorship,
        companyId: user.uid,
        createdAt: new Date(),
      });

      // Clear the form after posting
      setTitle("");
      setDescription("");
      setLocation("");
      setLanguageNeeds("Korean");
      setYearsOfExperience("0-1");
      setOfficePolicy("Remote");
      setVisaSponsorship("No");
    } catch (err) {
      setError("Error posting the job. Please try again.");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4>Create a New Job Posting</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>Job Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-2">
          <label>Description</label>
          <textarea
            style={{ height: "300px" }}
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-2">
          <label>Location (city, state)</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Language Needs Dropdown */}
        <div className="form-group mb-2">
          <label>Language Needs</label>
          <select
            className="form-select"
            value={languageNeeds}
            onChange={e => setLanguageNeeds(e.target.value)}
            required
          >
            <option value="Korean-Beginner">Korean - Beginner</option>
            <option value="Korean-Intermediate">Korean - Intermediate</option>
            <option value="Korean-Advanced">Korean - Advanced</option>
            <option value="Korean-Fluent">Korean - Fluent</option>
            <option value="Korean-Beginner">English - Beginner</option>
            <option value="English-Intermediate">English - Intermediate</option>
            <option value="English-Advanced">English - Advanced</option>
            <option value="English-Fluent">English - Fluent</option>
            <option value="Bilingual">Bilingual</option>
          </select>
        </div>

        {/* Years of Experience Dropdown */}
        <div className="form-group mb-2">
          <label>Years of Experience</label>
          <select
            className="form-select"
            value={yearsOfExperience}
            onChange={e => setYearsOfExperience(e.target.value)}
            required
          >
            <option value="0-1">0-1 Years</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>

        {/* Office Policy Dropdown */}
        <div className="form-group mb-2">
          <label>Office Policy</label>
          <select
            className="form-select"
            value={officePolicy}
            onChange={e => setOfficePolicy(e.target.value)}
            required
          >
            <option value="Remote">Remote</option>
            <option value="Office">Office</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Visa Sponsorship Dropdown */}
        <div className="form-group mb-3">
          <label>Visa Sponsorship</label>
          <select
            className="form-select"
            value={visaSponsorship}
            onChange={e => setVisaSponsorship(e.target.value)}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPostingForm;
