// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import AddClassroomWithStudents from './pages/AddClassroomWithStudents';
import UploadPDF from './pages/UploadPDF';
import QuestionForm from './pages/Quiz';

import Topic from './pages/Topics';
import StudentPage from './pages/Student';
import Statistics from './components/Statistics';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-10 "> {/* Adjust padding to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-classroom" element={<AddClassroomWithStudents />} />
          <Route path="/upload-pdf" element={<UploadPDF />} />
          <Route path="/upload-question" element={<QuestionForm />} />
          <Route path="/topics" element={<Topic />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/statistics" element={<Statistics/>}/> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
