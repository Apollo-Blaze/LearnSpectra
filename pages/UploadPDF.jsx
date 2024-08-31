import React, { useState } from 'react';
import axios from 'axios';

const UploadPDF = () => {
  const [files, setFiles] = useState([]);
  const [className, setClassName] = useState('');
  const [questionPaperName, setQuestionPaperName] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value);
  };

  const handleQuestionPaperNameChange = (e) => {
    setQuestionPaperName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0 || !className || !questionPaperName) {
      alert('Please provide a class name, question paper name, and select at least one file.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('pdfs', file);
    });
    formData.append('className', className);
    formData.append('qnpaperName', questionPaperName);

    try {
      const response = await axios.post('http://localhost:3000/api/upload-pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading PDFs:', error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Answers Sheets</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="class-name" className="text-sm font-medium">Classroom Name</label>
            <input
              id="class-name"
              type="text"
              value={className}
              onChange={handleClassNameChange}
              className="border p-2 w-full rounded text-black"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="question-paper-name" className="text-sm font-medium">Question Paper Name</label>
            <input
              id="question-paper-name"
              type="text"
              value={questionPaperName}
              onChange={handleQuestionPaperNameChange}
              className="border p-2 w-full rounded text-black"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="pdf-files" className="text-sm font-medium">Select PDFs of Students (Name the file with their corresponding name)</label>
            <input
              id="pdf-files"
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="border p-2 w-full rounded text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Upload PDFs
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPDF;
