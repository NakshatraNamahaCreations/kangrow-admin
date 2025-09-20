import React, { useState, useEffect , useRef} from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";


function UserData() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
    const [dateFilter, setDateFilter] = useState("all");
 const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    age: "",
    father: "",
    mother: "",
    place: "",
    status: "unsubscribe",
      category: "", 
  });

  const [users, setUsers] = useState([]);


  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://api.svkangrowhealth.com/api/users/get"
        );
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        const response = await axios.put(
          `https://api.svkangrowhealth.com/api/users/update/${editUserId}`,
          formData
        );
        setUsers(
          users.map((user) =>
            user._id === editUserId ? response.data.data : user
          )
        );
        toast.success("User updated successfully ✅");
      } else {
        const response = await axios.post(
          "https://api.svkangrowhealth.comapi/users/register",
          formData
        );
        setUsers((prev) => [...prev, response.data.data]);
         toast.success("User added successfully 🎉");
      }
      setShowForm(false);
      setEditUserId(null);
      setFormData({
        name: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        age: "",
        father: "",
        mother: "",
        place: "",
        category: "", 
        status: "unsubscribe",
      });
      setCurrentPage(1);
    } catch (error) {
      console.error("Error saving user:", error);
    toast.error(error.response?.data?.error || "Failed to save user ❌");

    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setFormData({
      name: user.name,

      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth.split("T")[0],
      gender: user.gender,
      age: user.age,
      father: user.father,
      mother: user.mother,
      place: user.place,
      status: user.status,
      category: user.category || "", 
    });
    setShowForm(true);
  };

  // Utility function to format date to dd/mm/yyyy
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://api.svkangrowhealth.com/api/users/delete/${id}`);
        setUsers(users.filter((user) => user._id !== id));
         toast.success("User deleted successfully 🗑️");
        const totalPages = Math.ceil(users.length / usersPerPage);
        if (currentPage > totalPages && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      toast.error(error.response?.data?.error || "Failed to delete user ❌");
      }
    }
  };

  //  const getFilteredByDate = () => {
  //   if (dateFilter === "all") return users;

  //   const now = new Date();
  //   let start, end;

  //   if (dateFilter === "thisMonth") {
  //     start = new Date(now.getFullYear(), now.getMonth(), 1);
  //     end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  //   } else if (dateFilter === "lastMonth") {
  //     start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  //     end = new Date(now.getFullYear(), now.getMonth(), 0);
  //   } else if (dateFilter === "custom" && customStart && customEnd) {
  //     start = new Date(customStart);
  //     end = new Date(customEnd);
  //   }

  //   return users.filter((u) => {
  //     if (!u.createdAt) return false;
  //     const created = new Date(u.createdAt);
  //     return created >= start && created <= end;
  //   });
  // };

   const getFilteredByDateAndCategory = () => {
    let filtered = [...users];

    // --- Date filter ---
    if (dateFilter !== "all") {
      const now = new Date();
      let start, end;

      if (dateFilter === "thisMonth") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      } else if (dateFilter === "lastMonth") {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
      } else if (dateFilter === "custom" && customStart && customEnd) {
        start = new Date(customStart);
        end = new Date(customEnd);
      }

      if (start && end) {
        filtered = filtered.filter((u) => {
          if (!u.createdAt) return false;
          const created = new Date(u.createdAt);
          return created >= start && created <= end;
        });
      }
    }

    // --- Category filter ---
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (u) => u.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    return filtered;
  };

