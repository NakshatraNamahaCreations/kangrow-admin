// import React, { useState, useEffect, useRef } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import {
//   FaTachometerAlt,
//   FaUser,
//   FaImage,
//   FaUsers,
//   FaCloudUploadAlt,
//   FaSchool,
//   FaUniversity,
//   FaIndustry,
// } from "react-icons/fa";

// const sidebarLinks = [
//   { icon: FaTachometerAlt, label: "Dashboard", path: "/dashboard" },
//   { icon: FaSchool, label: "Schools Data", path: "/SchoolData" },
//   { icon: FaUniversity, label: "Institutes Data", path: "/InstitutesData" },
//   { icon: FaIndustry, label: "Industries Data", path: "/IndustriesData" },
//   { icon: FaUser, label: "User Data", path: "/user-data" },
//   { icon: FaImage, label: "Banner", path: "/banner" },
//   { icon: FaCloudUploadAlt, label: "Report Upload", path: "/report-upload" },
//   { icon: FaUsers, label: "Teams", path: "/teams" },
// ];

// function Teams() {
//   const [teams, setTeams] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalData, setModalData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "staff",
//     status: "active",
//     selectedSidebarLinks: [],
//   });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const itemsPerPage = 5;

//   const fileInputRefs = useRef([]);

//   useEffect(() => {
//     fetchTeams();
//   }, [currentPage]);

//   const fetchTeams = async () => {
//     try {
//       const response = await axios.get("http://192.168.1.230:8011/api/teams");
//       setTeams(response.data.members);
//       setTotalPages(Math.ceil(response.data.members.length / itemsPerPage));
//     } catch (error) {
//       console.error("Error fetching teams:", error);
//     }
//   };

//   const openModal = (member = null) => {
//     if (member) {
//       setIsEditMode(true);
//       setModalData({
//         id: member._id,
//         name: member.name,
//         email: member.email,
//         password: "",
//         role: member.role,
//         status: member.status,
//         selectedSidebarLinks: member.selectedSidebarLinks || [],
//       });
//     } else {
//       setIsEditMode(false);
//       setModalData({
//         name: "",
//         email: "",
//         password: "",
//         role: "staff",
//         status: "active",
//         selectedSidebarLinks: [],
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...modalData };
//       if (isEditMode) {
//         const { password, ...updateData } = modalData;
//         const response = await axios.put(
//           `http://192.168.1.230:8011/api/teams/update/${modalData.id}`,
//           payload
//         );
//         setTeams(
//           teams.map((team) =>
//             team._id === modalData.id ? response.data.member : team
//           )
//         );
//       } else {
//         if (!modalData.password) {
//           alert("Password is required for new team members");
//           return;
//         }
//         const response = await axios.post(
//           "http://192.168.1.230:8011/api/teams/create",
//           payload
//         );
//         setTeams([response.data.member, ...teams]);
//       }
//       setIsModalOpen(false);
//       fetchTeams();
//     } catch (error) {
//       alert(error.response?.data?.error || "An error occurred");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this team member?")) {
//       try {
//         await axios.delete(`http://192.168.1.230:8011/api/teams/delete/${id}`);
//         setTeams(teams.filter((team) => team._id !== id));
//         fetchTeams();
//       } catch (error) {
//         alert(error.response?.data?.error || "An error occurred");
//       }
//     }
//   };

//   const handleStatusToggle = async (id, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     try {
//       const response = await axios.put(
//         `http://192.168.1.230:8011/api/teams/update/${id}`,
//         { status: newStatus }
//       );
//       setTeams(
//         teams.map((team) => (team._id === id ? response.data.member : team))
//       );
//     } catch (error) {
//       alert(error.response?.data?.error || "An error occurred");
//     }
//   };

//   const handleImageChange = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       const updatedTeams = [...teams];
//       updatedTeams[index].image = imageUrl;
//       setTeams(updatedTeams);
//     }
//   };

