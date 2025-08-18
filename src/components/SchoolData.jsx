// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import axios from "axios";
// import person from "../assets/images/person.png";
// import building from "../assets/images/house.png";

// function SchoolData() {
//   const [schools, setSchools] = useState([]);
//   const [newSchool, setNewSchool] = useState("");
//   const [editSchoolId, setEditSchoolId] = useState(null);
//   const [editSchoolName, setEditSchoolName] = useState("");
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const schoolsPerPage = 5;

//   // Fetch schools from backend on component mount
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         const response = await axios.get(
//           "http://192.168.1.230:8011/api/schools"
//         );
//         setSchools(response.data.schools);
//       } catch (error) {
//         console.error("Error fetching schools:", error);
//         alert("Failed to fetch schools");
//       }
//     };
//     fetchSchools();
//   }, []);

//   const filteredSchools = schools.filter((school) =>
//     school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calculate pagination data
//   const indexOfLastSchool = currentPage * schoolsPerPage;
//   const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
//   const currentSchools = filteredSchools.slice(
//     indexOfFirstSchool,
//     indexOfLastSchool
//   );
//   const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

//   const handleAdd = async () => {
//     const trimmed = newSchool.trim();
//     if (!trimmed) {
//       alert("School name is required");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://192.168.1.230:8011/api/schools/create",
//         { schoolName: trimmed }
//       );
//       setSchools([response.data.school, ...schools]);
//       setNewSchool("");
//       setCurrentPage(1); // Reset to first page after z
//       alert("School added successfully");
//     } catch (error) {
//       console.error("Error adding school:", error);
//       alert(error.response?.data?.error || "Failed to add school");
//     }
//   };

//   const handleEdit = (school) => {
//     setEditSchoolId(school._id);
//     setEditSchoolName(school.schoolName);
//     setShowEditModal(true);
//   };

//   const handleUpdate = async () => {
//     if (!editSchoolName.trim()) {
//       alert("School name is required");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         `http://192.168.1.230:8011/api/schools/update/${editSchoolId}`,
//         {
//           schoolName: editSchoolName.trim(),
//         }
//       );
//       setSchools(
//         schools.map((school) =>
//           school._id === editSchoolId ? response.data.school : school
//         )
//       );
//       setShowEditModal(false);
//       setEditSchoolId(null);
//       setEditSchoolName("");
//       alert("School updated successfully");
//     } catch (error) {
//       console.error("Error updating school:", error);
//       alert(error.response?.data?.error || "Failed to update school");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this school?")) {
//       try {
//         await axios.delete(
//           `http://192.168.1.230:8011/api/schools/delete/${id}`
//         );
//         setSchools(schools.filter((school) => school._id !== id));
//         // Adjust page if necessary
//         if (currentSchools.length === 1 && currentPage > 1) {
//           setCurrentPage(currentPage - 1);
//         }
//         alert("School deleted successfully");
//       } catch (error) {
//         console.error("Error deleting school:", error);
//         alert(error.response?.data?.error || "Failed to delete school");
//       }
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "50px",
//         backgroundColor: "#DBFBE2",
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         width: 1300,
//         marginRight: 40,
//         marginLeft: 40,
//         minHeight: 500,
//       }}
//     >
//       {/* Left Content */}
//       <div style={{ flex: 1, marginRight: "40px" }}>
//         <h2
//           style={{ fontSize: "32px", color: "#0a5e52", marginBottom: "20px" }}
//         >
//           ADD NEW SCHOOL
//         </h2>

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
//             placeholder="Enter school name"
//             value={newSchool}
//             onChange={(e) => setNewSchool(e.target.value)}
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
//         <input
//           type="text"
//           placeholder="Search schools..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             minWidth: "250px",
//             padding: "10px",
//             borderRadius: "26px",
//             border: "1px solid #ccc",
//             fontSize: "16px",
//             flex: 1,
//             alignSelf: "flex-end",
//             alignItems: "flex-end",
//           }}
//         />
//         <h3 style={{ marginBottom: "10px", fontWeight: "600" }}>Schools</h3>
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {currentSchools.map((school, index) => (
//             <div
//               key={school._id}
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
//               <span style={{ fontSize: "16px", fontWeight: 500 }}>
//                 {school.schoolName}
//               </span>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <button
//                   onClick={() => handleEdit(school)}
//                   style={{
//                     backgroundColor: "#007bff",
//                     border: "none",
//                     color: "#fff",
//                     padding: "6px 8px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(school._id)}
//                   style={{
//                     backgroundColor: "#dc3545",
//                     border: "none",
//                     color: "#fff",
//                     padding: "6px 8px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               gap: "10px",
//               marginTop: "20px",
//             }}
//           >
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor: currentPage === 1 ? "#ccc" : "#0a5e52",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: currentPage === 1 ? "not-allowed" : "pointer",
//               }}
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//               (page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   style={{
//                     padding: "8px 16px",
//                     backgroundColor:
//                       currentPage === page ? "#0a5e52" : "#f8f9fa",
//                     color: currentPage === page ? "#fff" : "#000",
//                     border: "1px solid #ccc",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {page}
//                 </button>
//               )
//             )}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               style={{
//                 padding: "8px 16px",
//                 backgroundColor:
//                   currentPage === totalPages ? "#ccc" : "#0a5e52",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "6px",
//                 cursor: currentPage === totalPages ? "not-allowed" : "pointer",
//               }}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Right Illustration */}
//       <div style={{ flexShrink: 0, textAlign: "center" }}>
//         <img
//           src={building}
//           alt="School Building"
//           style={{ width: "300px", marginBottom: "20px" }}
//         />
//       </div>
//       <img
//         src={person}
//         alt="Teacher Illustration"
//         style={{
//           width: "250px",
//           height: 400,
//           marginRight: 80,
//           marginTop: 80,
//           marginLeft: -40,
//         }}
//       />

//       {/* Edit Modal */}
//       {showEditModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 999,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               padding: "20px",
//               width: "400px",
//               boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
//               Edit School
//             </h2>
//             <input
//               type="text"
//               value={editSchoolName}
//               onChange={(e) => setEditSchoolName(e.target.value)}
//               placeholder="Enter school name"
//               style={{
//                 width: "100%",
//                 padding: "10px",
//                 fontSize: "16px",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//                 marginBottom: "20px",
//               }}
//             />
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: "10px",
//               }}
//             >
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 style={{
//                   padding: "10px 20px",
//                   backgroundColor: "#ccc",
//                   color: "#000",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 style={{
//                   padding: "10px 20px",
//                   backgroundColor: "#0a5e52",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SchoolData;
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import person from "../assets/images/person.png";
import building from "../assets/images/house.png";

function SchoolData() {
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState("");
  const [editSchoolId, setEditSchoolId] = useState(null);
  const [editSchoolName, setEditSchoolName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 5;

  // Confirm delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch schools from backend on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.230:8011/api/schools"
        );
        setSchools(response.data.schools);
      } catch (error) {
        console.error("Error fetching schools:", error);
        alert("Failed to fetch schools");
      }
    };
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter((school) =>
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination data
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = filteredSchools.slice(
    indexOfFirstSchool,
    indexOfLastSchool
  );
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage) || 1;

  const handleAdd = async () => {
    const trimmed = newSchool.trim();
    if (!trimmed) {
      alert("School name is required");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.230:8011/api/schools/create",
        { schoolName: trimmed }
      );
      setSchools([response.data.school, ...schools]);
      setNewSchool("");
      setCurrentPage(1); // Reset to first page after add
      alert("School added successfully");
    } catch (error) {
      console.error("Error adding school:", error);
      alert(error.response?.data?.error || "Failed to add school");
    }
  };

  const handleEdit = (school) => {
    setEditSchoolId(school._id);
    setEditSchoolName(school.schoolName);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editSchoolName.trim()) {
      alert("School name is required");
      return;
    }

    try {
      const response = await axios.put(
        `http://192.168.1.230:8011/api/schools/update/${editSchoolId}`,
        { schoolName: editSchoolName.trim() }
      );
      setSchools((prev) =>
        prev.map((s) => (s._id === editSchoolId ? response.data.school : s))
      );
      setShowEditModal(false);
      setEditSchoolId(null);
      setEditSchoolName("");
      alert("School updated successfully");
    } catch (error) {
      console.error("Error updating school:", error);
      alert(error.response?.data?.error || "Failed to update school");
    }
  };

  // Open confirm dialog
  const openDeleteConfirm = (school) => {
    setDeleteTarget({ id: school._id, name: school.schoolName });
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
      await axios.delete(
        `http://192.168.1.230:8011/api/schools/delete/${deleteTarget.id}`
      );

      // Update list
      const newSchools = schools.filter((s) => s._id !== deleteTarget.id);
      setSchools(newSchools);

      // Recompute pagination after deletion
      const filteredAfter = newSchools.filter((s) =>
        s.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalPagesAfter =
        Math.ceil(filteredAfter.length / schoolsPerPage) || 1;
      if (currentPage > totalPagesAfter) setCurrentPage(totalPagesAfter);

      alert("School deleted successfully");
    } catch (error) {
      console.error("Error deleting school:", error);
      alert(error.response?.data?.error || "Failed to delete school");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "50px",
        backgroundColor: "#DBFBE2",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        width: 1300,
        marginRight: 40,
        marginLeft: 40,
        minHeight: 500,
      }}
    >
      {/* Left Content */}
      <div style={{ flex: 1, marginRight: "40px" }}>
        <h2
          style={{ fontSize: "32px", color: "#0a5e52", marginBottom: "20px" }}
        >
          ADD NEW SCHOOL
        </h2>

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
            placeholder="Enter school name"
            value={newSchool}
            onChange={(e) => setNewSchool(e.target.value)}
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

        <input
          type="text"
          placeholder="Search schools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            minWidth: "250px",
            padding: "10px",
            borderRadius: "26px",
            border: "1px solid #ccc",
            fontSize: "16px",
            flex: 1,
            alignSelf: "flex-end",
            alignItems: "flex-end",
          }}
        />

        <h3 style={{ marginBottom: "10px", fontWeight: "600" }}>Schools</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {currentSchools.map((school) => (
            <div
              key={school._id}
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
              <span style={{ fontSize: "16px", fontWeight: 500 }}>
                {school.schoolName}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEdit(school)}
                  style={{
                    backgroundColor: "#007bff",
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
                  onClick={() => openDeleteConfirm(school)}
                  style={{
                    backgroundColor: "#dc3545",
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
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === 1 ? "#ccc" : "#0a5e52",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor:
                      currentPage === page ? "#0a5e52" : "#f8f9fa",
                    color: currentPage === page ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 16px",
                backgroundColor:
                  currentPage === totalPages ? "#ccc" : "#0a5e52",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Right Illustration */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <img
          src={building}
          alt="School Building"
          style={{ width: "300px", marginBottom: "20px" }}
        />
      </div>
      <img
        src={person}
        alt="Teacher Illustration"
        style={{
          width: "250px",
          height: 400,
          marginRight: 80,
          marginTop: 80,
          marginLeft: -40,
        }}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "20px",
              width: "400px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>
              Edit School
            </h2>
            <input
              type="text"
              value={editSchoolName}
              onChange={(e) => setEditSchoolName(e.target.value)}
              placeholder="Enter school name"
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "20px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#ccc",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0a5e52",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={overlayStyle}
          onClick={cancelDelete}
        >
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Delete School?</h3>
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

export default SchoolData;

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
