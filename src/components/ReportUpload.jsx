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

  const API_URL = "https://api.svkangrowhealth.com/api";

  // format dd-MM-yy
  const formatDDMMYY = (dateLike) => {
    const dt = new Date(dateLike);
    if (isNaN(dt)) return "";
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yy = String(dt.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
  };

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
        const errorMessage =
          err.response?.data?.error || "Failed to fetch entities.";
        setError(errorMessage);
        if (errorMessage.toLowerCase().includes("user not found")) {
          toast.error("User is not found!");
        }
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
          fileUrl: `https://api.svkangrowhealth.com/uploads/${r.fileName}`,
          uploadedAt: r.createdAt || r.uploadedAt || null, // <-- use backend date if present
        }));
        setUploadedReports(formattedReports);
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to fetch reports.";
        setError(errorMessage);
      }
    };

    fetchReports();
  }, []);

  const handleUpload = async () => {
    if (!category || !selectedEntity || !selectedReport || !files.length) {
      toast.error("Please fill all fields and select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("reportType", selectedReport);
    formData.append("category", category);
    formData.append("entity", selectedEntity);

    try {
      const response = await axios.post(
        `${API_URL}/reports/bulk-upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { successUploads, failedUploads, uploadedCount, failedCount } =
        response.data;

      const nowISO = new Date().toISOString();
      const newReports = successUploads.map((upload) => ({
        id: upload._id,
        category: upload.category,
        entity: upload.entity,
        reportType: upload.reportType,
        fileName: upload.fileName,
        userUniqueId: upload.userUniqueId,
        fileUrl: `https://api.svkangrowhealth.com/uploads/reports/${upload.fileName}`,
        uploadedAt: upload.createdAt || upload.uploadedAt || nowISO, // <-- fallback to now
      }));

      setUploadedReports((prev) => [...newReports, ...prev]);
      setSelectedReport("");
      setFiles([]);
      const input = document.getElementById("fileInput");
      if (input) input.value = "";
      setCurrentPage(1);

      if (uploadedCount > 0 && failedCount === 0) {
        toast.success(`Uploaded ${uploadedCount} report(s)!`);
      } else if (uploadedCount > 0 && failedCount > 0) {
        toast.warn(
          `Partial success: ${uploadedCount} uploaded, ${failedCount} failed.`
        );
      } else {
        toast.error("All uploads failed.");
      }
    } catch (err) {
      toast.error("Upload failed.");
    }
  };

  const handleEdit = (report) => {
    setEditReportId(report.id);
    setEditReportType(report.reportType);
  };

  const handleUpdate = async (id) => {
    if (!editReportType) {
      toast.error("Report type cannot be empty.");
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/reports/update/${id}`, {
        reportType: editReportType,
      });
      setUploadedReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, reportType: response.data.report.reportType }
            : r
        )
      );
      setEditReportId(null);
      setEditReportType("");
      toast.success("Report updated!");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/reports/${id}`);
      setUploadedReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted!");
    } catch (err) {
      toast.error("Delete failed.");
    }
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = uploadedReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(uploadedReports.length / reportsPerPage);

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        padding: "70px",
        fontFamily: "Segoe UI",
        width: "90%",
        background: "#f3f4f6",
      }}
    >
      <ToastContainer />
      <h2 style={{ color: "#2b6777", marginBottom: "20px" }}>Upload Reports</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "25px",
        }}
      >
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSelectedEntity("");
          }}
          style={{ padding: "10px", width: "200px", borderRadius: "6px" }}
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
          style={{ padding: "10px", width: "220px", borderRadius: "6px" }}
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
          style={{ padding: "10px", width: "240px", borderRadius: "6px" }}
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
          id="fileInput"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />

        <button
          onClick={handleUpload}
          style={{
            backgroundColor: "#2b6777",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>

      <table
        style={{
          width: "170%",
          backgroundColor: "#fff",
          borderCollapse: "collapse",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <thead
          style={{ backgroundColor: "#2b6777", color: "#fff", width: "100%" }}
        >
          <tr>
            <th style={th}>Category</th>
            <th style={th}>Name</th>
            <th style={th}>Report Type</th>
            <th style={th}>File Name</th>
            <th style={th}>Uploaded</th> {/* NEW */}
            <th style={th}>User ID</th>
            <th style={th}>View</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((report) => (
            <tr key={report.id} style={{ textAlign: "center" }}>
              <td style={td}>{report.category}</td>
              <td style={td}>{report.entity}</td>
              <td style={td}>
                {editReportId === report.id ? (
                  <select
                    value={editReportType}
                    onChange={(e) => setEditReportType(e.target.value)}
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
              <td style={td}>{report.fileName}</td>
              <td style={td}>
                {report.uploadedAt ? formatDDMMYY(report.uploadedAt) : "-"}
              </td>
              <td style={td}>{report.userUniqueId}</td>
              <td style={td}>
                <button
                  onClick={() => handleView(report.fileUrl)}
                  style={{
                    color: "#2b6777",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    paddingRight: 10,
                    paddingLeft: 10,
                    paddingTop: 8,
                    paddingBottom: 8,
                  }}
                >
                  View
                </button>
              </td>
              <td style={td}>
                {editReportId === report.id ? (
                  <>
                    <button onClick={() => handleUpdate(report.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditReportId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(report)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(report.id)}>
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {currentReports.length === 0 && (
            <tr>
              <td colSpan="8" style={{ padding: "20px", color: "#777" }}>
                No reports uploaded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={paginationStyle}>
        <button
          style={{
            ...paginationBtnStyle,
            ...(currentPage === 1 && disabledBtnStyle),
          }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <div style={pageNumbersStyle}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              style={{
                ...paginationBtnStyle,
                ...(currentPage === n && activePageBtnStyle),
              }}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          style={{
            ...paginationBtnStyle,
            ...(currentPage === totalPages && disabledBtnStyle),
          }}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportUpload;

// Styles
const th = { padding: "12px", fontSize: "14px" };
const td = { padding: "10px", fontSize: "13px" };

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

const pageNumbersStyle = { display: "flex", gap: "8px" };

const activePageBtnStyle = {
  backgroundColor: "#0a5e52",
  color: "#fff",
  border: "none",
};

const disabledBtnStyle = {
  backgroundColor: "#eee",
  color: "#999",
  cursor: "not-allowed",
};
