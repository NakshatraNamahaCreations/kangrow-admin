import React, { useState } from "react";
import right from "../assets/images/right.jpg"; // Make sure the path is correct

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    alert("Your message has been sent!");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div style={outerWrapperStyle}>
      <div style={innerWrapperStyle}>
        {/* Left Side: Image */}
        <div style={imageWrapperStyle}>
          <img
            src={right}
            alt="doctor illustration"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right Side: Form */}
        <div style={formWrapperStyle}>
          <h2 style={titleStyle}>
            Say Hello{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h2>

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Full Name <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Phone Number <span style={requiredStyle}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Email <span style={requiredStyle}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Message <span style={requiredStyle}>*</span>
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Enter your message..."
                value={formData.message}
                onChange={handleChange}
                required
                style={{ ...inputStyle, resize: "none", minHeight: "100px" }}
              />
            </div>

            <button type="submit" style={buttonStyle}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;

// ✅ Inline Styles

const outerWrapperStyle = {
  padding: "40px 20px",
  fontFamily: "Poppins, sans-serif",
  background: "#f7fafc",
};

const innerWrapperStyle = {
  maxWidth: "1200px",
  margin: "auto",
  display: "flex",
  gap: "40px",
  background: "#fff",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
  alignItems: "flex-start",
};

const imageWrapperStyle = {
  flex: "1",
};

const formWrapperStyle = {
  flex: "1",
  width: 1000,
};

const titleStyle = {
  fontSize: "26px",
  fontWeight: "600",
  marginBottom: "24px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const fieldGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "6px",
  fontWeight: "500",
  fontSize: "14px",
  color: "#2d3748",
};

const requiredStyle = {
  color: "red",
};

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #cbd5e0",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const buttonStyle = {
  backgroundColor: "#31918F",
  color: "#fff",
  padding: "14px",
  fontWeight: "600",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background 0.3s",
};
