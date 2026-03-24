import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OpportunityForm from "./pages/OpportunityForm";
import ViewOpportunities from "./pages/ViewOpportunities";

import "./App.css";

// Private Route
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Add Opportunity */}
          <Route
            path="/add-opportunity"
            element={
              <PrivateRoute>
                <OpportunityForm />
              </PrivateRoute>
            }
          />

          {/* Edit Opportunity */}
          <Route
            path="/edit-opportunity/:id"
            element={
              <PrivateRoute>
                <OpportunityForm />
              </PrivateRoute>
            }
          />

          {/* View Opportunities */}
          <Route
            path="/view-opportunities"
            element={
              <PrivateRoute>
                <ViewOpportunities />
              </PrivateRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;