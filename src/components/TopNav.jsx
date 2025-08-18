// import React, { useState, useEffect } from "react";
// import { FaBars, FaSignOutAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import ProfileImg from "../assets/images/logout.png";

// const TopNav = ({ onSidebarToggle }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   const toggleDropdown = () => setShowDropdown(!showDropdown);

//   const handleClickOutside = (e) => {
//     if (
//       !e.target.closest(".dropdown-menu") &&
//       !e.target.closest(".user-profile")
//     ) {
//       setShowDropdown(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("member");
//     navigate("/"); // Redirect to login page
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <div
//       style={{
//         backgroundColor: "#ffffffff",
//         padding: "16px 24px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         height: "40px",
//         boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
//       }}
//     >
//       {/* Sidebar Toggle */}
//       <div
//         onClick={onSidebarToggle}
//         style={{
//           backgroundColor: "#0a5e52",
//           width: "46px",
//           height: "46px",
//           borderRadius: "12px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "flex-end",
//           cursor: "pointer",
//           boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
//         }}
//       >
//         <FaBars color="#fff" size={20} />
//       </div>

//       {/* User Profile Dropdown */}
//       <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//         <div
//           className="user-profile"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             position: "relative",
//           }}
//         >
//           <img
//             src={ProfileImg}
//             alt="user"
//             style={{
//               width: "26px",
//               height: "26px",
//               borderRadius: "30%",
//               objectFit: "contain",
//               cursor: "pointer",
//             }}
//             onClick={toggleDropdown}
//           />

//           {showDropdown && (
//             <div
//               className="dropdown-menu"
//               style={{
//                 position: "absolute",
//                 top: "48px",
//                 right: 0,
//                 backgroundColor: "#fff",
//                 boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                 borderRadius: "8px",
//                 padding: "10px",
//                 width: "180px",
//                 zIndex: 1001,
//               }}
//             >
//               <div
//                 style={{
//                   padding: "8px",
//                   display: "flex",
//                   alignItems: "center",
//                   cursor: "pointer",
//                   borderRadius: "6px",
//                   transition: "background-color 0.2s",
//                 }}
//                 onClick={handleLogout}
//               >
//                 <FaSignOutAlt style={{ marginRight: "10px" }} />
//                 Logout
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNav;
import React, { useState, useEffect } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProfileImg from "../assets/images/logout.png";

const TopNav = ({ onSidebarToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ confirm modal state
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setShowDropdown((s) => !s);

  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".dropdown-menu") &&
      !e.target.closest(".user-profile")
    ) {
      setShowDropdown(false);
    }
  };

  // Open confirm modal instead of logging out immediately
  const openConfirmLogout = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setConfirmOpen(true);
  };

  const cancelLogout = () => {
    if (isLoggingOut) return;
    setConfirmOpen(false);
  };

  const doLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("member");
      setConfirmOpen(false);
      navigate("/"); // Redirect to login page
    } finally {
      setIsLoggingOut(false);
    }
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
        // zIndex: 1000,
      }}
    >
      <div
        onClick={onSidebarToggle}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          cursor: "pointer",
        }}
      ></div>
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
                onClick={openConfirmLogout} // ✅ open modal
              >
                <FaSignOutAlt style={{ marginRight: "10px" }} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ✅ Confirm Logout Modal */}
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={cancelLogout}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(420px, 92vw)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              padding: 20,
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 8 }}>Logout?</h3>
            <p style={{ marginTop: 0, marginBottom: 16 }}>
              Are you sure you want to logout?
            </p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                onClick={cancelLogout}
                disabled={isLoggingOut}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={doLogout}
                disabled={isLoggingOut}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#e02424",
                  color: "#fff",
                  cursor: "pointer",
                  opacity: isLoggingOut ? 0.7 : 1,
                }}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;
