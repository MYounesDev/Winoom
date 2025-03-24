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
app.get("/api/getClasses", (req, res) => {

  let classes = [];
  

    // For Teacher and Advisor
    classes = [
      { name: "4/B" , students: 30 },
      { name: "2/A" , students: 25 },
      { name: "3/D" , students: 28 }
    ];
  
  
  res.json({ classes });
});


app.get("/api/getStudentClass", (req, res) => {

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
let events;
app.get("/api/calendar", (req, res) => {
  events = [
    {
      title:"23 Nisan Etkinlik",
      date:"2025-04-23",
      time:"9:00 AM",
      location:"School Yard"
    },
    {
      title:"18 mart tiyatro",
      date:"2025-03-18",
      time:"2:00 PM",
      location:"School Conference"
    },
    {
      title:"Math Test 3/A",
      date:"2025-03-28",
      time:"11:00 AM",
      location:"3/A"
    }
  ];

  console.log(events);  // DEBUG
  res.json({ events });
});


// post and update the new calender event
app.post("/api/calendar", (req, res) => {

  // TO DO: when add database send the req.body to database and send the update

  events = events. concat(req.body);

  events = Array.from(
    new Set(events.map(events => JSON.stringify(events)))
).map(events => JSON.parse(events));


  console.log(events);  // DEBUG
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


 // console.log(students);  // DEBUG
  res.json( students );
});




//teachers endpoint
let teachers;
app.get("/api/teachers", (req, res) => {

  // req =>> database
  teachers = [
    
      {
        "ID": 1000,
        "name": "Beyza Adanır",
        "classes": ["3/A"],
        "lessons": {
          "3/A": ["Math", "Turkish","science"]
        },
        "status": "Active"
      },
      {
        "ID": 1005,
        "name": "Mehmet CANDAN",
        "classes": ["2/B"],
        "lessons": {
          "2/B": ["Math", "Turkish","science"]
        },
        "status": "Active"
      },
      {
        "ID": 1009,
        "name": "Tansu AKBULUT",
        "classes": ["2/A","2/B","3/A","3/B"],
        "lessons": {
          "2/A":["English"],
          "2/B":["English"],
          "3/A":["English"],
          "3/B":["English"],
        },
        "status": "Active"
      },
      {
        "ID": 1002,
        "name": "Orhan DAL",
        "classes": ["3/C", "4/A","4/B","4/C"],
        "lessons": {
          "3/C":["English"],
          "4/A":["English"],
          "4/B":["English"],
          "4/C":["English"],
          
        },
        "status": "On Leave"
      },
      {
        "ID": 1008,
        "name": "Ömer AK",
        "classes": ["1/A","1/B","2/A","2/B","3/A","3/B","3/C","4/A","4/B","4/C",],
        "lessons": {
          "1/A":["P.E."],
          "1/B":["P.E."],
          "2/A":["P.E."],
          "2/B":["P.E."],
          "3/A":["P.E."],
          "3/B":["P.E."],
          "3/C":["P.E."],
          "4/A":["P.E."],
          "4/B":["P.E."],
          "4/C":["P.E."],
          
        },
        "status": "On Leave"
      },
    ];

  res.json({ teachers });
});

// upload students table
app.post("/api/teachers", (req, res) => {

  // TO DO: when add database send the req.body to database and send the update

  teachers = teachers. concat(req.body);

  teachers = Array.from(
    new Set(teachers.map(student => JSON.stringify(student)))
).map(student => JSON.parse(student));


  console.log(teachers);  // DEBUG
  res.json( teachers );
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