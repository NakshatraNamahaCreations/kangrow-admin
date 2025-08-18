const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-3xl text-gray-400">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
};

export default DashboardCard;
