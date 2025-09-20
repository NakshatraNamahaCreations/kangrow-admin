import React, { useState } from "react";
import { FaDownload, FaUpload, FaPlus, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import user from "../assets/images/user.png";

function BulkUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleDownload = () => {
    const sampleData = [
      {
        SL: 1,
        Name: "",
        Email: "",
        Phone: "",
        DOB: "",
        Gender: "",
        Age: "",
        Father:"",
        Mother:"",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(dataBlob, "UserTemplate.xlsx");
  };

 const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("http://localhost:8011/api/users/bulk-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(`Bulk upload successful! Inserted: ${response.data.insertedCount}, Failed: ${response.data.failedCount}`);
    if (response.data.failedUsers.length > 0) {
      console.log("Failed users:", response.data.failedUsers);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert(error.response?.data?.error || "Failed to upload file");
  }
};


  const handleAdd = () => {
    navigate("/"); // Redirect to UserData component
  };

  return (
    <div style={containerStyle}>
      {/* Title + Search */}
      <div style={topBarStyle}>
        <h1 style={titleStyle}>BULK USER MANAGEMENT</h1>
        <div style={searchContainerStyle}>
          <FaSearch style={{ marginRight: "8px", color: "#6b7280" }} />
          <input
            type="text"
            placeholder="Search user by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style = {searchInputStyle}
          />
        </div>
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
            <button style={{ ...buttonStyle, backgroundColor: "#2563eb" }} onClick={handleDownload}>
              <FaDownload /> Download Excel Sheet
            </button>

            <input
              type="file"
              accept=".xlsx, .csv"
              id="uploadInput"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <button style={{ ...buttonStyle, backgroundColor: "#059669" }} onClick={() => document.getElementById("uploadInput").click()}>
              <FaUpload /> Upload Sheet
            </button>

            {/* <button style={{ ...buttonStyle, backgroundColor: "#7c3aed" }} onClick={handleAdd}>
              <FaPlus /> Add
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkUser;

// Styles (same as provided)
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