// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import doctorsImage from "../assets/images/doctorrs.png";
// import house from "../assets/images/house.png";
// import industryImage from "../assets/images/indus.png";
// import instituteImage from "../assets/images/institute.png";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Function to get specific image for each card
// const getImageForCard = (title) => {
//   if (title.includes("Schools")) return house;
//   if (title.includes("Industries")) return industryImage;
//   if (title.includes("Institutes")) return instituteImage;
//   return doctorsImage;
// };

// // Function to get navigation path
// const getNavigationPath = (title) => {
//   if (title.includes("Schools")) return "/SchoolData";
//   if (title.includes("Industries")) return "/IndustriesData";
//   if (title.includes("Institutes")) return "/InstitutesData";
//   return "/";
// };

// const options = {
//   responsive: true,
//   plugins: {
//     title: {
//       display: true,
//       text: "Activity Statistics",
//       font: {
//         size: 16,
//       },
//     },
//     legend: {
//       position: "top",
//     },
//   },
//   scales: {
//     x: { beginAtZero: true },
//     y: { beginAtZero: true },
//   },
// };

// const DashboardContent = () => {
//   const navigate = useNavigate();
//   const [cardData, setCardData] = useState([
//     {
//       date: "Loading...",
//       title: "No. of Schools attended Camp",
//       status: "0",
//       color: "#0a5e52",
//     },
//     {
//       date: "Loading...",
//       title: "No. of Industries attended Camp",
//       status: "0",
//       color: "#EF5350",
//     },
//     {
//       date: "Loading...",
//       title: "No. of Institutes attended Camp",
//       status: "0",
//       color: "#FB8C00",
//     },
//   ]);
//   const [chartData, setChartData] = useState({
//     labels: ["Schools", "Institutes", "Industries"],
//     datasets: [
//       {
//         label: "Entity Counts",
//         data: [0, 0, 0], // Initial placeholder values
//         backgroundColor: ["#0a5e52", "#FF6384", "#FFCE56"],
//         borderColor: ["#0a5e52", "#D94F70", "#D9A33C"],
//         borderWidth: 1,
//       },
//     ],
//   });

//   // Fetch counts from API
//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         // Fetch counts from the API endpoints
//         const [schoolsResponse, institutesResponse, industriesResponse] =
//           await Promise.all([
//             fetch("http://192.168.1.230:8011/api/schools/count"),
//             fetch("http://192.168.1.230:8011/api/institutes/count"),
//             fetch("http://192.168.1.230:8011/api/industries/count"),
//           ]);

//         const schoolsData = await schoolsResponse.json();
//         const institutesData = await institutesResponse.json();
//         const industriesData = await industriesResponse.json();

//         // Update cardData with fetched counts
//         setCardData([
//           {
//             date: new Date().toLocaleDateString(), // Current date
//             title: "No. of Schools attended Camp",
//             status: schoolsData.count || "0",
//             color: "#00ACC1",
//           },
//           {
//             date: new Date().toLocaleDateString(),
//             title: "No. of Industries attended Camp",
//             status: industriesData.count || "0",
//             color: "#EF5350",
//           },
//           {
//             date: new Date().toLocaleDateString(),
//             title: "No. of Institutes attended Camp",
//             status: institutesData.count || "0",
//             color: "#FB8C00",
//           },
//         ]);

//         // Update chartData with fetched counts
//         setChartData({
//           labels: ["Schools", "Institutes", "Industries"],
//           datasets: [
//             {
//               label: "Entity Counts",
//               data: [
//                 schoolsData.count || 0,
//                 institutesData.count || 0,
//                 industriesData.count || 0,
//               ],
//               backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
//               borderColor: ["#2A8ABF", "#D94F70", "#D9A33C"],
//               borderWidth: 1,
//             },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching counts:", error);
//       }
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         padding: "10px",
//         backgroundColor: "#F3FAFF",
//         fontFamily: "Poppins, sans-serif",
//         marginTop: 40,
//         width: 1300,
//         paddingTop: 100,
//         paddingLeft: 30,
//         marginLeft: 50,
//       }}
//     >
//       {/* Cards Row */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
//         <div
//           style={{
//             padding: "20px",
//             width: "230px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <img
//             src={doctorsImage}
//             alt="doctor illustration"
//             style={{
//               width: 250,
//               height: 500,
//               borderRadius: "8px",
//             }}
//           />
//         </div>

//         {cardData.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => navigate(getNavigationPath(item.title))}
//             style={{
//               backgroundColor: "#fff",
//               padding: "20px",
//               borderRadius: "12px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
//               width: "260px",
//               height: "130px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               cursor: "pointer",
//               transition: "transform 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = "scale(1.03)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = "scale(1)";
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "flex-start" }}>
//               <div
//                 style={{
//                   width: "6px",
//                   height: "60px",
//                   borderRadius: "3px",
//                   marginRight: "16px",
//                   background: `linear-gradient(to bottom, ${item.color}50, ${item.color})`,
//                 }}
//               ></div>

//               <div>
//                 <div
//                   style={{
//                     fontSize: "13px",
//                     color: "#666",
//                     marginBottom: "6px",
//                   }}
//                 >
//                   {item.date}
//                 </div>
//                 <div
//                   style={{ fontWeight: 600, fontSize: "16px", color: "#111" }}
//                 >
//                   {item.title}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "14px",
//                     color: "#6B7280",
//                     marginTop: "4px",
//                   }}
//                 >
//                   {item.status}
//                 </div>
//               </div>
//             </div>

