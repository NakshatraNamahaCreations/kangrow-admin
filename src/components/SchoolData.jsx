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

  // Fetch schools from backend on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("http://localhost:8011/api/schools");
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
  const currentSchools = filteredSchools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);

  const handleAdd = async () => {
    const trimmed = newSchool.trim();
    if (!trimmed) {
      alert("School name is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8011/api/schools/create", { schoolName: trimmed });
      setSchools([response.data.school, ...schools]);
      setNewSchool("");
      setCurrentPage(1); // Reset to first page after z
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
      const response = await axios.put(`http://localhost:8011/api/schools/update/${editSchoolId}`, {
        schoolName: editSchoolName.trim(),
      });
      setSchools(schools.map((school) => (school._id === editSchoolId ? response.data.school : school)));
      setShowEditModal(false);
      setEditSchoolId(null);
      setEditSchoolName("");
      alert("School updated successfully");
    } catch (error) {
      console.error("Error updating school:", error);
      alert(error.response?.data?.error || "Failed to update school");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      try {
        await axios.delete(`http://localhost:8011/api/schools/delete/${id}`);
        setSchools(schools.filter((school) => school._id !== id));
        // Adjust page if necessary
        if (currentSchools.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        alert("School deleted successfully");
      } catch (error) {
        console.error("Error deleting school:", error);
        alert(error.response?.data?.error || "Failed to delete school");
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <h2 style={{ fontSize: "32px", color: "#228B84", marginBottom: "20px" }}>
          ADD NEW SCHOOL
        </h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
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
              backgroundColor: "#228B84",
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
          {currentSchools.map((school, index) => (
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
                  onClick={() => handleDelete(school._id)}
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
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === 1 ? "#ccc" : "#228B84",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: currentPage === page ? "#228B84" : "#f8f9fa",
                  color: currentPage === page ? "#fff" : "#000",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === totalPages ? "#ccc" : "#228B84",
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
        <img src={building} alt="School Building" style={{ width: "300px", marginBottom: "20px" }} />
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
            <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Edit School</h2>
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
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
                  backgroundColor: "#228B84",
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
    </div>
  );
}

export default SchoolData;