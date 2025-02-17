// src/components/Home.js
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to all job postings, ordered by creation date
    const unsubscribe = firestore
      .collection("jobs")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        const jobsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobsData);
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading job listings...</div>;

  return (
    <div>
      <h2>Job Listings</h2>
      {jobs.length === 0 ? (
        <div>No job postings available at the moment.</div>
      ) : (
        jobs.map(job => (
          <Link
            key={job.id}
            to={`/job/${job.id}`}
            className="text-decoration-none text-dark"
          >
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">{job.title}</h4>
                <p className="card-text">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="card-text">{job.description}</p>
                <button className="btn btn-primary">Apply</button>
                {/* You can also include the ApplicationForm here if desired */}
                {/* <ApplicationForm jobId={job.id} /> */}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Home;