//   const handleSidebarLinkChange = (e, linkLabel) => {
//     const isChecked = e.target.checked;
//     setModalData((prevData) => {
//       const updatedLinks = isChecked
//         ? [...prevData.selectedSidebarLinks, linkLabel]
//         : prevData.selectedSidebarLinks.filter((label) => label !== linkLabel);
//       return { ...prevData, selectedSidebarLinks: updatedLinks };
//     });
//   };

//   const paginatedTeams = teams.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const filteredTeams = paginatedTeams.filter(
//     (team) =>
//       team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       team.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={containerStyle}>
//       <div style={headerStyle}>
//         <button style={addBtnStyle} onClick={() => openModal()}>
//           + Add Team Member
//         </button>
//         <input
//           type="text"
//           placeholder="Search by name or email"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={searchInputStyle}
//         />
//       </div>

//       <table style={tableStyle}>
//         <thead>
//           <tr style={theadRowStyle}>
//             <th style={thStyle}>SN</th>
//             <th style={thStyle}>Image</th>
//             <th style={thStyle}>Name</th>
//             <th style={thStyle}>Email</th>
//             <th style={thStyle}>Role</th>
//             <th style={thStyle}>Status</th>
//             <th style={thStyle}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredTeams.map((team, index) => (
//             <tr key={team._id} style={tbodyRowStyle}>
//               <td style={tdStyle}>
//                 {String((currentPage - 1) * itemsPerPage + index + 1).padStart(
//                   2,
//                   "0"
//                 )}
//               </td>
//               <td style={tdStyle}>
//                 <div
//                   style={{ ...avatarWrapper, cursor: "pointer" }}
//                   onClick={() => fileInputRefs.current[index]?.click()}
//                 >
//                   <img
//                     src={
//                       team.image
//                         ? team.image
//                         : `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                             team.name
//                           )}&background=random&color=fff`
//                     }
//                     alt="avatar"
//                     style={avatarStyle}
//                   />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     style={{ display: "none" }}
//                     ref={(el) => (fileInputRefs.current[index] = el)}
//                     onChange={(e) => handleImageChange(e, index)}
//                   />
//                 </div>
//               </td>
//               <td style={tdStyle}>{team.name}</td>
//               <td style={tdStyle}>{team.email}</td>
//               <td style={tdStyle}>
//                 <span style={statusBadge}>
//                   {team.role.charAt(0).toUpperCase() + team.role.slice(1)}
//                 </span>
//               </td>
//               <td style={tdStyle}>
//                 <button
//                   style={{
//                     ...statusBadge,
//                     backgroundColor:
//                       team.status === "active" ? "#ecfdf5" : "#fee2e2",
//                     color: team.status === "active" ? "#047857" : "#b91c1c",
//                   }}
//                   onClick={() => handleStatusToggle(team._id, team.status)}
//                 >
//                   {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
//                 </button>
//               </td>
//               <td style={{ ...tdStyle, textAlign: "center" }}>
//                 <button
//                   style={editBtn}
//                   onClick={() => openModal(team)}
//                   title="Edit"
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   style={deleteBtn}
//                   onClick={() => handleDelete(team._id)}
//                   title="Delete"
//                 >
//                   <FaTrash />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div style={paginationStyle}>
//         <button
//           style={paginationBtnStyle}
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span style={{ margin: "0 10px" }}>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           style={paginationBtnStyle}
//           onClick={() =>
//             setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//           }
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {isModalOpen && (
//         <div style={modalOverlayStyle}>
//           <div style={modalStyle}>
//             <h2 style={{ marginBottom: "20px" }}>
//               {isEditMode ? "Edit Team Member" : "Add Team Member"}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <div style={{ display: "flex", gap: "20px" }}>
//                 <div style={{ flex: 1 }}>
//                   <div style={formGroupStyle}>
//                     <label style={labelStyle}>Name</label>
//                     <input
//                       type="text"
//                       value={modalData.name}
//                       onChange={(e) =>
//                         setModalData({ ...modalData, name: e.target.value })
//                       }
//                       style={inputStyle}
//                       required
//                     />
//                   </div>
//                   <div style={formGroupStyle}>
//                     <label style={labelStyle}>Email</label>
//                     <input
//                       type="email"
//                       value={modalData.email}
//                       onChange={(e) =>
//                         setModalData({ ...modalData, email: e.target.value })
//                       }
//                       style={inputStyle}
//                       required
//                     />
//                   </div>
//                   <div style={formGroupStyle}>
//                     <label style={labelStyle}>
//                       Password {isEditMode && "(Optional)"}
//                     </label>
//                     <input
//                       type="password"
//                       value={modalData.password}
//                       onChange={(e) =>
//                         setModalData({ ...modalData, password: e.target.value })
//                       }
//                       style={inputStyle}
//                       required={!isEditMode}
//                       placeholder={
//                         isEditMode
//                           ? "Enter new password (optional)"
//                           : "Enter password"
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={formGroupStyle}>
//                     <label style={labelStyle}>Role</label>
//                     <select
//                       value={modalData.role}
//                       onChange={(e) =>
//                         setModalData({ ...modalData, role: e.target.value })
//                       }
//                       style={inputStyle}
//                     >
//                       <option value="admin">Admin</option>
//                       <option value="manager">Manager</option>
//                       <option value="staff">Staff</option>
//                     </select>
//                   </div>
//                   <div style={formGroupStyle}>
//                     <label style={labelStyle}>Status</label>
//                     <select
//                       value={modalData.status}
//                       onChange={(e) =>
//                         setModalData({ ...modalData, status: e.target.value })
//                       }
//                       style={inputStyle}
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                   <div style={formGroupStyle}>
//                     <label style={labelStyle}>Sidebar Links</label>
//                     <div style={{ maxHeight: "100px", overflowY: "auto" }}>
//                       {sidebarLinks.map((link) => (
//                         <div key={link.label} style={{ marginBottom: "8px" }}>
//                           <input
//                             type="checkbox"
//                             checked={modalData.selectedSidebarLinks.includes(
//                               link.label
//                             )}
//                             onChange={(e) =>
//                               handleSidebarLinkChange(e, link.label)
//                             }
//                           />
//                           <span style={{ marginLeft: "8px" }}>
//                             {link.label}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div style={buttonGroupStyle}>
//                 <button type="submit" style={submitBtnStyle}>
//                   {isEditMode ? "Update" : "Create"}
//                 </button>
//                 <button
//                   type="button"
//                   style={cancelBtnStyle}
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const containerStyle = {
//   padding: "40px",
//   fontFamily: "Poppins, sans-serif",
//   backgroundColor: "#f9fafb",
//   minHeight: "100vh",
//   width: 1200,
//   marginLeft: "10%",
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: "24px",
//   marginTop: 40,
// };

// const addBtnStyle = {
//   backgroundColor: "#2F8988",
//   color: "#fff",
//   border: "none",
//   padding: "10px 16px",
//   borderRadius: "8px",
//   fontSize: "14px",
//   fontWeight: "500",
//   cursor: "pointer",
//   marginLeft: 30,
// };

// const searchInputStyle = {
//   padding: "10px 14px",
//   borderRadius: "28px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
//   outline: "none",
//   width: "260px",
// };

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   backgroundColor: "#fff",
//   borderRadius: "12px",
//   overflow: "hidden",
//   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
// };

// const theadRowStyle = {
//   backgroundColor: "#f3f4f6",
//   textAlign: "left",
// };

// const thStyle = {
//   padding: "16px",
//   fontSize: "14px",
//   color: "#374151",
//   fontWeight: 600,
// };

// const tbodyRowStyle = {
//   borderTop: "1px solid #e5e7eb",
// };

// const tdStyle = {
//   padding: "16px",
//   fontSize: "14px",
//   color: "#111827",
// };

// const avatarWrapper = {
//   display: "flex",
//   alignItems: "center",
// };

// const avatarStyle = {
//   width: "36px",
//   height: "36px",
//   borderRadius: "50%",
//   objectFit: "cover",
// };

// const statusBadge = {
//   backgroundColor: "#ecfdf5",
//   color: "#047857",
//   fontSize: "12px",
//   padding: "4px 10px",
//   borderRadius: "999px",
//   fontWeight: 600,
//   border: "none",
//   cursor: "pointer",
// };

// const editBtn = {
//   border: "none",
//   backgroundColor: "#e0f2fe",
//   color: "#0284c7",
//   padding: "8px",
//   borderRadius: "6px",
//   marginRight: "8px",
//   cursor: "pointer",
// };

// const deleteBtn = {
//   border: "none",
//   backgroundColor: "#fee2e2",
//   color: "#b91c1c",
//   padding: "8px",
//   borderRadius: "6px",
//   cursor: "pointer",
// };

// const paginationStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   marginTop: "20px",
// };

// const paginationBtnStyle = {
//   backgroundColor: "#2F8988",
//   color: "#fff",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "8px",
//   fontSize: "14px",
//   cursor: "pointer",
//   margin: "0 5px",
// };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "8px",
//   width: "600px",
//   maxWidth: "90%",
// };

// const formGroupStyle = {
//   marginBottom: "15px",
// };

// const labelStyle = {
//   display: "block",
//   marginBottom: "5px",
//   fontWeight: "500",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const buttonGroupStyle = {
//   display: "flex",
//   justifyContent: "flex-end",
//   gap: "10px",
//   marginTop: "20px",
// };

// const submitBtnStyle = {
//   backgroundColor: "#2F8988",
//   color: "#fff",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "4px",
//   cursor: "pointer",
// };

// const cancelBtnStyle = {
//   backgroundColor: "#e5e7eb",
//   color: "#374151",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "4px",
//   cursor: "pointer",
// };

// export default Teams;
import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import {
  FaTachometerAlt,
  FaUser,
  FaImage,
  FaUsers,
  FaCloudUploadAlt,
  FaSchool,
  FaUniversity,
  FaIndustry,
} from "react-icons/fa";

const sidebarLinks = [
  { icon: FaTachometerAlt, label: "Dashboard", path: "/dashboard" },
  { icon: FaSchool, label: "Schools Data", path: "/SchoolData" },
  { icon: FaUniversity, label: "Institutes Data", path: "/InstitutesData" },
  { icon: FaIndustry, label: "Industries Data", path: "/IndustriesData" },
  { icon: FaUser, label: "User Data", path: "/user-data" },
  { icon: FaImage, label: "Banner", path: "/banner" },
  { icon: FaCloudUploadAlt, label: "Report Upload", path: "/report-upload" },
  { icon: FaUsers, label: "Teams", path: "/teams" },
];

function Teams() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    status: "active",
    selectedSidebarLinks: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fileInputRefs = useRef([]);

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("https://api.svkangrowhealth.com/api/teams");
      const members = res.data.members || [];
      setTeams(members);
      setTotalPages(Math.ceil(members.length / itemsPerPage) || 1);
    } catch (error) {
      console.error("Error fetching teams:", error);
      alert(error.response?.data?.error || "Failed to load team members.");
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setIsEditMode(true);
      setModalData({
        id: member._id,
        name: member.name || "",
        email: member.email || "",
        password: "",
        role: member.role || "staff",
        status: member.status || "active",
        selectedSidebarLinks: member.selectedSidebarLinks || [],
      });
    } else {
      setIsEditMode(false);
      setModalData({
        name: "",
        email: "",
        password: "",
        role: "staff",
        status: "active",
        selectedSidebarLinks: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Require at least one access item
    if (
      !modalData.selectedSidebarLinks ||
      modalData.selectedSidebarLinks.length === 0
    ) {
      alert("Please select at least one access permission (sidebar link).");
      return;
    }

    try {
      if (isEditMode) {
        // Build payload without empty password
        const { id, password, ...rest } = modalData;
        const updateData = { ...rest };
        if (password && password.trim().length >= 6) {
          updateData.password = password.trim();
        }

        const response = await axios.put(
          `https://api.svkangrowhealth.com/api/teams/update/${modalData.id}`,
          updateData
        );

        setTeams((prev) =>
          prev.map((t) => (t._id === modalData.id ? response.data.member : t))
        );
      } else {
        if (!modalData.password || modalData.password.trim().length < 6) {
          alert(
            "Password is required (min 6 characters) for new team members."
          );
          return;
        }
        const payload = { ...modalData, password: modalData.password.trim() };
        const response = await axios.post(
          "http://192.168.1.230:8011/api/teams/create",
          payload
        );
        setTeams((prev) => [response.data.member, ...prev]);
      }

      setIsModalOpen(false);
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await axios.delete(`https://api.svkangrowhealth.com/api/teams/delete/${id}`);
        setTeams((prev) => prev.filter((t) => t._id !== id));
        fetchTeams();
      } catch (error) {
        alert(error.response?.data?.error || "An error occurred");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.put(
        `http://192.168.1.230:8011/api/teams/update/${id}`,
        { status: newStatus }
      );
      setTeams((prev) =>
        prev.map((t) => (t._id === id ? response.data.member : t))
      );
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTeams((prev) => {
        const copy = [...prev];
        copy[index].image = imageUrl;
        return copy;
      });
    }
  };

  const handleSidebarLinkChange = (e, linkLabel) => {
    const isChecked = e.target.checked;
    setModalData((prev) => {
      const set = new Set(prev.selectedSidebarLinks);
      if (isChecked) set.add(linkLabel);
      else set.delete(linkLabel);
      return { ...prev, selectedSidebarLinks: Array.from(set) };
    });
  };

  const paginatedTeams = teams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredTeams = paginatedTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={addBtnStyle} onClick={() => openModal()}>
          + Add Team Member
        </button>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={theadRowStyle}>
            <th style={thStyle}>SN</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeams.map((team, index) => (
            <tr key={team._id} style={tbodyRowStyle}>
              <td style={tdStyle}>
                {String((currentPage - 1) * itemsPerPage + index + 1).padStart(
                  2,
                  "0"
                )}
              </td>
              <td style={tdStyle}>
                <div
                  style={{ ...avatarWrapper, cursor: "pointer" }}
                  onClick={() => fileInputRefs.current[index]?.click()}
                >
                  <img
                    src={
                      team.image
                        ? team.image
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            team.name
                          )}&background=random&color=fff`
                    }
                    alt="avatar"
                    style={avatarStyle}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
              </td>
              <td style={tdStyle}>{team.name}</td>
              <td style={tdStyle}>{team.email}</td>
              <td style={tdStyle}>
                <span style={statusBadge}>
                  {team.role.charAt(0).toUpperCase() + team.role.slice(1)}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  style={{
                    ...statusBadge,
                    backgroundColor:
                      team.status === "active" ? "#ecfdf5" : "#fee2e2",
                    color: team.status === "active" ? "#047857" : "#b91c1c",
                  }}
                  onClick={() => handleStatusToggle(team._id, team.status)}
                >
                  {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                </button>
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <button
                  style={editBtn}
                  onClick={() => openModal(team)}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  style={deleteBtn}
                  onClick={() => handleDelete(team._id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={paginationStyle}>
        <button
          style={paginationBtnStyle}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          style={paginationBtnStyle}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: "20px" }}>
              {isEditMode ? "Edit Team Member" : "Add Team Member"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      value={modalData.name}
                      onChange={(e) =>
                        setModalData({ ...modalData, name: e.target.value })
                      }
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={modalData.email}
                      onChange={(e) =>
                        setModalData({ ...modalData, email: e.target.value })
                      }
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>
                      Password {isEditMode && "(Optional)"}
                    </label>
                    <input
                      type="password"
                      value={modalData.password}
                      onChange={(e) =>
                        setModalData({ ...modalData, password: e.target.value })
                      }
                      style={inputStyle}
                      required={!isEditMode}
                      placeholder={
                        isEditMode
                          ? "Enter new password (optional)"
                          : "Enter password"
                      }
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Role</label>
                    <select
                      value={modalData.role}
                      onChange={(e) =>
                        setModalData({ ...modalData, role: e.target.value })
                      }
                      style={inputStyle}
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Status</label>
                    <select
                      value={modalData.status}
                      onChange={(e) =>
                        setModalData({ ...modalData, status: e.target.value })
                      }
                      style={inputStyle}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Sidebar Links (Access)</label>
                    <div
                      style={{
                        maxHeight: "120px",
                        overflowY: "auto",
                        border: "1px solid #eee",
                        padding: "10px",
                        borderRadius: 6,
                      }}
                    >
                      {sidebarLinks.map((link) => (
                        <div key={link.label} style={{ marginBottom: "8px" }}>
                          <input
                            type="checkbox"
                            checked={modalData.selectedSidebarLinks.includes(
                              link.label
                            )}
                            onChange={(e) =>
                              handleSidebarLinkChange(e, link.label)
                            }
                            id={`chk-${link.label}`}
                          />
                          <label
                            htmlFor={`chk-${link.label}`}
                            style={{ marginLeft: 8, cursor: "pointer" }}
                          >
                            {link.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <small style={{ color: "#6b7280" }}>
                      Select at least one. If “Dashboard” is not selected, the
                      user won’t be able to open it.
                    </small>
                  </div>
                </div>
              </div>

              <div style={buttonGroupStyle}>
                <button
                  type="submit"
                  style={{
                    ...submitBtnStyle,
                    opacity:
                      modalData.selectedSidebarLinks.length === 0 ? 0.6 : 1,
                    cursor:
                      modalData.selectedSidebarLinks.length === 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={modalData.selectedSidebarLinks.length === 0}
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  style={cancelBtnStyle}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  padding: "40px",
  fontFamily: "Poppins, sans-serif",
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  width: 1200,
  marginLeft: "10%",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  marginTop: 40,
};

const addBtnStyle = {
  backgroundColor: "#2F8988",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  marginLeft: 30,
};

const searchInputStyle = {
  padding: "10px 14px",
  borderRadius: "28px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
  width: "260px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
};

const theadRowStyle = { backgroundColor: "#f3f4f6", textAlign: "left" };

const thStyle = {
  padding: "16px",
  fontSize: "14px",
  color: "#374151",
  fontWeight: 600,
};

const tbodyRowStyle = { borderTop: "1px solid #e5e7eb" };

const tdStyle = { padding: "16px", fontSize: "14px", color: "#111827" };

const avatarWrapper = { display: "flex", alignItems: "center" };

const avatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover",
};

const statusBadge = {
  backgroundColor: "#ecfdf5",
  color: "#047857",
  fontSize: "12px",
  padding: "4px 10px",
  borderRadius: "999px",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const editBtn = {
  border: "none",
  backgroundColor: "#e0f2fe",
  color: "#0284c7",
  padding: "8px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
};

const deleteBtn = {
  border: "none",
  backgroundColor: "#fee2e2",
  color: "#b91c1c",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
};

const paginationBtnStyle = {
  backgroundColor: "#2F8988",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  margin: "0 5px",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "600px",
  maxWidth: "90%",
};

const formGroupStyle = { marginBottom: "15px" };

const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "500" };

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px",
};

const submitBtnStyle = {
  backgroundColor: "#2F8988",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
};

const cancelBtnStyle = {
  backgroundColor: "#e5e7eb",
  color: "#374151",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Teams;
