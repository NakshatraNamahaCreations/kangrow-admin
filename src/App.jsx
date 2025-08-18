import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import DashboardContent from "./components/DashboardContent";
import UserData from "./components/UserData";
import Banner from "./components/Banner";
import Teams from "./components/Teams";
import ReportUpload from "./components/ReportUpload";
import Settings from "./components/Settings";
import Enquiry from "./components/Enquiry";
import SchoolData from "./components/SchoolData";
import BulkUser from "./components/BulkUser";
import InstitutesData from "./components/InstitutesData";
import IndustriesData from "./components/IndustriesData";
import Login from "./components/Login";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", overflow:'hidden' }}>
      {!isLoginPage && <Sidebar />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!isLoginPage && <TopNav />}
        <div
          style={{
            padding: isLoginPage ? "0" : "20px",
            backgroundColor: isLoginPage ? "#f3f4f6" : "#ffffff",
            width: isLoginPage ? "100%" : 900,
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/user-data" element={<UserData />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/schooldata" element={<SchoolData />} />
            <Route path="/institutesdata" element={<InstitutesData />} />
            <Route path="/industriesdata" element={<IndustriesData />} />
            <Route path="/report-upload" element={<ReportUpload />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/bulkuser" element={<BulkUser />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;