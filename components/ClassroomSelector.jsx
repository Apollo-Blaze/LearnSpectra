// src/components/ClassroomSelector.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const ClassroomSelector = ({ selectedClass, onClassSelect, classrooms }) => {
  const [classroom, setClassroom] = useState('');
  const [classroomDetails, setClassroomDetails] = useState(null); // State to store classroom details
  const navigate = useNavigate();

  useEffect(() => {
    setClassroom(selectedClass);
  }, [selectedClass]);

  const handleClassroomChange = async (e) => {
    const selectedClassroom = e.target.value;
    setClassroom(selectedClassroom);
    onClassSelect(selectedClassroom);

    try {
      // Make an Axios GET request to fetch classroom details
      const response = await axios.get(`/api/classrooms/${selectedClassroom}`); // Replace with your actual API endpoint
      setClassroomDetails(response.data); // Store the fetched data in state
    } catch (error) {
      console.error('Error fetching classroom details:', error);
    }
  };

  const handleAddClassroom = (e) => {
    e.preventDefault();
    navigate('/add-classroom', { state: { classroomName: classroom } });
  };

  return (
    <div className="p-6 rounded shadow-md w-full h-full flex flex-col bg-lime-50 rounded-xl shadow-lg">
      {classroomDetails ? ( // Show classroom details if available
        <div>
          <h2 className="text-4xl font-bold mb-2">Classroom Details</h2>
          <p><strong>Classroom Name:</strong> {classroomDetails.name}</p>
          <p><strong>Created At:</strong> {classroomDetails.createdAt}</p>
          <p><strong>Number of Students:</strong> {classroomDetails.numberOfStudents}</p> {/* Added number of students */}
          {/* Add more fields as needed */}
        </div>
      ) : (
        <div>
          <h2 className="text-4xl font-bold mb-2">Classroom Selection</h2>
          <form onSubmit={handleAddClassroom} className="flex flex-col flex-grow justify-center gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="classroom-dropdown" className="mt-12 text-sm font-medium">Select Existing Classroom</label>
              <select
                id="classroom-dropdown"
                value={classroom}
                onChange={handleClassroomChange}
                className="border p-2 w-full rounded"
              >
                <option value="" disabled>Select a classroom</option>
                {classrooms.map((cls, index) => (
                  <option key={index} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-2xl justify-center align-middle text-center font-bold">or</p>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ">
                Add Classroom
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClassroomSelector;
