// src/components/ApplicationForm.js
import React, { useState } from "react";
import { firestore, storage } from "../firebase";

const ApplicationForm = ({ jobId }) => {
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("0-1");
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [willingToRelocate, setWillingToRelocate] = useState("Maybe");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");

  // Additional fields
  const [countryOfResidence, setCountryOfResidence] = useState("South Korea");
  const [koreanFluency, setKoreanFluency] = useState("Beginner");

  // Error states for onBlur validation
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeFile: "",
    coverLetter: "",
    currentRole: "",
    yearsExperience: "",
    countryOfResidence: "",
    koreanFluency: "",
  });

  // Validate a single field on blur
  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg = "This field is required";
    } else {
      // Additional checks for specific fields
      if (name === "email" && value) {
        // Basic email pattern check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Invalid email";
        }
      }
      if (name === "phone" && value) {
        // Simple phone check (digits only, 7-15 length)
        const phoneRegex = /^[0-9]{7,15}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ""))) {
          errorMsg = "Invalid phone number";
        }
      }
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  // Check if all fields are filled and no errors exist
  const isFormValid = () => {
    // Check if any required field is empty
    const anyFieldEmpty =
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !resumeFile ||
      !coverLetter ||
      !currentRole ||
      !yearsExperience ||
      !countryOfResidence ||
      !koreanFluency;

    // Check if any error message is non-empty
    const anyError = Object.values(errors).some(err => err !== "");

    return !anyFieldEmpty && !anyError;
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // Clear any existing error for resumeFile if user selected a file
      setErrors(prev => ({ ...prev, resumeFile: "" }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");

    // Final check if any field is empty or has errors
    if (!isFormValid()) {
      return; // stop if invalid
    }

    try {
      let resumeURL = "";

      // Upload the resume file if one was selected
      if (resumeFile) {
        const storageRef = storage.ref();
        const resumeRef = storageRef.child(
          `resumes/${Date.now()}_${resumeFile.name}`
        );
        const uploadTask = resumeRef.put(resumeFile);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            snapshot => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadProgress(progress);
            },
            error => {
              console.error("Upload error:", error);
              reject(error);
            },
            async () => {
              resumeURL = await uploadTask.snapshot.ref.getDownloadURL();
              resolve();
            }
          );
        });
      }

      // Save the application details along with the resume URL in Firestore
      await firestore
        .collection("jobs")
        .doc(jobId)
        .collection("applications")
        .add({
          firstName,
          lastName,
          email,
          phone,
          currentRole,
          yearsExperience,
          countryOfResidence,
          koreanFluency,
          resumeURL,
          coverLetter,
          willingToRelocate,
          appliedAt: new Date(),
        });

      setMessage("Application submitted successfully!");
      // Reset fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCurrentRole("");
      setResumeFile(null);
      setCountryOfResidence("South Korea");
      setCoverLetter("");
      setKoreanFluency("Beginner");
      setWillingToRelocate("Maybe");
      setYearsExperience("0-1");
      setUploadProgress(0);

      // Reset errors
      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        resumeFile: "",
        coverLetter: "",
        currentRole: "",
        yearsExperience: "",
        countryOfResidence: "",
        koreanFluency: "",
      });
    } catch (err) {
      console.error("Error submitting application:", err);
      setMessage("There was an error submitting your application.");
    }
  };

  return (
    <div className="card p-3" style={{ marginBlockEnd: 24 }}>
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
            onBlur={() => validateField("firstName", firstName)}
          />
          {errors.firstName && (
            <small className="text-danger">{errors.firstName}</small>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            onBlur={() => validateField("lastName", lastName)}
          />
          {errors.lastName && (
            <small className="text-danger">{errors.lastName}</small>
          )}
        </div>

        {/* Email Address */}
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => validateField("email", email)}
          />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onBlur={() => validateField("phone", phone)}
          />
          {errors.phone && (
            <small className="text-danger">{errors.phone}</small>
          )}
        </div>

        {/* Resume Upload */}
        <div className="mb-3">
          <label className="form-label">Resume Upload</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            onBlur={() => validateField("resumeFile", resumeFile)}
          />
          {errors.resumeFile && (
            <small className="text-danger">{errors.resumeFile}</small>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mb-3">
          <label className="form-label">Cover Letter</label>
          <textarea
            style={{ height: "200px" }}
            className="form-control"
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            onBlur={() => validateField("coverLetter", coverLetter)}
          />
          {errors.coverLetter && (
            <small className="text-danger">{errors.coverLetter}</small>
          )}
        </div>

        {/* Current Role */}
        <div className="mb-3">
          <label className="form-label">Current Role</label>
          <input
            type="text"
            className="form-control"
            value={currentRole}
            onChange={e => setCurrentRole(e.target.value)}
            onBlur={() => validateField("currentRole", currentRole)}
          />
          {errors.currentRole && (
            <small className="text-danger">{errors.currentRole}</small>
          )}
        </div>

        {/* Years of Experience Dropdown */}
        <div className="mb-3">
          <label className="form-label">
            Years of Experience Related To Job
          </label>
          <select
            className="form-select"
            value={yearsExperience}
            onChange={e => setYearsExperience(e.target.value)}
            onBlur={() => validateField("yearsExperience", yearsExperience)}
          >
            <option value="0-1">0-1 Years</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
          {errors.yearsExperience && (
            <small className="text-danger">{errors.yearsExperience}</small>
          )}
        </div>

        {/* Country of Residence (Dropdown) */}
        <div className="mb-3">
          <label className="form-label">Country of Residence</label>
          <select
            className="form-select"
            value={countryOfResidence}
            onChange={e => setCountryOfResidence(e.target.value)}
            onBlur={() =>
              validateField("countryOfResidence", countryOfResidence)
            }
          >
            <option value="South Korea">South Korea</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Japan">Japan</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Other">Other</option>
          </select>
          {errors.countryOfResidence && (
            <small className="text-danger">{errors.countryOfResidence}</small>
          )}
        </div>

        {/* Korean Fluency */}
        <div className="mb-3">
          <label className="form-label">Korean Fluency</label>
          <select
            className="form-select"
            value={koreanFluency}
            onChange={e => setKoreanFluency(e.target.value)}
            onBlur={() => validateField("koreanFluency", koreanFluency)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Fluent">Fluent</option>
          </select>
          {errors.koreanFluency && (
            <small className="text-danger">{errors.koreanFluency}</small>
          )}
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

        {uploadProgress > 0 && (
          <div className="mt-1">Upload Progress: {uploadProgress}%</div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={!isFormValid()}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
