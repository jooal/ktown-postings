// src/components/CompanyJobDetail.js
import React, { useEffect, useState } from "react";
import { firestore, auth } from "../firebase";
import { useParams, Link } from "react-router-dom";

const CompanyJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);

  // Fetch the job posting details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const doc = await firestore.collection("jobs").doc(jobId).get();
        if (doc.exists) {
          setJob({ id: doc.id, ...doc.data() });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      }
      setLoadingJob(false);
    };
    fetchJob();
  }, [jobId]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // If the logged-in user is the owner of the job posting, fetch the list of applicants.
  useEffect(() => {
    if (job && currentUser && job.companyId === currentUser.uid) {
      const unsubscribe = firestore
        .collection("jobs")
        .doc(jobId)
        .collection("applications")
        .orderBy("appliedAt", "desc")
        .onSnapshot(snapshot => {
          const apps = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setApplicants(apps);
          setLoadingApplicants(false);
        });
      return () => unsubscribe();
    } else {
      setLoadingApplicants(false);
    }
  }, [job, currentUser, jobId]);

  if (loadingJob) return <p>Loading job posting...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>{job.description}</p>
      <hr />
      {currentUser && job.companyId === currentUser.uid ? (
        <div>
          <h3>Applicants</h3>
          {loadingApplicants ? (
            <p>Loading applicants...</p>
          ) : applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            <ul className="list-group">
              {applicants.map(app => (
                <li key={app.id} className="list-group-item">
                  <Link to={`/dashboard/job/${jobId}/applicants/${app.id}`}>
                    {app.firstName} {app.lastName} - {app.email}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>
          You do not have permission to view the applicants for this job
          posting.
        </p>
      )}
    </div>
  );
};

export default CompanyJobDetail;
