// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, role, logout } = useAuth();

//   return (
//     <div className="sidebar">
      
//       {/* App Title */}
//       <h2 className="sidebar-title">OAS</h2>

//       {/* User Info */}
//       <div className="sidebar-user">
//         <p className="user-name">
//           {user?.firstName} {user?.lastName}
//         </p>
//         <p className="user-role">{role}</p>
//       </div>

//       {/* Navigation */}
//       <ul className="sidebar-menu">
//         <li
//           className={location.pathname === "/dashboard" ? "active" : ""}
//           onClick={() => navigate("/dashboard")}
//         >
//           Dashboard
//         </li>

//         <li
//           className={location.pathname === "/view-opportunities" ? "active" : ""}
//           onClick={() => navigate("/view-opportunities")}
//         >
//           Opportunities
//         </li>

//         <li
//           className={location.pathname === "/add-opportunity" ? "active" : ""}
//           onClick={() => navigate("/add-opportunity")}
//         >
//           Add Opportunity
//         </li>

//         <li
//           className={location.pathname === "/profile" ? "active" : ""}
//           onClick={() => navigate("/profile")}
//         >
//           Profile
//         </li>
//       </ul>

//       {/* Logout */}
//       <button
//         className="sidebar-logout"
//         onClick={() => {
//           logout();
//           navigate("/");
//         }}
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role} = useAuth();

  return (
    <div className="sidebar">

      {/* REMOVE OAS TEXT */}

      {/* User Info */}
      <div className="sidebar-user">
        <p className="user-name">
          {user?.firstName || "User"} {user?.lastName || ""}
        </p>
        <p className="user-role">{role}</p>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        <li
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </li>

        <li
          className={location.pathname === "/profile" ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          Profile
        </li>
      </ul>

     
    </div>
  );
}

export default Sidebar;