const handleDownloadExcel = () => {

  const filtered = getFilteredByDateAndCategory().filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


const sorted = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));


  const excelData = sorted.map((user, index) => ({
    SL: index + 1,
    Name: user.name,
    UniqueId: user.uniqueId || user._id,
    Phone: user.phoneNumber,
    DOB: formatDate(user.dateOfBirth),
    Gender: user.gender,
    Age: user.age,
    Father: user.father,
    Mother: user.mother,
    Place: user.place,
      Category: user.category || "", 
    Status:
    user.status?.toLowerCase() === "subscribe"
      ? "Subscribe"
      : "Unsubscribe",
    "Created Date": formatDate(user.createdAt), // 👈 formatted date
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(dataBlob, "UserData.xlsx");
};

const filteredUsers = getFilteredByDateAndCategory().filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

const indexOfLastUser = currentPage * rowsPerPage;
const indexOfFirstUser = indexOfLastUser - rowsPerPage;
const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const categories = ["all", ...new Set(users.map((u) => u.category).filter(Boolean))];



  return (
    <div style={containerStyle}>
          <Toaster position="top-right" reverseOrder={false} />
      {showForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginBottom: "20px" }}>
              {editUserId ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={formGrid}>
                {[
                  "name",

                  "phoneNumber",
                  "dateOfBirth",
                  "gender",
                  "age",
                  "father",
                  "mother",
                  "place",
                ].map((key) => (
                  <div key={key} style={inputGroupStyle}>
                    <label style={labelStyle}>
                      {key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace("phoneNumber", "Phone Number")
                          .replace("dateOfBirth", "Date of Birth")}
                    </label>
                    <input
                      type={
                        key === "dateOfBirth"
                          ? "date"
                          : key === "age"
                          ? "number"
                          : "text"
                      }
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                ))}
                {/* <div style={inputGroupStyle}>
                  <label style={labelStyle}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={inputStyle} required>
                    <option value="subscribe">Subscribe</option>
                    <option value="unsubscribe">Unsubscribe</option>
                  </select>
                </div> */}
                <div style={inputGroupStyle}>
  <label style={labelStyle}>Category</label>
  <input
    type="text"
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    style={inputStyle}
  />
</div>

              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  style={cancelBtnStyle}
                  onClick={() => {
                    setShowForm(false);
                    setEditUserId(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" style={submitBtnStyle}>
                  {editUserId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={topHeaderStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginLeft: 40 }}>
          Users Details
        </h2>
       <div style={{ display: "flex", gap: "10px", marginRight: 70 }}>

        <select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
  style={{
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  }}
>
  {categories.map((cat, idx) => (
    <option key={idx} value={cat}>
      {cat === "all" ? "All Categories" : cat}
    </option>
  ))}
</select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
          >
            <option value="all">All Data</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Period</option>
          </select>

         {dateFilter === "custom" && (
  <>
   <DatePicker
      selected={customStart ? new Date(customStart) : null}
      onChange={(date) => setCustomStart(date)}
      dateFormat="dd/MM/yyyy"
      placeholderText="dd/mm/yyyy"
      customInput={
        <input
          style={inputStyle} 
          readOnly
        />
      }
    />
  <DatePicker
      selected={customEnd ? new Date(customEnd) : null}
      onChange={(date) => setCustomEnd(date)}
      dateFormat="dd/MM/yyyy"
      placeholderText="dd/mm/yyyy"
      customInput={
        <input
          style={inputStyle} 
          readOnly
        />
      }
    />

  </>
)}


  <button style={addBtnStyle} onClick={() => setShowForm(true)}>
    Add New User
  </button>
          <button style={inviteBtnStyle} onClick={handleDownloadExcel}>
            Download Excel
          </button>
          <button style={inviteBtnStyles} onClick={() => navigate("/BulkUser")}>
            Add Bulk Users
          </button>

        </div>

      </div>

      <input
        type="text"
        placeholder="🔍 Search users by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchInputStyle}
      />

      <div style={{ width: "100%", marginTop: 20 }}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={{ ...thStyle, width: "60px" }}>SL</th>
              <th style={{ ...thStyle, width: "150px" }}>Name</th>

              <th style={{ ...thStyle, width: "110px" }}>Phone</th>
              <th style={{ ...thStyle, width: "100px" }}>DOB</th>
              <th style={{ ...thStyle, width: "80px" }}>Gender</th>
              <th style={{ ...thStyle, width: "60px" }}>Age</th>
              <th style={{ ...thStyle, width: "80px" }}>Father</th>
              <th style={{ ...thStyle, width: "80px" }}>Mother</th>
              <th style={{ ...thStyle, width: "150px" }}>Place</th>
              <th style={{ ...thStyle, width: "90px" }}>Unique ID</th>

              <th style={{ ...thStyle, width: "90px" }}>Status</th>
              <th style={{ ...thStyle, width: "120px" }}>Category</th>

               <th style={{ ...thStyle, width: "110px" }}>Created Date</th>
              <th style={{ ...thStyle, width: "80px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} style={rowStyle}>
                <td style={tdStyle}>
                  {String(indexOfFirstUser + index + 1).padStart(2, "0")}
                </td>
                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt="avatar"
                      style={{ width: 30, height: 30, borderRadius: "50%" }}
                    />
                    <span>{user.name}</span>
                  </div>
                </td>

                <td style={tdStyle}>{user.phoneNumber}</td>
                <td style={tdStyle}>{formatDate(user.dateOfBirth)}</td>
                <td style={tdStyle}>{user.gender}</td>
                <td style={tdStyle}>{user.age}</td>
                <td style={tdStyle}>{user.father}</td>
                <td style={tdStyle}>{user.mother}</td>
                <td style={tdStyle}>{user.place}</td>
                <td style={tdStyle}>{user.uniqueId}</td>

                <td style={tdStyle}>
                <span
  style={{
    padding: "4px 10px",
    borderRadius: "20px",
    fontWeight: 600,
    fontSize: "12px",
    backgroundColor:
      user.status?.toLowerCase() === "subscribe" ? "#DEF7EC" : "#FEE2E2",
    color:
      user.status?.toLowerCase() === "subscribe" ? "#03543F" : "#B91C1C",
  }}
>
  {user.status?.toLowerCase() === "subscribe" ? "Active" : "Inactive"}
</span>

                </td>
                <td style={tdStyle}>{user.category}</td>

                    <td style={tdStyle}>{formatDate(user.createdAt)}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <FaEdit
                    style={{
                      marginRight: 10,
                      cursor: "pointer",
                      color: "#4A5568",
                    }}
                    onClick={() => handleEdit(user)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer", color: "#E53E3E" }}
                    onClick={() => handleDelete(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

   <div style={paginationWrapper}>
  {/* Rows per page selector */}
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <span style={{ fontSize: "14px", color: "#555" }}>Rows per page:</span>
    <select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset to first page
      }}
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
    </select>
  </div>

  {/* Page info */}
  <div style={{ fontSize: "14px", color: "#555" }}>
    {`${indexOfFirstUser + 1}-${Math.min(indexOfLastUser, filteredUsers.length)} of ${filteredUsers.length}`}
  </div>

  {/* Prev Button */}
  <button
    style={{
      ...paginationBtn,
      ...(currentPage === 1 ? disabledBtn : {}),
    }}
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
  >
    ⬅
  </button>

  {/* Next Button */}
  <button
    style={{
      ...paginationBtn,
      ...(currentPage === totalPages ? disabledBtn : {}),
    }}
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    ➡
  </button>
</div>

      </div>
    </div>
  );
}

export default UserData;

// Styles
const containerStyle = {
  padding: "32px",
  fontFamily: "Poppins, sans-serif",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
  width: 1300,
  margin: "0 auto",
  paddingTop: 100,
};

const topHeaderStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const paginationWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "24px",
  gap: "12px",
};
const pageNumbersWrapper = {
  display: "flex",
  gap: "6px",
};

const paginationBtn = {
  padding: "8px 14px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease",
};

const activePageBtn = {
  backgroundColor: "#0a5e52",
  color: "#fff",
  border: "1px solid #0a5e52",
  fontWeight: 600,
};

const disabledBtn = {
  backgroundColor: "#f1f5f9",
  color: "#94a3b8",
  cursor: "not-allowed",
};

const ellipsisStyle = {
  padding: "8px 10px",
  fontSize: "14px",
  color: "#6b7280",
};

const inviteBtnStyle = {
  padding: "10px 16px",
  backgroundColor: "#359834",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Poppins, sans-serif",
  fontSize: 16,
};
const inviteBtnStyles = {
  padding: "10px 16px",
  backgroundColor: "#139786de",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Poppins, sans-serif",
  fontSize: 16,
};

const addBtnStyle = {
  padding: "10px 16px",
  backgroundColor: "#0a5e52",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer",
};

const searchInputStyle = {
  padding: "12px 16px",
  width: "300px",
  borderRadius: "50px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
  marginLeft: 40,
};

const tableStyle = {
  // width: "100%",
  maxWidth: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
  tableLayout: "fixed",
  marginRight: 30,
  marginLeft: 20,
};

const theadStyle = {
  background: "linear-gradient(to right, #0a5e52, #0a5e52)",
  color: "#fff",
};

const thStyle = {
  padding: "10px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "13px",
};

const tdStyle = {
  padding: "10px",
  backgroundColor: "#fff",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
  borderRadius: "6px",
  wordWrap: "break-word",
  overflowWrap: "break-word",
};

const rowStyle = {
  backgroundColor: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  borderRadius: "8px",
};

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
  zIndex: 999,
};

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "30px",
  width: "600px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "6px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#333",
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
};

const cancelBtnStyle = {
  padding: "10px 16px",
  backgroundColor: "#ccc",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  marginRight: "12px",
  cursor: "pointer",
};

const submitBtnStyle = {
  padding: "10px 16px",
  backgroundColor: "#0a5e52",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
};

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
  borderRadius: "8px",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "14px",
};

const pageNumbersStyle = {
  display: "flex",
  gap: "8px",
};

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
const customdateinput = {
 padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
}
