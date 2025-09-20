import React, { useState, useEffect } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileImg from "../assets/images/logout.png";

const TopNav = ({ onSidebarToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".dropdown-menu") &&
      !e.target.closest(".user-profile")
    ) {
      setShowDropdown(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("member");
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#ffffffff",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "40px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Sidebar Toggle */}
      <div
        onClick={onSidebarToggle}
        style={{
          backgroundColor: "#03A9F4",
          width: "46px",
          height: "46px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        }}
      >
        <FaBars color="#fff" size={20} />
      </div>

      {/* User Profile Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          className="user-profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            position: "relative",
          }}
        >
          <img
            src={ProfileImg}
            alt="user"
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "30%",
              objectFit: "contain",
              cursor: "pointer",
            }}
            onClick={toggleDropdown}
          />

          {showDropdown && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                padding: "10px",
                width: "180px",
                zIndex: 1001,
              }}
            >
              <div
                style={{
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: "6px",
                  transition: "background-color 0.2s",
                }}
                onClick={handleLogout}
              >
                <FaSignOutAlt style={{ marginRight: "10px" }} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
