// import React, { useState } from "react";
// import { FaDownload, FaUpload, FaPlus, FaSearch } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import user from "../assets/images/user.png";

// function BulkUser() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const handleDownload = () => {
//     const sampleData = [
//       {
//         SL: 1,
//         Name: "",
//         Phone: "",
//         DOB: "",
//         Gender: "",
//         Age: "",
//         Father: "",
//         Mother: "",
//         Place: "",
//         status: "",
//       },
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(sampleData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const dataBlob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(dataBlob, "UserTemplate.xlsx");
//   };

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "https://api.svkangrowhealth.com/api/users/bulk-upload",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       alert(
//         `Bulk upload successful! Inserted: ${response.data.insertedCount}, Failed: ${response.data.failedCount}`
//       );
//       if (response.data.failedUsers.length > 0) {
//         console.log("Failed users:", response.data.failedUsers);
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert(error.response?.data?.error || "Failed to upload file");
//     }
//   };

//   const handleAdd = () => {
//     navigate("/"); // Redirect to UserData component
//   };

//   return (
//     <div style={containerStyle}>
//       {/* Title + Search */}
//       <div style={topBarStyle}>
//         <h1 style={titleStyle}>BULK USER MANAGEMENT</h1>
//         {/* <div style={searchContainerStyle}>
//           <FaSearch style={{ marginRight: "8px", color: "#6b7280" }} />
//           <input
//             type="text"
//             placeholder="Search user by name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={searchInputStyle}
//           />
//         </div> */}
//       </div>

//       {/* Main Layout */}
//       <div style={layoutStyle}>
//         {/* Image */}
//         <div style={leftSideStyle}>
//           <img src={user} alt="User Illustration" style={imageStyle} />
//         </div>

//         {/* Buttons */}
//         <div style={rightSideStyle}>
//           <div style={buttonGroupStyle}>
//             <button
//               style={{ ...buttonStyle, backgroundColor: "#2563eb" }}
//               onClick={handleDownload}
//             >
//               <FaDownload /> Download Excel Sheet
//             </button>

//             <input
//               type="file"
//               accept=".xlsx, .csv"
//               id="uploadInput"
//               style={{ display: "none" }}
//               onChange={handleUpload}
//             />
//             <button
//               style={{ ...buttonStyle, backgroundColor: "#0a5e52" }}
//               onClick={() => document.getElementById("uploadInput").click()}
//             >
//               <FaUpload /> Upload Sheet
//             </button>

//             {/* <button style={{ ...buttonStyle, backgroundColor: "#7c3aed" }} onClick={handleAdd}>
//               <FaPlus /> Add
//             </button> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BulkUser;

// // Styles (same as provided)
// const containerStyle = {
//   fontFamily: "Poppins, sans-serif",
//   backgroundColor: "#e0f2fe",
//   minHeight: "100vh",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   width: 1350,
//   paddingTop: 140,
// };

// const topBarStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   width: "100%",
//   maxWidth: "1200px",
//   marginBottom: "40px",
// };

// const titleStyle = {
//   fontSize: "32px",
//   fontWeight: "900",
//   color: "#1e40af",
//   margin: 0,
// };

// const searchContainerStyle = {
//   display: "flex",
//   alignItems: "center",
//   border: "1px solid #d1d5db",
//   borderRadius: "999px",
//   padding: "10px 16px",
//   width: "300px",
//   backgroundColor: "#fff",
// };

// const searchInputStyle = {
//   border: "none",
//   outline: "none",
//   fontSize: "14px",
//   flex: 1,
//   fontFamily: "inherit",
// };

// const layoutStyle = {
//   display: "flex",
//   gap: "40px",
//   alignItems: "center",
//   justifyContent: "center",
//   flexWrap: "wrap",
//   maxWidth: "1200px",
//   width: "100%",
// };

// const leftSideStyle = {
//   width: "550px",
//   display: "flex",
//   justifyContent: "center",
// };

// const imageStyle = {
//   width: "100%",
//   height: "auto",
//   objectFit: "contain",
//   borderRadius: "16px",
// };

// const rightSideStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
// };

// const buttonGroupStyle = {
//   display: "flex",
//   gap: "16px",
//   flexWrap: "wrap",
//   justifyContent: "center",
//   width: "100%",
// };

// const buttonStyle = {
//   color: "#fff",
//   border: "none",
//   padding: "12px 20px",
//   fontSize: "14px",
//   fontWeight: "600",
//   borderRadius: "12px",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   boxShadow: "0 8px 15px rgba(0, 0, 0, 0.08)",
//   transition: "all 0.2s ease",
// };


import React, { useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import user from "../assets/images/user.png";

function BulkUser() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD

=======
>>>>>>> e459d12c0756971fcf7e58e7e3012e6b190da818
  // Download Template
  const handleDownload = () => {
    const sampleData = [
      {
        SL: 1,
        Name: "",
        Phone: "",
        DOB: "",
        Gender: "",
        Age: "",
        Father: "",
        Mother: "",
        Place: "",
           Category: "",  
        status: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, "UserTemplate.xlsx");
  };

  // Triggered when user selects file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setShowConfirmModal(true);
  };

  // Confirm Upload
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
          setLoading(true); 
      const response = await axios.post(
        "https://api.svkangrowhealth.com/api/users/bulk-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // If there are failed users (already exist), show error modal
      if (response.data.failedCount > 0) {
        setErrorMessage(
          `Some users already exist. Failed count: ${response.data.failedCount}`
        );
        setShowErrorModal(true);
      } else {
        // ✅ Redirect to /user-data if successful
        navigate("/user-data");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(error.response?.data?.error || "Failed to upload file");
      setShowErrorModal(true);
    } finally {
<<<<<<< HEAD
      setLoading(false);
=======
>>>>>>> e459d12c0756971fcf7e58e7e3012e6b190da818
      setShowConfirmModal(false);
      setSelectedFile(null);
    }
  };

  return (
    <div style={containerStyle}>
      {/* Title */}
      <div style={topBarStyle}>
        <h1 style={titleStyle}>BULK USER MANAGEMENT</h1>
      </div>

      {/* Main Layout */}
      <div style={layoutStyle}>
        {/* Image */}
        <div style={leftSideStyle}>
          <img src={user} alt="User Illustration" style={imageStyle} />
        </div>

        {/* Buttons */}
        <div style={rightSideStyle}>
          <div style={buttonGroupStyle}>
            <button
              style={{ ...buttonStyle, backgroundColor: "#2563eb" }}
              onClick={handleDownload}
            >
              <FaDownload /> Download Excel Sheet
            </button>

            <input
              type="file"
              accept=".xlsx, .csv"
              id="uploadInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              style={{ ...buttonStyle, backgroundColor: "#0a5e52" }}
              onClick={() => document.getElementById("uploadInput").click()}
            >
              <FaUpload /> Upload Sheet
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirmModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Confirm Upload</h3>
            <p>Do you want to upload the selected Excel file?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={cancelBtn}
              >
                Cancel
              </button>
<<<<<<< HEAD
              <button onClick={handleConfirmUpload} style={okBtn} disabled={loading}>
               {loading ? (
    <div style={spinnerStyle}></div>  // ✅ Loader
  ) : (
    "OK"
  )}
=======
              <button onClick={handleConfirmUpload} style={okBtn}>
                OK
>>>>>>> e459d12c0756971fcf7e58e7e3012e6b190da818
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ❌ Error Modal */}
      {showErrorModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ color: "#b91c1c" }}>Upload Error</h3>
            <p>{errorMessage}</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowErrorModal(false)}
                style={okBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkUser;

// ✅ Modal Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const cancelBtn = {
  padding: "8px 14px",
  backgroundColor: "#ccc",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

<<<<<<< HEAD
const spinnerStyle = {
  border: "3px solid #f3f3f3",
  borderTop: "3px solid #0a5e52",
  borderRadius: "50%",
  width: "16px",
  height: "16px",
  animation: "spin 1s linear infinite",
};

// Add keyframes for spin animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`, styleSheet.cssRules.length);


=======
>>>>>>> e459d12c0756971fcf7e58e7e3012e6b190da818
const okBtn = {
  padding: "8px 14px",
  backgroundColor: "#0a5e52",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

 const containerStyle = {
  fontFamily: "Poppins, sans-serif",
  backgroundColor: "#e0f2fe",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 1350,
  paddingTop: 140,
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "1200px",
  marginBottom: "40px",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "900",
  color: "#1e40af",
  margin: 0,
};

const searchContainerStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d1d5db",
  borderRadius: "999px",
  padding: "10px 16px",
  width: "300px",
  backgroundColor: "#fff",
};

const searchInputStyle = {
  border: "none",
  outline: "none",
  fontSize: "14px",
  flex: 1,
  fontFamily: "inherit",
};

const layoutStyle = {
  display: "flex",
  gap: "40px",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  maxWidth: "1200px",
  width: "100%",
};

const leftSideStyle = {
  width: "550px",
  display: "flex",
  justifyContent: "center",
};

const imageStyle = {
  width: "100%",
  height: "auto",
  objectFit: "contain",
  borderRadius: "16px",
};

const rightSideStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  justifyContent: "center",
  width: "100%",
};

const buttonStyle = {
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: "0 8px 15px rgba(0, 0, 0, 0.08)",
  transition: "all 0.2s ease",
};

/* Existing styles (containerStyle, topBarStyle, etc.) remain same */

