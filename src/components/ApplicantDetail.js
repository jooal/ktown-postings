// src/components/ApplicationDetail.js
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { useParams, Link } from "react-router-dom";

const ApplicationDetail = () => {
  const { jobId, applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  // For the paywall modal
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  // const [jobTitle, setJobTitle] = useState("");

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

  // 2. Fetch the Job (to get its title)
  // useEffect(() => {
  //   const fetchJob = async () => {
  //     try {
  //       const jobDoc = await firestore.collection("jobs").doc(jobId).get();
  //       if (jobDoc.exists) {
  //         const jobData = jobDoc.data();
  //         setJobTitle(jobData.title || "");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching job title:", err);
  //     } finally {
  //       // Once both fetches are done, we consider loading false
  //       setLoading(false);
  //     }
  //   };
  //   fetchJob();
  // }, [jobId]);

  if (loading) return <div>Loading application details...</div>;
  if (!application) return <div>Application not found.</div>;

  // Mock function to simulate payment and update Firestore
  const handlePayNow = async () => {
    try {
      // Mark this applicant as paid in Firestore
      const docRef = firestore
        .collection("jobs")
        .doc(jobId)
        .collection("applications")
        .doc(applicationId);

      await docRef.update({ paid: true });

      // Re-fetch the doc so we see paid = true
      const updatedDoc = await docRef.get();
      setApplication(updatedDoc.data());
      setShowModal(false);
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const handleCopyEmail = async email => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      // Hide the "Copied!" text after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  console.log("workhistory", application.workHistory);

  return (
    <>
      <Link to={`/dashboard/job/${jobId}`} className="btn btn-primary my-3">
        Back to Job Posting
      </Link>
      <div>
        {application.paid ? (
          <h3>
            {application.firstName} {application.lastName}
            <hr />
          </h3>
        ) : (
          <h3>Application Details</h3>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <p>
            <strong style={{ fontSize: "16px" }}>Applicant Info</strong>
          </p>
          <div className="row-flex">
            <p className="label">Country of Residence: </p>
            <p>{application.countryOfResidence || "Unavailable"}</p>
          </div>
          <div className="row-flex">
            <p className="label">Current Role:</p>
            <p>{application.currentRole || "N/A"}</p>
          </div>
          <div className="row-flex">
            <p className="label">Years of Experience:</p>
            <p>{application.yearsExperience || "N/A"}</p>
          </div>
          <div className="row-flex">
            <p className="label">Korean Fluency:</p>
            <p> {application.koreanFluency || "N/A"}</p>
          </div>
          <div className="row-flex">
            <p className="label">Willing to Relocate:</p>
            <p>{application.willingToRelocate || "N/A"}</p>
          </div>
        </div>
        <hr />

        <h4>Work History</h4>
        {application.workHistory && (
          <div>
            <h4>Work History</h4>
            <p>{application.workHistory}</p>
          </div>
        )}

        {application.paid ? (
          <div>
            <p>
              <strong>Email:</strong> {application.email}
              {/* Copy button */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginLeft: "10px",
                }}
              >
                {/* "Copied!" text above the button if copied is true */}
                {copied && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-25px",
                      left: 0,
                      backgroundColor: "#fff",
                      color: "green",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      boxShadow: "0 0 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    Copied!
                  </span>
                )}
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleCopyEmail(application.email)}
                >
                  Copy
                </button>
              </div>
              {/* Open mail button */}
              <a
                className="btn btn-outline-primary btn-sm ms-2"
                href={`mailto:${application.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Mail
              </a>
            </p>
            <p>
              <strong>Phone:</strong>
            </p>
          </div>
        ) : (
          <p>
            <em>Pay to unlock full contact details.</em>
          </p>
        )}
        <hr />
        {/* Display work history or non-sensitive info */}

        <p>
          <p>{application.coverLetter || "No cover letter."}</p>
        </p>
        <hr />

        <p>
          <strong>Resume</strong>
        </p>
        {/* If they've paid, show the "Download Resume" button; otherwise show a paywall button */}
        {application.paid ? (
          application.resumeURL ? (
            <p>
              <a
                href={application.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success"
              >
                View Resume
              </a>
            </p>
          ) : (
            <p>No resume uploaded.</p>
          )
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Access This Applicant
          </button>
        )}

        {/* Payment Confirmation Modal */}
        {showModal && (
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
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "4px",
                maxWidth: "400px",
                width: "100%",
                display: "grid",
                gap: "12px",
              }}
            >
              <h5>Confirm Payment</h5>
              <p>Pay now to unlock this applicant’s resume and contact info?</p>
              <button className="btn btn-success" onClick={handlePayNow}>
                Pay Now
              </button>
              <button
                className="btn btn-outline-secondary"
                style={{ color: "black" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationDetail;
