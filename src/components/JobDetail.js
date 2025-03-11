// src/components/JobDetail.js
import React, { useEffect, useState } from "react";
import { firestore, auth } from "../firebase";
import { useParams, Link, useNavigate } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";

const JobDetail = () => {
  const { id } = useParams(); // job id
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for the current authenticated user
  const [currentUser, setCurrentUser] = useState(null);

  // State for applicants (if this is the company's posting)
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);

  // Fetch the job posting details
  useEffect(() => {
    const fetchJob = async () => {
      const doc = await firestore.collection("jobs").doc(id).get();
      if (doc.exists) {
        setJob({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  // Listen for auth state changes to set currentUser
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // If the job is loaded and the logged-in user is the owner,
  // fetch the list of applicants.
  useEffect(() => {
    if (job && currentUser && job.companyId === currentUser.uid) {
      const unsubscribe = firestore
        .collection("jobs")
        .doc(id)
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
      // If not the company's posting, ensure applicants loading is complete.
      setLoadingApplicants(false);
    }
  }, [job, currentUser, id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <button
        type="button"
        style={{ marginBlockEnd: "24px" }}
        className="btn btn-primary"
        onClick={handleBack}
      >
        Back to jobs
      </button>
      <h2>{job.title}</h2>
      <p>
        Posted:
        {job.createdAt.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <hr />
      {currentUser && job.companyId === currentUser.uid ? (
        // If this is the company's own posting, show list of applicants.
        <div>
          <h3>Applicants</h3>
          {loadingApplicants ? (
            <p>Loading applicants...</p>
          ) : applicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            <ul className="list-group">
              {applicants.map(app => (
                <li
                  key={app.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Link to={`/dashboard/job/${id}/applicants/${app.id}`}>
                      {app.firstName} {app.lastName}
                    </Link>
                  </div>
                  <div>
                    {app.paid ? (
                      <span className="badge bg-success">Paid</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Unpaid</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        // Otherwise, show the default application form.
        <ApplicationForm jobId={id} />
      )}
    </div>
  );
};

export default JobDetail;
