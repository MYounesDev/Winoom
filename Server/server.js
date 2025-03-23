const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample API route
app.get("/api/message", (req, res) => {
  res.json({
    message: `||| Hello from express |||`,
  });
});

app.post("/api/sendData", (req, res) => {
  const { data } = req.body;
  console.log("Data received:", data);

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

  res.json({
    message: responseMessage,
    receivedData: data,
  });
});

// New endpoints for sidebar items

// Classes endpoint
app.post("/api/getClasses", (req, res) => {

  let classes = [];
  

    // For Teacher and Advisor
    classes = [
      { name: "4/B" , students: 30 },
      { name: "2/A" , students: 25 },
      { name: "3/D" , students: 28 }
    ];
  
  
  res.json({ classes });
});


app.post("/api/getStudentClass", (req, res) => {

  let studentClass =  {
     name: "4/B" 
    }
  
  res.json({ studentClass });
});


// Homework endpoint
app.get("/api/homework", (req, res) => {
  const pendingAssignments = [
    { 
      name: "Mathematics Assignment #3", 
      dueDate: "March 20, 2025", 
      status: "pending" 
    },
    { 
      name: "Science Lab Report", 
      dueDate: "March 22, 2025", 
      status: "pending" 
    }
  ];
  
  const completedAssignments = [
    { 
      name: "Mathematics Assignment #2", 
      status: "submitted" 
    }
  ];
  
  res.json({ pendingAssignments, completedAssignments });
});

// Lessons endpoint
app.get("/api/lessons", (req, res) => {
  const lessons = {
    Mathematics: [
      "Introduction to divide",
      "Addition and Subtraction"
    ],
    Science: [
      "Newton's Laws of Motion",
      "Conservation of Energy"
    ]
  };
  
  res.json({ lessons });
});

// Books endpoint
app.get("/api/books", (req, res) => {
  const textbooks = [
    { 
      title: "Math: Early Transcendentals", 
      author: "James Stewart" 
    },
    { 
      title: "Science", 
      author: "Young & Freedman" 
    }
  ];
  
  const digitalResources = [
    { 
      title: "Mathematics Video Tutorials", 
      source: "Online Learning Platform" 
    }
  ];
  
  res.json({ textbooks, digitalResources });
});

// Calendar endpoint
app.get("/api/calendar", (req, res) => {
  const events = [];
  
  res.json({ events });
});

let students;
// Students endpoint
app.get("/api/students", (req, res) => {

  // req =>> database
  students = [
    { 
      ID: 979, 
      name: "John Doe", 
      class: "4/B", 
      status: "Active" 
    },
    { 
      ID: 486, 
      name: "Jane Smith", 
      class: "2/A", 
      status: "Active" 
    }
  ];
  
  res.json({ students });
});

// upload students table
app.post("/api/students", (req, res) => {

  // TO DO: when add database send the req.body to database and send the update

  students = students. concat(req.body);

  students = Array.from(
    new Set(students.map(student => JSON.stringify(student)))
).map(student => JSON.parse(student));


  console.log(students);
  res.json( students );
});


// Notes endpoint
app.get("/api/notes", (req, res) => {
  const notes = [
    { 
      title: "Lecture Notes: divide Week 3", 
      lastUpdated: "March 15, 2025" 
    },
    { 
      title: "Student Progress Notes", 
      lastUpdated: "March 10, 2025" 
    }
  ];
  
  res.json({ notes });
});

// Reports endpoint
app.get("/api/reports", (req, res) => {
  const availableReports = [
    "Class Performance Report",
    "Student Progress Report",
    "Attendance Report"
  ];
  
  const recentReports = [
    "March Monthly Report"
  ];
  
  res.json({ availableReports, recentReports });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});