// src/components/TeacherDetails.jsx
import React from 'react';

const TeacherDetails = () => {
  const teacherData = {
    name: 'Red John',
    subject: 'Mathematics',
    experience: '10 years',
    email: 'red.john@example.com',
    phone: '+1 (555) 123-4567',
    about: 'Red John is an experienced Mathematics teacher who specializes in Algebra and Calculus. He has a passion for teaching and helping students develop a love for the subject.'
  };

  return (
    <div className="p-6 rounded shadow-md w-full h-full flex flex-col justify-top bg-sky-200 rounded-xl shadow-lg">
      <h2 className="text-5xl font-bold mb-4">Teacher Details</h2>
      <div className="text-lg justify-center p-5">
        <p><strong>Name:</strong> {teacherData.name}</p>
        <p><strong>Subject:</strong> {teacherData.subject}</p>
        <p><strong>Experience:</strong> {teacherData.experience}</p>
        <p><strong>Email:</strong> {teacherData.email}</p>
        <p><strong>Phone:</strong> {teacherData.phone}</p>
        <p><strong>About:</strong> {teacherData.about}</p>
      </div>
    </div>
  );
};

export default TeacherDetails;
