import React, { useState } from 'react';
import axios from 'axios';

const FileUploadQuestion = () => {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState('');
  const question = "Above given is a chapter that a teacher is teaching a class. Understand the text and suggest 3 relevant hot topics, reference links and 3 assignments related to this chapter. The output should be in the format: Hot Relevant Topics:{} Reference Links: {} Suitable Assignments:{}";

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0 || !question) {
      alert('Please provide a file and a question.');
      return;
    }

    const formData = new FormData();
    formData.append('question', question);
    files.forEach((file) => {
      formData.append('pdfs', file);
    });

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Remove stars (*) from the response text
      const cleanedResponse = response.data.aiResponse.replace(/\*/g, '');

      setResponse(cleanedResponse); // Set the cleaned response
    } catch (error) {
      console.error('Error uploading file and question:', error);
      setResponse('An error occurred while uploading.');
    }
  };

  return (
    <div className="bg-red-100 min-h-screen flex items-center justify-center p-6">
    <div className="p-8 max-w-3xl mx-auto bg-slate-800 text-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Upload File and Ask a Question</h2>
      <form onSubmit={handleSubmit} className="flex flex-col text-white gap-6">
        <div className="flex flex-col text-white gap-2">
          <label htmlFor="pdf-files" className="text-lg font-medium text-white">Select file(s)</label>
          <input
            id="pdf-files"
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Submit
        </button>
      </form>
      {response && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Response:</h3>
          <pre className="whitespace-pre-wrap break-words text-gray-800">
            {response}
          </pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default FileUploadQuestion;
