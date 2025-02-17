// src/components/JobApplicants.js
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { Link, useParams } from "react-router-dom";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setApplications(apps);
        setLoading(false);
      });
    return () => unsubscribe();
  }, [jobId]);

  if (loading) return <div>Loading applications...</div>;

  return (
    <div>
      <h3>Applicants for this Job</h3>
      {applications.length === 0 ? (
        <div>No applications yet.</div>
      ) : (
        <ul className="list-group">
          {applications.map(app => (
            <li key={app.id} className="list-group-item">
              <Link to={`/dashboard/job/${jobId}/applicants/${app.id}`}>
                {app.firstName} {app.lastName} - {app.email}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplicants;
