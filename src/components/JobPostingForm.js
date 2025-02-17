// src/components/JobPostingForm.js
import React, { useState } from "react";
import { firestore, auth } from "../firebase";

const JobPostingForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
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
        companyId: user.uid,
        createdAt: new Date(),
      });
      // Clear the form after posting
      setTitle("");
      setDescription("");
      setLocation("");
    } catch (err) {
      setError("Error posting the job. Please try again.");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <h4>Create a New Job Posting</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success mt-2">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPostingForm;
