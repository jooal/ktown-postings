// src/components/EditJob.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore, auth } from "../firebase";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [languageNeeds, setLanguageNeeds] = useState("Korean-Beginner");
  const [yearsOfExperience, setYearsOfExperience] = useState("0-1");
  const [officePolicy, setOfficePolicy] = useState("Remote");
  const [visaSponsorship, setVisaSponsorship] = useState("No");

  // Store original data for comparison
  const [originalData, setOriginalData] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Redirect if not logged in
    if (!auth.currentUser) {
      navigate("/");
      return;
    }

    const fetchJob = async () => {
      try {
        const docRef = firestore.collection("jobs").doc(jobId);
        const doc = await docRef.get();
        if (doc.exists) {
          const jobData = doc.data();
          // Populate form with existing job data
          setTitle(jobData.title || "");
          setDescription(jobData.description || "");
          setLocation(jobData.location || "");
          setLanguageNeeds(jobData.languageNeeds || "Korean-Beginner");
          setYearsOfExperience(jobData.yearsOfExperience || "0-1");
          setOfficePolicy(jobData.officePolicy || "Remote");
          setVisaSponsorship(jobData.visaSponsorship || "No");

          // Store original data for comparison
          setOriginalData({
            title: jobData.title || "",
            description: jobData.description || "",
            location: jobData.location || "",
            languageNeeds: jobData.languageNeeds || "Korean-Beginner",
            yearsOfExperience: jobData.yearsOfExperience || "0-1",
            officePolicy: jobData.officePolicy || "Remote",
            visaSponsorship: jobData.visaSponsorship || "No",
          });
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job data.");
      }
      setLoading(false);
    };

    fetchJob();
  }, [jobId, navigate]);

  // Compare current form fields to original data to determine if changes exist
  const hasChanges =
    originalData &&
    (originalData.title !== title ||
      originalData.description !== description ||
      originalData.location !== location ||
      originalData.languageNeeds !== languageNeeds ||
      originalData.yearsOfExperience !== yearsOfExperience ||
      originalData.officePolicy !== officePolicy ||
      originalData.visaSponsorship !== visaSponsorship);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const docRef = firestore.collection("jobs").doc(jobId);
      await docRef.update({
        title,
        description,
        location,
        languageNeeds,
        yearsOfExperience,
        officePolicy,
        visaSponsorship,
      });

      setSuccessMessage("Job updated successfully!");
      // Update original data to match the newly saved fields
      setOriginalData({
        title,
        description,
        location,
        languageNeeds,
        yearsOfExperience,
        officePolicy,
        visaSponsorship,
      });
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job. Please try again.");
    }
  };

  const handleBack = () => {
    // Navigate back to the job's detail view
    navigate(`/dashboard/job/${jobId}`);
  };

  if (loading) return <p>Loading job data...</p>;
  if (error) return <p className="alert alert-danger">{error}</p>;

  return (
    <>
      <button
        type="button"
        style={{ marginBlockEnd: "24px" }}
        className="btn btn-primary"
        onClick={handleBack}
      >
        Back
      </button>
      <div className="card p-3 mb-4">
        <h4>Edit Job</h4>
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Title */}
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

          {/* Description */}
          <div className="form-group mb-2">
            <label>Description</label>
            <textarea
              style={{ height: "200px" }}
              className="form-control"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Location */}
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

          {/* Language Needs */}
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
              <option value="English-Beginner">English - Beginner</option>
              <option value="English-Intermediate">
                English - Intermediate
              </option>
              <option value="English-Advanced">English - Advanced</option>
              <option value="English-Fluent">English - Fluent</option>
              <option value="Bilingual">Bilingual</option>
            </select>
          </div>

          {/* Years of Experience */}
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

          {/* Office Policy */}
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

          {/* Visa Sponsorship */}
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

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!hasChanges}
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditJob;
