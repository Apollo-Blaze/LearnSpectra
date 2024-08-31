// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-950 p-4 text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">LearnSpectra</Link>
        <ul className="flex space-x-6">
        <li>
            <Link to="/student" className="hover:underline font-semibold">Student History</Link>
          </li>
        <li>
            <Link to="/upload-question" className="hover:underline font-semibold">Create Quiz</Link>
          </li>
          <li>
            <Link to="/upload-pdf" className="hover:underline font-semibold">Response Portal</Link>
          </li>
          <li>
            <Link to="/topics" className="hover:underline font-semibold">Course Navigator</Link>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
