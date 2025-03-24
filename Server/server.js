require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 5000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School Management API",
      version: "1.0.0",
      description: "API documentation for School Management System",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./server.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Returns a welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/api/message", (req, res) => {
  res.json({
    message: `||| Hello from express |||`,
  });
});

/**
 * @swagger
 * /api/sendData:
 *   post:
 *     summary: Processes user role data
 *     tags: [General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: User role (Student, Teacher, Advisor)
 *     responses:
 *       200:
 *         description: Confirmation message based on user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 receivedData:
 *                   type: string
 */
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

/**
 * @swagger
 * /api/getClasses:
 *   get:
 *     summary: Returns a list of classes
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       students:
 *                         type: integer
 */
app.get("/api/getClasses", (req, res) => {
  let classes = [
    { name: "4/B", students: 30 },
    { name: "2/A", students: 25 },
    { name: "3/D", students: 28 }
  ];
  
  res.json({ classes });
});

/**
 * @swagger
 * /api/getStudentClass:
 *   get:
 *     summary: Returns the class of a student
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: Student's class information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentClass:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 */
app.get("/api/getStudentClass", (req, res) => {
  let studentClass = {
    name: "4/B" 
  };
  
  res.json({ studentClass });
});

/**
 * @swagger
 * /api/homework:
 *   get:
 *     summary: Returns pending and completed assignments
 *     tags: [Homework]
 *     responses:
 *       200:
 *         description: List of pending and completed assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pendingAssignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       dueDate:
 *                         type: string
 *                       status:
 *                         type: string
 *                 completedAssignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       status:
 *                         type: string
 */
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

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Returns list of lessons by subject
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: Lessons grouped by subject
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lessons:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 */
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

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Returns textbooks and digital resources
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Lists of textbooks and digital resources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 textbooks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                 digitalResources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       source:
 *                         type: string
 */
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

/**
 * @swagger
 * /api/calendar:
 *   get:
 *     summary: Returns calendar events
 *     tags: [Calendar]
 *     responses:
 *       200:
 *         description: List of calendar events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       date:
 *                         type: string
 *                       time:
 *                         type: string
 *                       location:
 *                         type: string
 *   post:
 *     summary: Adds a new calendar event
 *     tags: [Calendar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated list of calendar events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       date:
 *                         type: string
 *                       time:
 *                         type: string
 *                       location:
 *                         type: string
 */
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

app.post("/api/calendar", (req, res) => {
  // TO DO: when add database send the req.body to database and send the update
  events = events.concat(req.body);

  events = Array.from(
    new Set(events.map(events => JSON.stringify(events)))
  ).map(events => JSON.parse(events));

  console.log(events);  // DEBUG
  res.json({ events });
});

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Returns list of students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       class:
 *                         type: string
 *                       status:
 *                         type: string
 *   post:
 *     summary: Adds new students
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 ID:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 class:
 *                   type: string
 *                 status:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   class:
 *                     type: string
 *                   status:
 *                     type: string
 */
let students;
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

app.post("/api/students", (req, res) => {
  // TO DO: when add database send the req.body to database and send the update
  students = students.concat(req.body);

  students = Array.from(
    new Set(students.map(student => JSON.stringify(student)))
  ).map(student => JSON.parse(student));

  // console.log(students);  // DEBUG
  res.json(students);
});

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Returns list of teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teachers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       classes:
 *                         type: array
 *                         items:
 *                           type: string
 *                       lessons:
 *                         type: object
 *                         additionalProperties:
 *                           type: array
 *                           items:
 *                             type: string
 *                       status:
 *                         type: string
 *   post:
 *     summary: Adds new teachers
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 ID:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 classes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 lessons:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                 status:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated list of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   classes:
 *                     type: array
 *                     items:
 *                       type: string
 *                   lessons:
 *                     type: object
 *                     additionalProperties:
 *                       type: array
 *                       items:
 *                         type: string
 *                   status:
 *                     type: string
 */
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

app.post("/api/teachers", (req, res) => {
  // TO DO: when add database send the req.body to database and send the update
  teachers = teachers.concat(req.body);

  teachers = Array.from(
    new Set(teachers.map(student => JSON.stringify(student)))
  ).map(student => JSON.parse(student));

  console.log(teachers);  // DEBUG
  res.json(teachers);
});

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Returns list of notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       lastUpdated:
 *                         type: string
 */
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

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Returns available and recent reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Lists of available and recent reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableReports:
 *                   type: array
 *                   items:
 *                     type: string
 *                 recentReports:
 *                   type: array
 *                   items:
 *                     type: string
 */
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
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});