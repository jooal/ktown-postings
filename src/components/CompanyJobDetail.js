// src/components/CompanyJobDetail.js
import React, { useEffect, useState } from "react";
import { firestore, auth } from "../firebase";
import { useParams, Link, useNavigate } from "react-router-dom";

const CompanyJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const navigate = useNavigate();

  // For delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = jobId => {
    navigate(`/edit-job/${jobId}`);
  };

  // Open the delete confirmation modal
  const openDeleteModal = jobId => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  // Close the modal without deleting
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  // Actually delete the job from Firestore
  const handleDeleteConfirmed = async () => {
    if (!jobToDelete) return;
    try {
      await firestore.collection("jobs").doc(jobToDelete).delete();
      alert("Job deleted successfully!");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job.");
    }
    closeDeleteModal();
  };

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          style={{ marginBlockEnd: "24px" }}
          className="btn btn-primary"
          onClick={handleBack}
        >
          Back to jobs
        </button>
        <div>
          {/* Edit Button */}
          <button
            style={{ color: "black" }}
            className="btn btn-secondary me-2"
            onClick={() => handleEdit(job.id)}
          >
            Edit
          </button>
          {/* Delete Button */}
          <button
            className="btn btn-danger"
            onClick={() => openDeleteModal(job.id)}
          >
            Delete
          </button>
        </div>
      </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "16px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h5>Confirm Deletion</h5>
            <p>
              Are you sure you want to delete this job? This will be permanent.
            </p>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary me-2"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirmed}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobDetail;
