// src/components/JobList.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const JobList = ({ jobs }) => {
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Filter jobs by title or location (simple case-insensitive search)
  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        style={{ marginBlockEnd: "24px" }}
        className="btn btn-primary"
        onClick={handleBack}
      >
        Back to jobs
      </button>
      <div>
        <input
          type="text"
          placeholder="Filter jobs..."
          className="form-control mb-3"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filteredJobs.length > 0 ? (
          <ul className="list-group">
            {filteredJobs.map(job => (
              <li
                key={job.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <Link to={`/dashboard/job/${job.id}`}>
                  {job.title} - {job.location}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </>
  );
};

export default JobList;
