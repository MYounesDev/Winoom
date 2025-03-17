import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from "@/app/Home";
import React, { useState } from "react";
import axios from "axios";

// Import all page components
import Settings from '@/pages/Settings';
import Calendar from '@/pages/Calendar';
import Class from '@/pages/Class';
import Homework from '@/pages/Homework';
import Lessons from '@/pages/Lessons';
import Books from '@/pages/Books';
import Classes from '@/pages/Classes';
import Students from '@/pages/Students';
import Notes from '@/pages/Notes';
import Reports from '@/pages/Reports';

// Define a type for the user role
type UserRole = 'Student' | 'Teacher' | 'Advisor' | null;

// Create a wrapper component that uses hooks inside Router context
const ButtonsWithNavigation = () => {
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const navigate = useNavigate();

  // Function to handle button click with proper typing
  const handleButtonClick = async (requestType: UserRole) => {
    try {
      // Set the selected role
      setSelectedRole(requestType);
      
      // Send POST request to the server
      await axios.post("http://localhost:5000/api/sendData", { data: requestType })
        .then((response) => {
          setMessage(response.data.message); // Set success message from server
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error sending data:", error);
          setMessage("Error sending data.");
        });

      // Navigate to the Home page after API request and pass the selected role
      navigate('/home', { state: { role: requestType } });
    } catch (error) {
      console.error(`Error with ${requestType} request:`, error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-8">
      {/* Emerald Button */}
      <button
        onClick={() => handleButtonClick('Student')}
        className="relative px-6 py-3 w-64 font-bold text-white bg-emerald-500 rounded-lg 
                  overflow-hidden transition-all duration-300 shadow-lg hover:shadow-emerald-300/50
                  hover:translate-y-1 active:translate-y-2 before:absolute before:inset-0
                  before:bg-white before:opacity-0 before:transition-opacity hover:before:opacity-20"
      >
        <span className="relative z-10 flex items-center justify-center">
          Student
        </span>
      </button>

      {/* Purple Button */}
      <button
        onClick={() => handleButtonClick('Teacher')}
        className="relative px-6 py-3 w-64 font-bold text-white bg-purple-500 rounded-lg 
                  overflow-hidden transition-all duration-300 shadow-lg hover:shadow-purple-300/50
                  hover:translate-y-1 active:translate-y-2 before:absolute before:inset-0
                  before:bg-white before:opacity-0 before:transition-opacity hover:before:opacity-20"
      >
        <span className="relative z-10 flex items-center justify-center">
          Teacher
        </span>
      </button>

      {/* Amber Button */}
      <button
        onClick={() => handleButtonClick('Advisor')}
        className="relative px-6 py-3 w-64 font-bold text-white bg-amber-500 rounded-lg 
                  overflow-hidden transition-all duration-300 shadow-lg hover:shadow-amber-300/50
                  hover:translate-y-1 active:translate-y-2 before:absolute before:inset-0
                  before:bg-white before:opacity-0 before:transition-opacity hover:before:opacity-20"
      >
        <span className="relative z-10 flex items-center justify-center">
        Advisor
        </span>
      </button>
    </div>
  );
};

// Main component that sets up routing
const StyledButtons = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ButtonsWithNavigation />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar" element={<Calendar />} />
        
        {/* Student Routes */}
        <Route path="/class" element={<Class />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/books" element={<Books />} />
        
        {/* Teacher/Advisor Routes */}
        <Route path="/classes" element={<Classes />} />
        <Route path="/students" element={<Students />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/reports" element={<Reports />} />
    {/*    <Route path="/teachers" element={<Teachers />} />*/}
        </Routes>
    </Router>
  );
};

export default StyledButtons;