import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);

  // Fetch user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = JSON.parse(localStorage.getItem("admin"));

    if (admin && token) {
      setUserId(admin._id);
      setUsername(admin.username);
      setEmail(admin.email);
      // Use profilePicture as-is if it’s a full URL, otherwise prepend base URL
      const imageUrl = admin.profilePicture
        ? admin.profilePicture.startsWith("http")
          ? admin.profilePicture
          : `https://api.svkangrowhealth.com${admin.profilePicture}`
        : null;
      setProfileImage(imageUrl);
      console.log("Initial profile image URL:", imageUrl);
    }
  }, []);

  // Handle new image preview
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      console.log("Preview image URL:", previewUrl);
    }
  };

  // Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token || !userId) {
      setError("You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (profileImage instanceof File) {
      formData.append("profilePicture", profileImage);
    }

    try {
      const response = await axios.put(
        `https://api.svkangrowhealth.com/api/admin/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedAdmin = response.data.admin;
      localStorage.setItem("admin", JSON.stringify(updatedAdmin));

      // Use profilePicture as-is if it’s a full URL, otherwise prepend base URL
      const newImageUrl = updatedAdmin.profilePicture
        ? updatedAdmin.profilePicture.startsWith("http")
          ? updatedAdmin.profilePicture
          : `https://api.svkangrowhealth.com${updatedAdmin.profilePicture}`
        : null;
      setProfileImage(newImageUrl);
      setPreviewImage(null);
      setSuccess("Profile updated successfully!");
      console.log("Updated profile image URL:", newImageUrl);
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
      console.error("Update error:", err);
    }
  };

  // Handle image load error
  const handleImageError = (e) => {
    console.error("Image failed to load:", profileImage || previewImage);
    e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Fallback image
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        fontFamily: "Poppins",
        marginLeft: "20%",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "90%",
          maxWidth: "600px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Profile Section */}
        <div>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Edit Profile
          </h3>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={
                previewImage ||
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              onError={handleImageError}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #0a5e52",
                marginBottom: "10px",
              }}
            />
            <label
              htmlFor="profile-image-upload"
              style={{
                backgroundColor: "#38B2AC",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Change Picture
            </label>
            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (optional)"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleProfileUpdate}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#38B2AC",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>

        {/* Status Messages */}
        <div style={{ textAlign: "center" }}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default Settings;
