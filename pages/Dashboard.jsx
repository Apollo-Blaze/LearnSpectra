import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import ClassroomSelector from '../components/ClassroomSelector';
import StudentStatistics from '../components/StudentStatistics';
import TeacherDetails from '../components/TeacherDetails';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classrooms, setClassrooms] = useState(['Classroom A', 'Classroom B', 'Classroom C']);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.newClassroom) {
      const newClassroom = location.state.newClassroom;
      setClassrooms((prev) => [...prev, newClassroom]);
      setSelectedClass(newClassroom);
    }
  }, [location.state]);

  const handleClassSelect = (classroom) => {
    setSelectedClass(classroom);
  };

  return (
    <div className="bg-gray-100 p-8 pt-20"> {/* Added pt-20 to account for the navbar height */}
      {/*<Navbar />} {/* Add Navbar here */}
      
      {/* First row with two boxes side by side */}
      <div className="flex gap-4 min-h-[50vh]">
        <div className="flex-1 min-h-full flex items-center justify-center bg-sky-200 rounded-xl border-2 border-black">
          <TeacherDetails />
        </div>
        <div className="flex-1 min-h-full flex items-center justify-center bg-lime-50 rounded-xl border-2 border-black">
          <ClassroomSelector 
            selectedClass={selectedClass}
            onClassSelect={handleClassSelect}
            classrooms={classrooms}
          />
        </div>
      </div>

      {/* Long box containing statistics */}
      <div className="mt-4 flex-1 min-h-[50vh] flex items-center justify-center bg-lime-50 rounded-xl border-2 border-black">
        <StudentStatistics />
      </div>
    </div>
  );
};

export default Dashboard;
