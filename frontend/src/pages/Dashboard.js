import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ✅ NEW

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels // ✅ REGISTER
);

const API = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const getSuccessStatus = () => {
    switch (role) {
      case "Student": return "Offer Received";
      case "Sales Head": return "Closed Won";
      case "Investor": return "Investment Made";
      case "Project Manager": return "Completed";
      default: return "Closed Won";
    }
  };

  const getCategories = () => {
    switch (role) {
      case "Student": return ["Job", "Internship", "Scholarship"];
      case "Sales Head": return ["Lead", "Deal", "Partnership"];
      case "Investor": return ["Stock", "Real Estate", "Startup", "Mutual Fund"];
      case "Project Manager": return ["Bid", "Contract", "Event"];
      default: return ["General"];
    }
  };

  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const total = opportunities.length;
  const successStatus = getSuccessStatus();
  const success = opportunities.filter((o) => o.status === successStatus).length;
  const successRate = total ? ((success / total) * 100).toFixed(1) : 0;
  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);

  const open = opportunities.filter((o) => o.status === "Open").length;
  const inProgress = opportunities.filter((o) =>
    ["In Progress", "Interview Scheduled", "Negotiation", "Researching"].includes(o.status)
  ).length;
  const rejected = opportunities.filter((o) =>
    ["Rejected", "Closed Lost", "Cancelled"].includes(o.status)
  ).length;

  // ================== CHART DATA ==================

  const barData = {
    labels: ["Open", "In Progress", successStatus, "Rejected"],
    datasets: [
      {
        label: "Status",
        data: [open, inProgress, success, rejected],
        backgroundColor: ["#007BFF", "#FFC107", "#28A745", "#DC3545"],
      },
    ],
  };

  const pieData = {
    labels: [successStatus, "Remaining"],
    datasets: [
      {
        data: [successRate, 100 - successRate],
        backgroundColor: ["#28A745", "#6C757D"],
      },
    ],
  };

  const categoryData = {
    labels: getCategories(),
    datasets: [
      {
        data: getCategories().map(
          (cat) => opportunities.filter((o) => o.category === cat).length
        ),
        backgroundColor: ["#6610f2", "#e83e8c", "#fd7e14", "#20c997"],
      },
    ],
  };

  // ================== OPTIONS ==================

  const barOptions = {
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#000",
        font: { weight: "bold" },
        formatter: (value) => (value === 0 ? "" : value),
      },
    },
  };

  const pieOptions = {
    plugins: {
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 14 },
        formatter: (value) => value + "%",
      },
    },
  };

  const doughnutOptions = {
    plugins: {
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 12 },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return value > 0 ? `${label}: ${value}` : "";
        },
      },
    },
  };

  const getRoleTitle = () => {
    switch (role) {
      case "Student": return "Job Opportunities";
      case "Sales Head": return "Sales Leads";
      case "Investor": return "Investments";
      case "Project Manager": return "Project Bids";
      default: return "Opportunities";
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{getRoleTitle()} Dashboard</h1>
        <div>
          <button
            className="add-btn"
            onClick={() => navigate("/add-opportunity")}
            style={{ marginRight: "10px", backgroundColor: "#17a2b8" }}
          >
            + Add Opportunity
          </button>

          <button
            className="view-btn"
            onClick={() => navigate("/view-opportunities")}
            style={{ marginRight: "10px", backgroundColor: "#17a2b8" }}
          >
            View Opportunities
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ backgroundColor: "red" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card">
          <h3>{successStatus}</h3>
          <p style={{ color: "#28A745" }}>{success}</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p>{successRate}%</p>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <p>${totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <Bar data={barData} options={barOptions} plugins={[ChartDataLabels]} />
        </div>

        <div className="chart-card">
          <h3>Success Rate</h3>
          <Pie data={pieData} options={pieOptions} plugins={[ChartDataLabels]} />
        </div>

        <div className="chart-card">
          <h3>Category Distribution</h3>
          <Doughnut
            data={categoryData}
            options={doughnutOptions}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;