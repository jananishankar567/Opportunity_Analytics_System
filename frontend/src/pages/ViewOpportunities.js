import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function ViewOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch Opportunities
  const fetchOpportunities = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/opportunities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setOpportunities(data);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  }, [API_URL, token]);

  // Load data when page loads
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Delete Opportunity
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/opportunities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOpportunities(); // Refresh table
    } catch (error) {
      console.error("Error deleting opportunity:", error);
    }
  };

  // Edit Opportunity
  const handleEdit = (id) => {
    navigate(`/edit-opportunity/${id}`);
  };

  return (
    <div className="view-container">

      {/* 🔥 Header with Back Button */}
      <div className="view-header">
       <button
  onClick={() => navigate("/dashboard")}
  style={{
    fontSize: "28px",   // 👈 increase size
    color: "black",     // 👈 black color
    background: "none",
    border: "none",
    cursor: "pointer"
  }}
>
  ←
</button>

        <h2 className="view-title">View Opportunities</h2>
      </div>

      <table className="opportunity-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Value</th>
            <th>Deadline</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <tr key={opp._id}>
                <td>{opp.title}</td>
                <td>{opp.category}</td>
                <td>{opp.status}</td>
                <td>₹{opp.value}</td>
                <td>
                  {opp.deadline
                    ? new Date(opp.deadline).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{opp.description}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(opp._id)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(opp._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No opportunities found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewOpportunities;