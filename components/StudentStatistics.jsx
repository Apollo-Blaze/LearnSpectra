import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  

const StudentStatistics = () => {
  const [className, setClassName] = useState("");
  const [questionPaperName, setQuestionPaperName] = useState("");
  const [qnNumber, setQnNumber] = useState(""); // Updated state for question number
  const navigate = useNavigate();

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleQuestionPaperNameChange = (e) => {
    setQuestionPaperName(e.target.value); // Updated handler for question paper name
  };

  const handleQnNumberChange = (e) => {
    setQnNumber(e.target.value); // Updated handler for question number
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (className && questionPaperName && qnNumber) {
      try {
        // Send a POST request to the specified endpoint with query parameters


        // Navigate to the statistics page, passing the parameters in the route
        // navigate(
        //   `/statistics?className=${encodeURIComponent(
        //     className
        //   )}&questionPaperName=${encodeURIComponent(
        //     questionPaperName
        //   )}&qnNumber=${encodeURIComponent(qnNumber)}`,
        //   { state: { data: response.data } }
        // );
        navigate(
          `/statistics?className=${encodeURIComponent(
            className
          )}&questionPaperName=${encodeURIComponent(
            questionPaperName
          )}&qnNumber=${encodeURIComponent(qnNumber)}`
        );
      } catch (error) {
        console.error(
          "Error sending data:",
          error.response?.data || error.message
        );
        alert("An error occurred while sending the data.");
      }
    } else {
      alert(
        "Please provide classroom name, question paper name, and question number."
      );
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-lg w-full min-h-[500px] bg-red-300 flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-md">
        <h2 className="text-6xl font-bold mb-4 text-center">
          Student Statistics
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="class-name" className="text-lg font-medium">
              Classroom Name
            </label>
            <input
              id="class-name"
              type="text"
              value={className}
              onChange={handleClassNameChange}
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="question-paper-name"
              className="text-lg font-medium"
            >
              Question Paper Name
            </label>
            <input
              id="question-paper-name"
              type="text"
              value={questionPaperName}
              onChange={handleQuestionPaperNameChange} // Updated handler
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="question-number" className="text-lg font-medium">
              Question Number
            </label>
            <input
              id="question-number"
              type="text"
              value={qnNumber}
              onChange={handleQnNumberChange} // Updated handler
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            View Statistics
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentStatistics;
