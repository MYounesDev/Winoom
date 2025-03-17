"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from '@/components/Sidebar';
import { useLocation } from 'react-router-dom';

// Define a type for the user role
type UserRole = 'Student' | 'Teacher' | 'Advisor' | null;

// Define location state type
interface LocationState {
  role: UserRole;
}

function Home() {
  const [message, setMessage] = useState("");
  const [inputData, setInputData] = useState(""); // Track input data
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Get location state from react-router
  const location = useLocation();
  
  useEffect(() => {
    // Get the role from location state if available
    const state = location.state as LocationState;
    if (state && state.role) {
      setUserRole(state.role);
      console.log("User role set to:", state.role);
    }
  }, [location]);

  const handleSendData = () => {
    // Send POST request to the server
    axios.post("http://localhost:5000/api/sendData", { data: inputData })
      .then((response) => {
        setMessage(response.data.message); // Set success message from server
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        setMessage("Error sending data.");
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar userRole={userRole} />
      <div>
        <h1>React + Express</h1>
        <h2>Welcome, {userRole || 'Guest'}</h2>

        <input 
          type="text" 
          value={inputData} 
          onChange={(e) => setInputData(e.target.value)} 
          placeholder="Enter some data" 
        />

        <button onClick={handleSendData}>Send Data</button>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default Home;