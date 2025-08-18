import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Fetch banners
  useEffect(() => {
    fetchBanners();
  }, [currentPage]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get("http://192.168.1.230:8011/api/banners");
      setBanners(response.data.banners);
      setTotalPages(Math.ceil(response.data.banners.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching banners:", error);
      alert(error.response?.data?.error || "Failed to fetch banners");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://192.168.1.230:8011/api/banners/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setBanners([response.data.banner, ...banners]);
      setSelectedFile(null);
      document.getElementById("bannerInput").value = ""; // Reset file input
      fetchBanners();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to upload banner");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await axios.delete(`http://192.168.1.230:8011/api/banners/${id}`);
        setBanners(banners.filter((banner) => banner._id !== id));
        fetchBanners();
      } catch (error) {
        alert(error.response?.data?.error || "Failed to delete banner");
      }
    }
  };

  // Pagination
  const paginatedBanners = banners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Left: Add Banner Form */}
        <div style={formContainerStyle}>
          <h2 style={headingStyle}>Add Banner</h2>
          <p style={infoTextStyle}>
            Banner Image:{" "}
            <strong>( Recommended Size: 625 x 250 pixels )</strong>
          </p>
          <input
            id="bannerInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={fileInputStyle}
          />
          <button style={uploadBtnStyle} onClick={handleUpload}>
            Upload
          </button>
        </div>

        {/* Right: Banner List Table */}
        <div style={tableContainerStyle}>
          <h2 style={headingStyle}>Banner List</h2>
          {banners.length === 0 ? (
            <p style={emptyTextStyle}>No banners uploaded yet.</p>
          ) : (
            <>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeaderRowStyle}>
                    <th style={tableHeaderCell}>Sl.No</th>
                    <th style={tableHeaderCell}>Image</th>
                    <th style={tableHeaderCell}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBanners.map((banner, index) => (
                    <tr key={banner._id} style={tableRowStyle}>
                      <td style={tableCell}>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td style={tableCell}>
                        <img
                          src={banner.imageUrl} // ✅ Use returned image URL
                          alt={`Banner ${index + 1}`}
                          style={bannerImageStyle}
                        />
                      </td>
                      <td style={tableCell}>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          style={deleteBtnStyle}
                        >
                          <FaTrashAlt style={deleteIconStyle} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div style={paginationStyle}>
                <button
                  style={paginationBtnStyle}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  fontFamily: "Poppins, sans-serif",
  background: "#f4f8fb",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  marginTop: 40,
  width: 1250,
  paddingRight: 30,
  paddingTop: 30,
  paddingLeft: 60,
};

const contentStyle = {
  display: "flex",
  gap: "30px",
  maxWidth: "100%",
};

const formContainerStyle = {
  flex: 1,
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  height: "fit-content",
  width: 1000,
};

const headingStyle = {
  fontSize: "20px",
  fontWeight: "700",
  marginBottom: "20px",
};

const infoTextStyle = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "10px",
};

const fileInputStyle = {
  marginBottom: "15px",
  padding: "8px",
  width: "100%",
};

const uploadBtnStyle = {
  backgroundColor: "#0a5e52",
  color: "#fff",
  padding: "8px 20px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
};

const tableContainerStyle = {
  flex: 2,
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  marginBottom: 300,
};

const emptyTextStyle = {
  fontStyle: "italic",
  color: "#888",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeaderRowStyle = {
  backgroundColor: "#f0f0f0",
  height: "50px",
};

const tableHeaderCell = {
  textAlign: "left",
  padding: "10px 15px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#374151",
};

const tableRowStyle = {
  backgroundColor: (props, index) => (index % 2 === 0 ? "#fff" : "#f9f9f9"),
  height: "80px",
};

const tableCell = {
  padding: "10px 15px",
  fontSize: "14px",
  color: "#111827",
  verticalAlign: "middle",
};

const bannerImageStyle = {
  height: "60px",
  borderRadius: "10px",
  objectFit: "cover",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const deleteBtnStyle = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const deleteIconStyle = {
  color: "#EF4444",
  fontSize: "18px",
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
};

const paginationBtnStyle = {
  backgroundColor: "#0a5e52",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  margin: "0 5px",
  opacity: (props) => (props.disabled ? 0.6 : 1),
};

export default Banner;
