import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const reportTypes = [
  "Blood Test and Urine Analysis",
  "Physical Characteristics",
];

const ReportUpload = () => {
  const [category, setCategory] = useState("");
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [editReportId, setEditReportId] = useState(null);
  const [editReportType, setEditReportType] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);

  const API_URL = "http://localhost:8011/api";

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        let endpoint = "";
        if (category === "School") endpoint = "/schools";
        else if (category === "Institute") endpoint = "/institutes";
        else if (category === "Industries") endpoint = "/industries";

        if (endpoint) {
          const response = await axios.get(`${API_URL}${endpoint}`);
          setEntities(
            response.data[
              category === "School"
                ? "schools"
                : category === "Institute"
                ? "institutes"
                : "industries"
            ]
          );
          setError("");
        } else {
          setEntities([]);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || "Failed to fetch entities. Please try again.";
        setError(errorMessage);
        if (errorMessage.toLowerCase().includes("user not found")) {
          toast.error("User is not found!", { position: "top-right" });
        }
        console.error(err);
      }
    };

    fetchEntities();
  }, [category]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_URL}/reports`);
        const formattedReports = response.data.reports.map((r) => ({
          id: r._id,
          category: r.category,
          entity: r.entity,
          reportType: r.reportType,
          fileName: r.fileName,
          userUniqueId: r.userUniqueId,
        }));
        setUploadedReports(formattedReports);
        setError("");
      } catch (err) {
        const errorMessage = err.response?.data?.error || "Failed to fetch reports. Please try again.";
        setError(errorMessage);
        if (errorMessage.toLowerCase().includes("user not found")) {
          toast.error("User is not found!", { position: "top-right" });
        }
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  const handleUpload = async () => {
    if (!category || !selectedEntity || !selectedReport || !files.length) {
      setError("Please fill all fields and select at least one file.");
      toast.error("Please fill all fields and select at least one file.", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("reportType", selectedReport);
    formData.append("category", category);
    formData.append("entity", selectedEntity);

    try {
      const response = await axios.post(`${API_URL}/reports/bulk-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { successUploads, failedUploads, uploadedCount, failedCount } = response.data;

      const newReports = successUploads.map((upload) => ({
        id: upload._id,
        category: upload.category,
        entity: upload.entity,
        reportType: upload.reportType,
        fileName: upload.fileName,
        userUniqueId: upload.userUniqueId,
      }));

      setUploadedReports([...newReports, ...uploadedReports]);
      setSelectedReport("");
      setFiles([]);
      document.getElementById("fileInput").value = "";
      setError("");
      setCurrentPage(1);

      // Show toast based on upload outcome
      if (uploadedCount > 0 && failedCount === 0) {
        toast.success(`Successfully uploaded ${uploadedCount} report(s)!`, {
          position: "top-right",
        });
      } else if (uploadedCount > 0 && failedCount > 0) {
        toast.warn(
          `Partially successful: ${uploadedCount} report(s) uploaded, ${failedCount} failed: ${failedUploads
            .map((f) => `${f.file} (${f.reason})`)
            .join(", ")}`,
          { position: "top-right" }
        );
      } else if (failedCount > 0) {
        const errorMessage = `Upload failed: ${failedUploads
          .map((f) => `${f.file} (${f.reason})`)
          .join(", ")}`;
        setError(errorMessage);
        if (failedUploads.some((f) => f.reason.toLowerCase().includes("user not found"))) {
          toast.error("User is not found for one or more files!", { position: "top-right" });
        } else {
          toast.error(errorMessage, { position: "top-right" });
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        `Upload failed: ${err.response?.data?.failedUploads
          ?.map((f) => `${f.file} (${f.reason})`)
          .join(", ") || "Unknown error"}`;
      setError(errorMessage);
      if (errorMessage.toLowerCase().includes("user not found")) {
        toast.error("User is not found for one or more files!", { position: "top-right" });
      } else {
        toast.error(errorMessage, { position: "top-right" });
      }
      console.error(err);
    }
  };

  const handleEdit = (report) => {
    setEditReportId(report.id);
    setEditReportType(report.reportType);
  };

  const handleUpdate = async (id) => {
    if (!editReportType) {
      setError("Report type cannot be empty.");
      toast.error("Report type cannot be empty.", { position: "top-right" });
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/reports/update/${id}`, {
        reportType: editReportType,
      });
      setUploadedReports(
        uploadedReports.map((r) =>
          r.id === id ? { ...r, reportType: response.data.report.reportType } : r
        )
      );
      setEditReportId(null);
      setEditReportType("");
      setError("");
      toast.success("Report updated successfully!", { position: "top-right" });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update report.";
      setError(errorMessage);
      if (errorMessage.toLowerCase().includes("user not found")) {
        toast.error("User is not found!", { position: "top-right" });
      } else {
        toast.error(errorMessage, { position: "top-right" });
      }
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/reports/${id}`);
      setUploadedReports(uploadedReports.filter((r) => r.id !== id));
      setError("");
      toast.success("Report deleted successfully!", { position: "top-right" });
      const totalPages = Math.ceil(uploadedReports.length / reportsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete report.";
      setError(errorMessage);
      if (errorMessage.toLowerCase().includes("user not found")) {
        toast.error("User is not found!", { position: "top-right" });
      } else {
        toast.error(errorMessage, { position: "top-right" });
      }
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = uploadedReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(uploadedReports.length / reportsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Segoe UI",
        background: "#F5F9FF",
        width: 1400,
        marginLeft: 50,
        marginTop: 30,
      }}
    >
      <ToastContainer />
      <h2 style={{ color: "#2b6777", marginBottom: "20px" }}>Upload Reports</h2>

      {error && (
        <div
          style={{
            color: "#dc3545",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSelectedEntity("");
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            width: "300px",
          }}
        >
          <option value="">Select Category</option>
          <option value="School">School</option>
          <option value="Institute">Institute</option>
          <option value="Industries">Industries</option>
        </select>

        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          disabled={!category}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            width: "220px",
          }}
        >
          <option value="">Select {category || "Entity"}</option>
          {entities.map((entity, idx) => (
            <option
              key={idx}
              value={
                entity.schoolName || entity.instituteName || entity.industryName
              }
            >
              {entity.schoolName || entity.instituteName || entity.industryName}
            </option>
          ))}
        </select>

        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            width: "240px",
          }}
        >
          <option value="">Select Report Type</option>
          {reportTypes.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          id="fileInput"
          onChange={(e) => setFiles(Array.from(e.target.files))}
          style={{ fontSize: "14px" }}
        />

        <button
          onClick={handleUpload}
          style={{
            backgroundColor: "#2b6777",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
            height: "42px",
          }}
        >
          Upload
        </button>
      </div>

      <div style={{ width: "100%" }}>
        <table
          style={{
            width: 1200,
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <thead style={{ backgroundColor: "#2b6777", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px" }}>Category</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Report Type</th>
              <th style={{ padding: "12px" }}>File Name</th>
              <th style={{ padding: "12px" }}>User ID</th>
              <th style={{ padding: "12px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report) => (
              <tr key={report.id} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px" }}>{report.category}</td>
                <td style={{ padding: "10px" }}>{report.entity}</td>
                <td style={{ padding: "10px" }}>
                  {editReportId === report.id ? (
                    <select
                      value={editReportType}
                      onChange={(e) => setEditReportType(e.target.value)}
                      style={{
                        padding: "5px",
                        fontSize: "14px",
                        borderRadius: "4px",
                      }}
                    >
                      <option value="">Select Report Type</option>
                      {reportTypes.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  ) : (
                    report.reportType
                  )}
                </td>
                <td style={{ padding: "10px" }}>{report.fileName}</td>
                <td style={{ padding: "10px" }}>{report.userUniqueId}</td>
                <td style={{ padding: "10px" }}>
                  {editReportId === report.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(report.id)}
                        style={{
                          backgroundColor: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 8px",
                          marginRight: "6px",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditReportId(null)}
                        style={{
                          backgroundColor: "#6c757d",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 8px",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(report)}
                        style={{
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 8px",
                          marginRight: "6px",
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        style={{
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 8px",
                        }}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {currentReports.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{ padding: "20px", textAlign: "center", color: "#999" }}
                >
                  No reports uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={paginationStyle}>
          <button
            style={{ ...paginationBtnStyle, ...(currentPage === 1 ? disabledBtnStyle : {}) }}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div style={pageNumbersStyle}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                style={{
                  ...paginationBtnStyle,
                  ...(currentPage === number ? activePageBtnStyle : {}),
                }}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            style={{ ...paginationBtnStyle, ...(currentPage === totalPages ? disabledBtnStyle : {}) }}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;

// Styles
const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
  gap: "10px",
};

const paginationBtnStyle = {
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

const pageNumbersStyle = {
  display: "flex",
  gap: "8px",
};

const activePageBtnStyle = {
  backgroundColor: "#2b6777",
  color: "#fff",
  border: "none",
};

const disabledBtnStyle = {
  backgroundColor: "#eee",
  color: "#999",
  cursor: "not-allowed",
};