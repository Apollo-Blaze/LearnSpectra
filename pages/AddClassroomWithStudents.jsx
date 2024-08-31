// src/components/AddClassroomWithStudents.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const AddClassroomWithStudents = () => {
  const [classroomName, setClassroomName] = useState('');
  const [students, setStudents] = useState(['']);
  const navigate = useNavigate();

  const handleClassroomChange = (e) => {
    setClassroomName(e.target.value);
  };

  const handleStudentChange = (index, e) => {
    const newStudents = [...students];
    newStudents[index] = e.target.value;
    setStudents(newStudents);
  };

  const addStudentField = () => {
    setStudents([...students, '']);
  };

  const removeStudentField = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Data to be sent to the server
    const classroomData = {
      className: classroomName,
      students: students.filter(student => student.trim() !== '') // Filter out empty strings
    };
  
    try {
      // Sending POST request using Axios
      const response = await axios.post('http://localhost:3000/api/create-classroom', classroomData);
      
      console.log('Classroom Created:', response.data); // Logging response from the server
  
      // Optionally, navigate to another page or display a success message
      navigate('/'); // Redirect to the dashboard or another page
    } catch (error) {
      console.error('Error creating classroom:', error);
      // Handle error (e.g., show an error message)
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 py-10 bg-lime-50 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Classroom</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="classroom-name" className="text-sm font-medium">Classroom Name</label>
          <input
            id="classroom-name"
            type="text"
            value={classroomName}
            onChange={handleClassroomChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Students</label>
          {students.map((student, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={student}
                onChange={(e) => handleStudentChange(index, e)}
                className="border p-2 w-full rounded"
                placeholder={`Student ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeStudentField(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStudentField}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Student
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Create Classroom
        </button>
      </form>
    </div>
  );
};

export default AddClassroomWithStudents;
