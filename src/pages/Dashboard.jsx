import React from "react";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <DashboardCard title="Total Users" count="1,234" />
      <DashboardCard title="Active Subscriptions" count="567" />
      <DashboardCard title="Total Sales" count="$12,345" />
    </div>
  );
};

export default Dashboard;
