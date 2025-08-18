// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import indus from "../assets/images/indus.png"; // 🏭 Industry icon
// import industry from "../assets/images/industry.png"; // 🏭 Industry illustration

// function IndustriesData() {
//   const [industries, setIndustries] = useState([]);
//   const [newIndustry, setNewIndustry] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editIndustryId, setEditIndustryId] = useState(null);
//   const [editIndustryName, setEditIndustryName] = useState("");
//   const [error, setError] = useState("");

//   // Base API URL
//   const API_URL = "http://192.168.1.230:8011/api/industries";

//   // Fetch all industries on component mount
//   useEffect(() => {
//     fetchIndustries();
//   }, []);

//   const fetchIndustries = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/`);
//       setIndustries(response.data.industries);
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch industries. Please try again.");
//       console.error(err);
//     }
//   };

//   const handleAdd = async () => {
//     const trimmed = newIndustry.trim();
//     if (!trimmed) {
//       setError("Industry name cannot be empty.");
//       return;
//     }
//     try {
//       const response = await axios.post(`${API_URL}/create`, {
//         industryName: trimmed,
//       });
//       setIndustries([response.data.industry, ...industries]);
//       setNewIndustry("");
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to add industry.");
//       console.error(err);
//     }
//   };

//   const handleEdit = (industry) => {
//     setEditIndustryId(industry._id);
//     setEditIndustryName(industry.industryName);
//   };

