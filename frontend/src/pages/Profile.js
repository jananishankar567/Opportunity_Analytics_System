// import { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import Sidebar from "../components/Sidebar";

// const API = process.env.REACT_APP_API_URL;

// function Profile() {
//   const { user, token, login } = useAuth();

//   const [form, setForm] = useState({
//     firstName: user?.firstName,
//     lastName: user?.lastName,
//     email: user?.email,
//   });

//   const handleUpdate = async () => {
//     try {
//       const res = await axios.put(
//         `${API}/auth/profile`,
//         form,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       login(token, res.data.role, res.data.user);
//       alert("Profile updated!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="layout">
//       <Sidebar />

//       <div className="profile-page">
//         <h2>Profile</h2>

//         <input
//           value={form.firstName}
//           onChange={(e) =>
//             setForm({ ...form, firstName: e.target.value })
//           }
//         />

//         <input
//           value={form.lastName}
//           onChange={(e) =>
//             setForm({ ...form, lastName: e.target.value })
//           }
//         />

//         <input value={form.email} disabled />

//         <button onClick={handleUpdate}>Update</button>
//       </div>
//     </div>
//   );
// }

// export default Profile;

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL;

function Profile() {
  const { user, token, login, role } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [editMode, setEditMode] = useState(false);

  // Load user data
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  // Update profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${API}/auth/profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      login(token, res.data.role, res.data.user);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="dashboard">
        <h2>My Profile</h2>

        <div className="profile-card">

          {/* Name */}
          <div className="profile-field">
            <label>First Name</label>
            {editMode ? (
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            ) : (
              <p>{form.firstName}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Last Name</label>
            {editMode ? (
              <input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            ) : (
              <p>{form.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="profile-field">
            <label>Email</label>
            <p>{form.email}</p>
          </div>

          {/* Role */}
          <div className="profile-field">
            <label>Role</label>
            <p>{role}</p>
          </div>

          {/* Buttons */}
          {!editMode ? (
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button  className="edit-btn"onClick={handleUpdate}>Save</button>
              <button className="edit-btn" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;