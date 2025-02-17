// src/components/JobList.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const JobList = ({ jobs }) => {
  const [filter, setFilter] = useState("");

  // Filter jobs by title or location (simple case-insensitive search)
  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
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
              <Link to={`/job/${job.id}`}>
                {job.title} - {job.location}
              </Link>
              {/* You can add extra buttons (like edit or delete) here if desired */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
};

export default JobList;
