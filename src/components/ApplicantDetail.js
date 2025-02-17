// src/components/ApplicationDetail.js
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { useParams, Link } from "react-router-dom";

const ApplicationDetail = () => {
  const { jobId, applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const docRef = firestore
          .collection("jobs")
          .doc(jobId)
          .collection("applications")
          .doc(applicationId);
        const doc = await docRef.get();
        if (doc.exists) {
          setApplication(doc.data());
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      }
      setLoading(false);
    };
    fetchApplication();
  }, [jobId, applicationId]);

  if (loading) return <div>Loading application details...</div>;
  if (!application) return <div>Application not found.</div>;

  return (
    <div>
      <h3>Application Details</h3>
      <p>
        <strong>Applicant Name:</strong> {application.firstName}{" "}
        {application.lastName}
      </p>
      <p>
        <strong>Email:</strong> {application.email}
      </p>
      <p>
        <strong>Resume File:</strong> {application.resumeFileName || "N/A"}
      </p>
      <p>
        <strong>Cover Letter:</strong>
      </p>
      <p>{application.coverLetter}</p>
      <p>
        <strong>Willing to Relocate:</strong> {application.willingToRelocate}
      </p>
      <Link to={`/dashboard/job/${jobId}`} className="btn btn-secondary">
        Back to Job Posting
      </Link>
    </div>
  );
};

export default ApplicationDetail;
