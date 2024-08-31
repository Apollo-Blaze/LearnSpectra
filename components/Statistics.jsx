
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register required components for the charts
// ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// const Statistics = () => {
//   const location = useLocation();
//   const [data, setData] = useState(null);
//   const [grammarData, setGrammarData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Extract query parameters from URL
//   const queryParams = new URLSearchParams(location.search);
//   const className = queryParams.get("className");
//   const questionPaperName = queryParams.get("questionPaperName");
//   const qnNumber = queryParams.get("qnNumber");

//   useEffect(() => {
//     // Function to fetch statistics data
//     const fetchData = async () => {
//       try {
//         // Fetch statistics data
//         console.log("entered stas");
//         const response = await axios.post(
//           "http://localhost:3000/api/evaluate-student-answers1",
//           {
//             className,
//             questionPaperName,
//             qnNumber,
//           }
//         );
//         setData(response.data);

//         // Fetch grammatical errors data
//         const grammarResponse = await axios.post(
//           "http://localhost:3000/api/grammar-student-answers1",
//           {
//             className,
//             questionPaperName,
//             qnNumber,
//           }
//         );
//         setGrammarData(grammarResponse.data.errorWordMap);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("An error occurred while fetching the data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [className, questionPaperName, qnNumber]); // Dependencies for useEffect

//   // Prepare bar chart data if data is available
//   const barChartData = {
//     labels: data ? Object.keys(data.missingKeyPointMap) : [],
//     datasets: [
//       {
//         label: "Number of Missing Key Points",
//         data: data
//           ? Object.values(data.missingKeyPointMap).map((arr) => arr.length)
//           : [],
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Bar chart options
//   const barChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             let label = context.dataset.label || "";
//             if (label) {
//               label += ": ";
//             }
//             if (context.parsed.y !== null) {
//               label += context.parsed.y;
//             }
//             return label;
//           },
//         },
//       },
//     },
//   };

//   // Prepare pie chart data if grammar data is available
//   const pieChartData = () => {
//     if (!grammarData) return { labels: [], datasets: [] };

//     // Create data for the pie chart
//     const labels = Object.keys(grammarData);
//     const data = labels.map(
//       (key) => new Set(grammarData[key]).size // Count unique occurrences
//     );

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Grammatical Errors",
//           data,
//           backgroundColor: [
//             "rgba(255, 99, 132, 0.2)",
//             "rgba(54, 162, 235, 0.2)",
//             "rgba(255, 206, 86, 0.2)",
//             "rgba(75, 192, 192, 0.2)",
//             "rgba(153, 102, 255, 0.2)",
//             "rgba(255, 159, 64, 0.2)",
//             "rgba(201, 203, 207, 0.2)",
//           ],
//           borderColor: [
//             "rgba(255, 99, 132, 1)",
//             "rgba(54, 162, 235, 1)",
//             "rgba(255, 206, 86, 1)",
//             "rgba(75, 192, 192, 1)",
//             "rgba(153, 102, 255, 1)",
//             "rgba(255, 159, 64, 1)",
//             "rgba(201, 203, 207, 1)",
//           ],
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   // Pie chart options
//   const pieChartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             let label = context.label || "";
//             if (label) {
//               label += ": ";
//             }
//             if (context.parsed !== null) {
//               label += context.parsed;
//             }
//             return label;
//           },
//         },
//       },
//     },
//   };

//   // Render different states: loading, error, or data display
//   return (
//     <div className="p-6 rounded-xl shadow-lg w-full min-h-[500px] bg-green-300 flex flex-col items-center justify-center gap-8">
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : data && grammarData ? (
//         <div className="flex flex-col w-full max-w-4xl">
//           <div className="flex gap-8">
//             {/* Bar Chart */}
//             <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-center">
//                 Statistics
//               </h2>
//               <Bar data={barChartData} options={barChartOptions} />
//             </div>
//             {/* Pie Chart */}
//             <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg">
//               <h2 className="text-4xl font-bold mb-4 text-center">
//                 Grammatical Errors
//               </h2>
//               <Pie data={pieChartData()} options={pieChartOptions} />
//             </div>
//           </div>
//           <div className="flex flex-col gap-4 w-full mt-8">
//             {Object.keys(data.missingKeyPointMap).map((key) => (
//               <div key={key} className="border p-4 rounded bg-white mb-2">
//                 <h3 className="font-bold text-xl">
//                   Question {key} Missing Key Points:
//                 </h3>
//                 <ul className="list-disc pl-5">
//                   {data.missingKeyPointMap[key].map((name, index) => (
//                     <li key={index}>{name}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div>No data available.</div>
//       )}
//     </div>
//   );
// };

// export default Statistics;



import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required components for the charts
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Statistics = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [grammarData, setGrammarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const className = queryParams.get("className");
  const questionPaperName = queryParams.get("questionPaperName");
  const qnNumber = queryParams.get("qnNumber");

  useEffect(() => {
    // Function to fetch statistics data
    const fetchData = async () => {
      try {
        // Fetch statistics data
        const response = await axios.post(
          "http://localhost:3000/api/evaluate-student-answers1",
          {
            className,
            questionPaperName,
            qnNumber,
          }
        );
        setData(response.data);

        // Fetch grammatical errors data
        const grammarResponse = await axios.post(
          "http://localhost:3000/api/grammar-student-answers1",
          {
            className,
            questionPaperName,
            qnNumber,
          }
        );
        setGrammarData(grammarResponse.data.errorWordMap);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [className, questionPaperName, qnNumber]);

  // Prepare bar chart data if data is available
  const barChartData = {
    labels: data ? Object.keys(data.missingKeyPointMap) : [],
    datasets: [
      {
        label: "Number of Missing Key Points",
        data: data
          ? Object.values(data.missingKeyPointMap).map((arr) => arr.length)
          : [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
  };

  // Prepare pie chart data if grammar data is available
  const pieChartData = () => {
    if (!grammarData) return { labels: [], datasets: [] };

    // Create data for the pie chart
    const labels = Object.keys(grammarData);
    const data = labels.map(
      (key) => new Set(grammarData[key]).size // Count unique occurrences
    );

    return {
      labels,
      datasets: [
        {
          label: "Grammatical Errors",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(201, 203, 207, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          },
        },
      },
    },
  };

  // Render different states: loading, error, or data display
  return (
    <div className="p-6 rounded-xl shadow-lg w-full min-h-[500px] bg-green-300 flex flex-col items-center justify-center gap-8">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : data && grammarData ? (
        <div className="flex flex-col w-full max-w-4xl">
          <div className="flex gap-8">
            {/* Bar Chart */}
            <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-center">
                Statistics
              </h2>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
            {/* Pie Chart */}
            <div className="w-1/2 p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold mb-4 text-center">
                Grammatical Errors
              </h2>
              <Pie data={pieChartData()} options={pieChartOptions} />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full mt-8">
            {Object.keys(data.missingKeyPointMap).map((key) => (
              <div key={key} className="border p-4 rounded bg-white mb-2">
                <h3 className="font-bold text-xl">
                  Question {key} Missing Key Points:
                </h3>
                <ul className="list-disc pl-5">
                  {data.missingKeyPointMap[key].map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
};

export default Statistics;
