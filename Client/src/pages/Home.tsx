"use client";
import React, { useState, useEffect } from "react";
import PageTemplate from "@/components/PageTemplate";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    // First try to get the role from location state
    const state = location.state as LocationState;
    if (state && state.role) {
      setUserRole(state.role);
      sessionStorage.setItem('userRole', state.role);
      console.log("User role set from location state:", state.role);
    } else {
      // If not in location state, try sessionStorage
      const storedRole = sessionStorage.getItem('userRole') as UserRole;
      if (storedRole) {
        setUserRole(storedRole);
        console.log("User role set from sessionStorage:", storedRole);
      } else {
        // If no role found, redirect to role selection page
        console.log("No user role found, redirecting to role selection");
        navigate('/', { replace: true });
      }
    }
  }, [location, navigate]);

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
    <PageTemplate title="Home">
      <div className="p-8 w-full">
        <h1 className="text-2xl font-bold">React + Express</h1>
        <h2 className="text-xl mt-4">Welcome, {userRole || 'Guest'}</h2>

        <div className="mt-6">
          <input
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Enter some data"
            className="p-2 border rounded mr-2"
          />

          <button
            onClick={handleSendData}
            className="themed-button"
          >
            Send Data
          </button>

          {message && <p className="mt-4">{message}</p>}
        </div>
      </div>
      </PageTemplate>
  );
}

export default Home;
