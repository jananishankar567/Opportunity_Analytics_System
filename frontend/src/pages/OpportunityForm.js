import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

function OpportunityForm() {
  const { id } = useParams();
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    status: "Open",
    deadline: "",
    value: "",
    description: "",
  });

  const isEditMode = id ? true : false;

  // Fetch data when editing
  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`${API}/opportunities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setForm({
          title: data.title || "",
          category: data.category || "",
          status: data.status || "Open",
          value: data.value || "",
          deadline: data.deadline ? data.deadline.substring(0, 10) : "",
          description: data.description || "",
        });

      } catch (err) {
        console.error("Error fetching opportunity:", err);
        alert("Failed to load opportunity data");
      }
    };

    fetchOpportunity();
  }, [id, token]);

  const roleTitle = () => {
    switch (role) {
      case "Student": return "Job";
      case "Sales Head": return "Sales Lead";
      case "Investor": return "Investment";
      case "Project Manager": return "Project";
      default: return "Opportunity";
    }
  };

  const getCategories = () => {
    switch (role) {
      case "Student": return ["Job", "Internship", "Scholarship"];
      case "Sales Head": return ["Lead", "Deal", "Partnership"];
      case "Investor": return ["Stock", "Real Estate", "Startup"];
      case "Project Manager": return ["Bid", "Contract", "Event"];
      default: return ["General"];
    }
  };

  const getStatuses = () => {
    switch (role) {
      case "Student":
        return ["Open", "Applied", "Interview", "Offer", "Rejected"];
      case "Sales Head":
        return ["Open", "Contacted", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
      case "Investor":
        return ["Open", "Researching", "Due Diligence", "Invested", "Rejected"];
      case "Project Manager":
        return ["Open", "Planning", "In Progress", "Completed", "Cancelled"];
      default:
        return ["Open", "In Progress", "Completed"];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await axios.put(`${API}/opportunities/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Opportunity updated successfully");
      } else {
        await axios.post(`${API}/opportunities`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Opportunity added successfully");
      }

      navigate("/view-opportunities");

    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">

        {/* 🔥 Updated Header with Back Arrow */}
        <div className="card-header">
          <span
            className="back-arrow"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </span>

          <h2>{isEditMode ? "Edit" : "Add"} {roleTitle()}</h2>

          <span className="role-badge">{role}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {getCategories().map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {getStatuses().map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/view-opportunities")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OpportunityForm;