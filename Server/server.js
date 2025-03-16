
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

  switch (data) {
    case "Student":
      navItems = (
        <>
          <li className="nav-item">
            <Presentation size={20} />
            <span>Class</span>
            <div className="glow-effect"></div>
          </li>

          <li className="nav-item">
            <SquareCheckBig size={20} />
            <span>Homework</span>
            <div className="glow-effect"></div>
          </li>

          <li className="nav-item">
            <University size={20} />
            <span>Lessons</span>
            <div className="glow-effect"></div>
          </li>

          <li className="nav-item">
            <BookCopy size={20} />
            <span>Books</span>
            <div className="glow-effect"></div>
          </li>
        </>
      );
    case "Teacer":
      navItems = (
        <>
          <li className="nav-item">
            <Presentation size={20} />
            <span>Classes</span>
            <div className="glow-effect"></div>
          </li>
          <li className="nav-item">
            <Baby size={20} />
            <span>Students</span>
            <div className="glow-effect"></div>
          </li>
          <li className="nav-item">
            <NotebookPen size={20} />
            <span>Nots</span>
            <div className="glow-effect"></div>
          </li>
          <li className="nav-item">
            <ChartColumnDecreasing size={20} />
            <span>Reports</span>
            <div className="glow-effect"></div>
          </li>
        </>
      );
    default:
      navItems = (<>
        <li className="nav-item">
          <Presentation size={20} />
          <span>Classes</span>
          <div className="glow-effect"></div>
        </li>
        <li className="nav-item">
          <Users size={20} />
          <span>Teachers</span>
          <div className="glow-effect"></div>
        </li>
        <li className="nav-item">
          <Baby size={20} />
          <span>Students</span>
          <div className="glow-effect"></div>
        </li>
        <li className="nav-item">
          <NotebookPen size={20} />
          <span>Nots</span>
          <div className="glow-effect"></div>
        </li>
        <li className="nav-item">
          <ChartColumnDecreasing size={20} />
          <span>Reports</span>
          <div className="glow-effect"></div>
        </li>
      </>);
  }
  // Respond with a success message
  res.json({
    message: "Data received successfully!" + data + data,
    receivedData: data,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*< /> */