//             <img
//               src={getImageForCard(item.title)}
//               alt="category"
//               style={{ width: 40, height: 40 }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Bar Chart */}
//       {/* <div
//         style={{
//           marginTop: "40px",
//           backgroundColor: "#fff",
//           padding: "20px",
//           borderRadius: "12px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
//           width: "600px",
//         }}
//       >
//         <Bar options={options} data={chartData} />
//       </div> */}
//     </div>
//   );
// };

// export default DashboardContent;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import doctorsImage from "../assets/images/doctorrs.png";
import house from "../assets/images/house.png";
import industryImage from "../assets/images/indus.png";
import instituteImage from "../assets/images/institute.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Function to get specific image for each card
const getImageForCard = (title) => {
  if (title.includes("Schools")) return house;
  if (title.includes("Industries")) return industryImage;
  if (title.includes("Institutes")) return instituteImage;
  return doctorsImage;
};

// Function to get navigation path
const getNavigationPath = (title) => {
  if (title.includes("Schools")) return "/SchoolData";
  if (title.includes("Industries")) return "/IndustriesData";
  if (title.includes("Institutes")) return "/InstitutesData";
  return "/";
};

// dd/mm/yyyy formatter
const formatDDMMYYYY = (dateLike) => {
  const d = new Date(dateLike);
  if (isNaN(d)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Activity Statistics",
      font: { size: 16 },
    },
    legend: { position: "top" },
  },
  scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
};

const DashboardContent = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([
    {
      date: "Loading...",
      title: "No. of Schools attended Camp",
      status: "0",
      color: "#0a5e52",
    },
    {
      date: "Loading...",
      title: "No. of Industries attended Camp",
      status: "0",
      color: "#EF5350",
    },
    {
      date: "Loading...",
      title: "No. of Institutes attended Camp",
      status: "0",
      color: "#FB8C00",
    },
  ]);

  const [chartData, setChartData] = useState({
    labels: ["Schools", "Institutes", "Industries"],
    datasets: [
      {
        label: "Entity Counts",
        data: [0, 0, 0],
        backgroundColor: ["#0a5e52", "#FF6384", "#FFCE56"],
        borderColor: ["#0a5e52", "#D94F70", "#D9A33C"],
        borderWidth: 1,
      },
    ],
  });

  // Fetch counts from API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [schoolsResponse, institutesResponse, industriesResponse] =
          await Promise.all([
            fetch("http://192.168.1.230:8011/api/schools/count"),
            fetch("http://192.168.1.230:8011/api/institutes/count"),
            fetch("http://192.168.1.230:8011/api/industries/count"),
          ]);

        const schoolsData = await schoolsResponse.json();
        const institutesData = await institutesResponse.json();
        const industriesData = await industriesResponse.json();

        const today = formatDDMMYYYY(new Date());

        // Update cardData with fetched counts
        setCardData([
          {
            date: today,
            title: "No. of Schools attended Camp",
            status: schoolsData.count || "0",
            color: "#00ACC1",
          },
          {
            date: today,
            title: "No. of Industries attended Camp",
            status: industriesData.count || "0",
            color: "#EF5350",
          },
          {
            date: today,
            title: "No. of Institutes attended Camp",
            status: institutesData.count || "0",
            color: "#FB8C00",
          },
        ]);

        // Update chartData with fetched counts
        setChartData({
          labels: ["Schools", "Institutes", "Industries"],
          datasets: [
            {
              label: "Entity Counts",
              data: [
                schoolsData.count || 0,
                institutesData.count || 0,
                industriesData.count || 0,
              ],
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
              borderColor: ["#2A8ABF", "#D94F70", "#D9A33C"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        backgroundColor: "#F3FAFF",
        fontFamily: "Poppins, sans-serif",
        marginTop: 40,
        width: 1300,
        paddingTop: 100,
        paddingLeft: 30,
        marginLeft: 50,
      }}
    >
      {/* Cards Row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div
          style={{
            padding: "20px",
            width: "230px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={doctorsImage}
            alt="doctor illustration"
            style={{ width: 250, height: 500, borderRadius: "8px" }}
          />
        </div>

        {cardData.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(getNavigationPath(item.title))}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              width: "260px",
              height: "130px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "6px",
                  height: "60px",
                  borderRadius: "3px",
                  marginRight: "16px",
                  background: `linear-gradient(to bottom, ${item.color}50, ${item.color})`,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "6px",
                  }}
                >
                  {item.date}
                </div>
                <div
                  style={{ fontWeight: 600, fontSize: "16px", color: "#111" }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    marginTop: "4px",
                  }}
                >
                  {item.status}
                </div>
              </div>
            </div>

            <img
              src={getImageForCard(item.title)}
              alt="category"
              style={{ width: 40, height: 40 }}
            />
          </div>
        ))}
      </div>

      {/* If you re-enable the chart, nothing else needs to change */}
      {/* <div style={{ marginTop: "40px", backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", width: "600px" }}>
        <Bar options={options} data={chartData} />
      </div> */}
    </div>
  );
};

export default DashboardContent;
