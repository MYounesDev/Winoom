"use client"
import React, { useState } from "react";
import axios from "axios";
import Sidebar from '../components/Sidebar';

function Home() {
  const [message, setMessage] = useState("");
  const [inputData, setInputData] = useState(""); // Track input data

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
      <Sidebar />
      <div>
        <h1>React + Express</h1>

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
