import React from "react";
import {
  FaTachometerAlt,
  FaUser,
  FaImage,
  FaUsers,
  FaCloudUploadAlt,
  FaSchool,
  FaUniversity,
  FaIndustry,
} from "react-icons/fa";
import logos from "../assets/images/logos.png";

// 👇 Sidebar items
const allSidebarLinks = [
  { icon: FaTachometerAlt, label: "Dashboard", path: "/dashboard" },
  { icon: FaSchool, label: "Schools Data", path: "/SchoolData" },
  { icon: FaUniversity, label: "Institutes Data", path: "/InstitutesData" },
  { icon: FaIndustry, label: "Industries Data", path: "/IndustriesData" },
  { icon: FaUser, label: "User Data", path: "/user-data" },
  { icon: FaImage, label: "Banner", path: "/banner" },
  { icon: FaCloudUploadAlt, label: "Report Upload", path: "/report-upload" },
  { icon: FaUsers, label: "Teams", path: "/teams" },
];

const Sidebar = () => {
  const member = JSON.parse(localStorage.getItem("member"));
  const allowedLinks = member?.selectedSidebarLinks || [];

  const filteredLinks = allSidebarLinks.filter((link) =>
    allowedLinks.includes(link.label)
  );

  return (
    <div style={wrapperStyle}>
      <div className="sidebar-container" style={sidebarStyle}>
        {/* Logo */}
        <div style={logoContainerStyle}>
          <img
            src={logos}
            alt="Logo"
            className="sidebar-logo"
            style={logoStyle}
          />
        </div>

        {/* Links */}
        <ul style={listStyle}>
          {filteredLinks.map((item) => (
            <li key={item.label} style={listItemStyle}>
              <a href={item.path} style={linkStyle}>
                <div style={iconTextWrapper}>
                  <item.icon style={iconStyle} />
                  <span className="sidebar-label" style={labelStyle}>
                    {item.label}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

// ✅ Styles
const wrapperStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  zIndex: 999,
};

const sidebarStyle = {
  width: "70px",
  height: "100vh",
  backgroundColor: "#BCE2B9",
  padding: "20px 10px",
  boxSizing: "border-box",
  overflow: "hidden",
  whiteSpace: "nowrap",
  transition: "width 0.3s ease-in-out",
};

const logoContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
};

const logoStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "6px",
  transition: "all 0.3s ease",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const listItemStyle = {
  marginBottom: "16px",
};

const linkStyle = {
  display: "flex",
  alignItems: "center",
  padding: "4px",
  borderRadius: "8px",
  color: "#000",
  textDecoration: "none",
  transition: "background-color 0.2s",
};

const iconTextWrapper = {
  display: "flex",
  alignItems: "center",
};

const iconStyle = {
  fontSize: "18px",
  minWidth: "24px",
  textAlign: "center",
  color: "#0A5E52",
};

const labelStyle = {
  marginLeft: "12px",
  fontSize: "15px",
  fontWeight: 600,
  opacity: 0,
  whiteSpace: "nowrap",
  transition: "opacity 0.3s ease-in-out",
  fontWeight: 600,
};

// ✅ Inject CSS for hover behavior (runs once on mount)
const css = `
.sidebar-container:hover {
  width: 250px !important;
}
.sidebar-container:hover .sidebar-label {
  opacity: 1 !important;
}
.sidebar-container:hover .sidebar-logo {
  width: 100px !important;
  height: auto !important;
}
`;
const styleTag = document.createElement("style");
styleTag.appendChild(document.createTextNode(css));
document.head.appendChild(styleTag);
