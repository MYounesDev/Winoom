const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000; // Change if needed

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows parsing JSON requests

// Sample API route
app.get("/api/message", (req, res) => {
  res.json({
    message: `||| Hello from express |||`,
  });
});

app.post("/api/sendData", (req, res) => {
  const { data } = req.body; // Get data sent from the client
  console.log("Data received:", data); // For debugging

  let responseMessage = "";
  
  switch (data) {
    case "Student":
      responseMessage = "Student dashboard loaded successfully!";
      break;
    case "Teacher":
      responseMessage = "Teacher dashboard loaded successfully!";
      break;
    case "Advisor":
      responseMessage = "Advisor dashboard loaded successfully!";
      break;
    default:
      responseMessage = "Data received successfully!";
  }

  // Respond with a success message
  res.json({
    message: responseMessage,
    receivedData: data,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});