const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000; // Change if needed

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows parsing JSON requests

// Sample API route
app.get("/api/message", (req, res) => {
  res.json(

    { 
        message: "Hello from Express!" 
        
    }

);

});



app.post("/api/sendData", (req, res) => {
    const { data } = req.body; // Get data sent from the client
    console.log("Data received:", data); // For debugging
  
    // Respond with a success message
    res.json({ message: "Data received successfully!", receivedData: data });
});
  



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