//   const handleUpdate = async (id) => {
//     const trimmed = editIndustryName.trim();
//     if (!trimmed) {
//       setError("Industry name cannot be empty.");
//       return;
//     }
//     try {
//       const response = await axios.put(`${API_URL}/update/${id}`, {
//         industryName: trimmed,
//       });
//       setIndustries(
//         industries.map((ind) => (ind._id === id ? response.data.industry : ind))
//       );
//       setEditIndustryId(null);
//       setEditIndustryName("");
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to update industry.");
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/delete/${id}`);
//       setIndustries(industries.filter((ind) => ind._id !== id));
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to delete industry.");
//       console.error(err);
//     }
//   };

//   const filteredIndustries = industries.filter((ind) =>
//     ind.industryName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "50px",
//         backgroundColor: "#DCFFEB",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         width: 1400,
//         minHeight: "100vh",
//         boxSizing: "border-box",
//         marginRight: 40,
//         marginLeft: 40,
//       }}
//     >
//       {/* Left Section */}
//       <div style={{ flex: 1, marginRight: "40px" }}>
//         <h2
//           style={{
//             fontSize: "32px",
//             color: "#0a5e52",
//             marginBottom: "20px",
//           }}
//         >
//           ADD NEW INDUSTRY
//         </h2>

//         {/* Error Message */}
//         {error && (
//           <div
//             style={{
//               color: "#dc3545",
//               marginBottom: "10px",
//               fontSize: "14px",
//             }}
//           >
//             {error}
//           </div>
//         )}

//         {/* Input + Add Button */}
//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             marginBottom: "20px",
//             flexWrap: "wrap",
//           }}
//         >
//           <input
//             type="text"
//             placeholder="Enter industry name"
//             value={newIndustry}
//             onChange={(e) => setNewIndustry(e.target.value)}
//             style={{
//               flex: 1,
//               minWidth: "250px",
//               padding: "10px",
//               fontSize: "16px",
//               borderRadius: "8px",
//               border: "2px solid black",
//             }}
//           />
//           <button
//             onClick={handleAdd}
//             style={{
//               backgroundColor: "#0a5e52",
//               color: "#fff",
//               padding: "10px 20px",
//               fontWeight: "bold",
//               fontSize: "16px",
//               borderRadius: "6px",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             Add
//           </button>
//         </div>

//         {/* Search Input */}
//         <input
//           type="text"
//           placeholder="Search industries..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             width: "50%",
//             padding: "10px",
//             borderRadius: "28px",
//             border: "1px solid #ccc",
//             fontSize: "16px",
//             marginBottom: "20px",
//           }}
//         />

//         {/* Industry List */}
//         <h3 style={{ marginBottom: "10px", fontWeight: "600" }}>Industries</h3>
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {filteredIndustries.map((ind) => (
//             <div
//               key={ind._id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "#F8F9FA",
//                 padding: "12px 16px",
//                 borderRadius: "8px",
//                 border: "1px solid #eee",
//               }}
//             >
//               {editIndustryId === ind._id ? (
//                 <>
//                   <input
//                     type="text"
//                     value={editIndustryName}
//                     onChange={(e) => setEditIndustryName(e.target.value)}
//                     style={{
//                       flex: 1,
//                       padding: "8px",
//                       fontSize: "16px",
//                       borderRadius: "6px",
//                       border: "1px solid #ccc",
//                     }}
//                   />
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <button
//                       onClick={() => handleUpdate(ind._id)}
//                       style={{
//                         backgroundColor: "#28a745",
//                         border: "none",
//                         color: "#fff",
//                         padding: "6px 8px",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditIndustryId(null)}
//                       style={{
//                         backgroundColor: "#6c757d",
//                         border: "none",
//                         color: "#fff",
//                         padding: "6px 8px",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <span style={{ fontSize: "16px", fontWeight: 500 }}>
//                     {ind.industryName}
//                   </span>
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <button
//                       onClick={() => handleEdit(ind)}
//                       style={{
//                         backgroundColor: "#0a5e51a4",
//                         border: "none",
//                         color: "#fff",
//                         padding: "6px 8px",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(ind._id)}
//                       style={{
//                         backgroundColor: "#ff152cff",
//                         border: "none",
//                         color: "#fff",
//                         padding: "6px 8px",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div style={{ flexShrink: 0, textAlign: "center" }}>
//         <img
//           src={indus}
//           alt="Industry Illustration"
//           style={{
//             width: "300px",
//             marginBottom: "20px",
//           }}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = "https://via.placeholder.com/250?text=Image+Missing";
//           }}
//         />
//         <img
//           src={industry}
//           alt="Industry Icon"
//           style={{
//             width: "400px",
//             marginTop: "50px",
//             marginLeft: -130,
//           }}
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = "https://via.placeholder.com/180?text=Image+Missing";
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default IndustriesData;
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import indus from "../assets/images/indus.png"; // 🏭 Industry icon
import industry from "../assets/images/industry.png"; // 🏭 Industry illustration

function IndustriesData() {
  const [industries, setIndustries] = useState([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndustryId, setEditIndustryId] = useState(null);
  const [editIndustryName, setEditIndustryName] = useState("");
  const [error, setError] = useState("");

  // Confirm delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [isDeleting, setIsDeleting] = useState(false);

  // Base API URL
  const API_URL = "http://192.168.1.230:8011/api/industries";

  // Fetch all industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setIndustries(response.data.industries);
      setError("");
    } catch (err) {
      setError("Failed to fetch industries. Please try again.");
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const trimmed = newIndustry.trim();
    if (!trimmed) {
      setError("Industry name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/create`, {
        industryName: trimmed,
      });
      setIndustries([response.data.industry, ...industries]);
      setNewIndustry("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add industry.");
      console.error(err);
    }
  };

  const handleEdit = (industry) => {
    setEditIndustryId(industry._id);
    setEditIndustryName(industry.industryName);
  };

  const handleUpdate = async (id) => {
    const trimmed = editIndustryName.trim();
    if (!trimmed) {
      setError("Industry name cannot be empty.");
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, {
        industryName: trimmed,
      });
      setIndustries((prev) =>
        prev.map((ind) => (ind._id === id ? response.data.industry : ind))
      );
      setEditIndustryId(null);
      setEditIndustryName("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update industry.");
      console.error(err);
    }
  };

  // Open confirm dialog
  const openDeleteConfirm = (ind) => {
    setDeleteTarget({ id: ind._id, name: ind.industryName });
    setConfirmOpen(true);
  };

  // Cancel confirm dialog
  const cancelDelete = () => {
    if (isDeleting) return;
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  // Confirm and perform deletion
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${API_URL}/delete/${deleteTarget.id}`);
      setIndustries((prev) =>
        prev.filter((ind) => ind._id !== deleteTarget.id)
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete industry.");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const filteredIndustries = industries.filter((ind) =>
    ind.industryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "50px",
        backgroundColor: "#DCFFEB",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        width: 1400,
        minHeight: "100vh",
        boxSizing: "border-box",
        marginRight: 40,
        marginLeft: 40,
      }}
    >
      {/* Left Section */}
      <div style={{ flex: 1, marginRight: "40px" }}>
        <h2
          style={{
            fontSize: "32px",
            color: "#0a5e52",
            marginBottom: "20px",
          }}
        >
          ADD NEW INDUSTRY
        </h2>

        {/* Error Message */}
        {error && (
          <div
            style={{
              color: "#dc3545",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Input + Add Button */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Enter industry name"
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "2px solid black",
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: "#0a5e52",
              color: "#fff",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search industries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "50%",
            padding: "10px",
            borderRadius: "28px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        />

        {/* Industry List */}
        <h3 style={{ marginBottom: "10px", fontWeight: "600" }}>Industries</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredIndustries.map((ind) => (
            <div
              key={ind._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#F8F9FA",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #eee",
              }}
            >
              {editIndustryId === ind._id ? (
                <>
                  <input
                    type="text"
                    value={editIndustryName}
                    onChange={(e) => setEditIndustryName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      fontSize: "16px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleUpdate(ind._id)}
                      style={{
                        backgroundColor: "#28a745",
                        border: "none",
                        color: "#fff",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditIndustryId(null)}
                      style={{
                        backgroundColor: "#6c757d",
                        border: "none",
                        color: "#fff",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "16px", fontWeight: 500 }}>
                    {ind.industryName}
                  </span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(ind)}
                      style={{
                        backgroundColor: "#0a5e51a4",
                        border: "none",
                        color: "#fff",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(ind)}
                      style={{
                        backgroundColor: "#ff152cff",
                        border: "none",
                        color: "#fff",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <img
          src={indus}
          alt="Industry Illustration"
          style={{ width: "300px", marginBottom: "20px" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/250?text=Image+Missing";
          }}
        />
        <img
          src={industry}
          alt="Industry Icon"
          style={{ width: "400px", marginTop: "50px", marginLeft: -130 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/180?text=Image+Missing";
          }}
        />
      </div>

      {/* Confirm Delete Modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={overlayStyle}
          onClick={cancelDelete}
        >
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Delete Industry?</h3>
            <p style={{ marginTop: 0, marginBottom: 16 }}>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#e02424",
                  color: "#fff",
                  cursor: "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IndustriesData;

// Simple modal styles
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "min(480px, 92vw)",
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  padding: 20,
};
