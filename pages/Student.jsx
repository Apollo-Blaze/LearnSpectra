import React, { useState } from 'react';
import axios from 'axios';

const StudentPage = () => {
  const [className, setClassName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [questionPaperName, setQuestionPaperName] = useState('');
  const [qnNumber, setQuestionNumber] = useState('');
  const [answers, setAnswers] = useState('');
  const [essay, setEssay] = useState('');
  const [assessment, setAssessment] = useState('');

  const handleFetchDetails = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/get-student-answer-history', { className, questionPaperName, qnNumber, studentName });
      setAnswers(response.data.answer);
      console.log(response.data.answer);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleUploadEssay = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/assess', { essay });
      setAssessment(response.data.aiResponse);
    } catch (error) {
      console.error('Error uploading essay:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Student Details and Essay Assessment</h1>

      <div className="bg-slate-800 text-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Fetch Student Details</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Question Paper Name"
            value={questionPaperName}
            onChange={(e) => setQuestionPaperName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black"
          />
          <input
            type="text"
            placeholder="Question Number"
            value={qnNumber}
            onChange={(e) => setQuestionNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>
        <button 
          onClick={handleFetchDetails} 
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Fetch Details
        </button>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Student Answers</h3>
          <pre className="bg-gray-50 p-4 border border-gray-200 rounded-md text-black overflow-x-auto whitespace-pre-wrap">{answers}</pre>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upload and Assess Essay</h2>
        <textarea
          placeholder="Enter your essay here..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          className="w-full h-40 p-2 border border-gray-300 rounded-md mb-4 text-black"
        />
        <button 
          onClick={handleUploadEssay} 
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
        >
          Assess Essay
        </button>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Essay Assessment</h3>
          <pre className="bg-gray-50 p-4 border border-gray-200 rounded-md text-black">{assessment}</pre>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
