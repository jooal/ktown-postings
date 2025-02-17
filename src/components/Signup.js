// src/components/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase, { auth, firestore } from "../firebase";

const SignUp = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async e => {
    e.preventDefault();
    setError("");
    try {
      // Create a new user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      // Save additional company profile data to Firestore
      await firestore.collection("companies").doc(user.uid).set({
        companyName,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Optionally, update the user's display name
      await user.updateProfile({ displayName: companyName });

      // Redirect the new user to the dashboard or another page
      navigate("/dashboard");
    } catch (err) {
      console.error("SignUp Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Company Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password (min 6 characters)</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
