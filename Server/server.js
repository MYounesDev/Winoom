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


app.get("/api/studentDashboardData",(req,res) =>{
  return res.json({
    totalLessons: 6,
    assignments: 3,
    upcomingEvents: 5,
    attendanceData: [
      { name: 'Present', value: 85 },
      { name: 'Absent', value: 15 }
    ],
    gradesData: [
      { name: 'A', value: 35 },
      { name: 'B', value: 40 },
      { name: 'C', value: 20 },
      { name: 'D', value: 5 }
    ]
  })
});

app.get("/api/teacherDashboardData",(req,res) =>{
  return res.json({
    totalStudents: 290,
    performancePercentage: "85%",
    completedLessons: 42,
    classesData: [
      { name: 'Math', value: 4 },
      { name: 'Science', value: 3 },
      { name: 'English', value: 2 },
      { name: 'Other', value: 1 }
    ],
    studentsByYearData: [
      { name: '1st Year', value: 120 },
      { name: '2nd Year', value: 95 },
      { name: '3rd Year', value: 75 }
    ]
  })
});

app.get("/api/advisorDashboardData",(req,res) =>{
  return res.json({
    totalStudents: 350,
    totalClasses: 25,
    totalPrograms: 8,
    enrollmentData: [
      { name: 'New Students', value: 75 },
      { name: 'Returning', value: 225 },
      { name: 'Potential Dropout', value: 50 }
    ],
    performanceData: [
      { name: 'Excellent', value: 60 },
      { name: 'Good', value: 120 },
      { name: 'Average', value: 100 },
      { name: 'Need Support', value: 20 }
    ]
  })
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


let homeworkItems = [
  {
    id: "hw1",
    title: "Sum of numbers from 1 to 100",
    subject: "Math",
    teacher: "Ms. Beyza Adanır",
    dueDate: "2025-04-05",
    description: "Complete problems 1-2 on page 45 of the textbook.",
    status: "pending",
    submittedCount: 15,
    attachment: null,
    submittedContent: null
  },
  {
    id: "hw2",
    title: "Lab Report: Sicence",
    subject: "Science",
    teacher: "Ms. Garcia",
    dueDate: "2025-04-02",
    description: "Mixing salt with lemon and take notes on the reactions observed",
    status: "submitted",
    submittedCount: 18,
    attachment: "https://example.com/files/labattachment.pdf",
    submittedContent: "When salt was added to the lemon, it caused fizzing and a noticeable change in the lemon's texture and flavor."
  },
  {
    id: "hw3",
    title: "Essay: The Industrial Revolution",
    subject: "History",
    teacher: "Mr. Thompson",
    dueDate: "2025-04-10",
    description: "Write a 1000-word essay on the causes and effects of the Industrial Revolution.",
    status: "pending",
    submittedCount: 10,
    attachment: null,
    submittedContent: null
  }
];

// Endpoint to get homework assignments
app.get("/api/homework", (req, res) => {
  res.json({ homeworkItems });
});

// Endpoint to submit homework
app.post("/api/submitHomework", (req, res) => {
  const { homeworkId, content } = req.body;
  
  // Find the homework item and update it
  const homeworkIndex = homeworkItems.findIndex(item => item.id === homeworkId);
  
  if (homeworkIndex !== -1) {
    homeworkItems[homeworkIndex].status = "submitted";
    homeworkItems[homeworkIndex].submittedContent = content;
    homeworkItems[homeworkIndex].submittedCount += 1;
    
    // If there's an attachment, simulate storing it
    if (req.body.attachment) {
      homeworkItems[homeworkIndex].attachment = "https://example.com/files/newattachment.pdf";
    }
  }
  
  // Return updated homework list
  res.json({ homeworkItems });
});

// Endpoint to edit submitted homework
app.post("/api/editHomework", (req, res) => {
  const { homeworkId, content } = req.body;
  
  // Find the homework item and update it
  const homeworkIndex = homeworkItems.findIndex(item => item.id === homeworkId);
  
  if (homeworkIndex !== -1 && homeworkItems[homeworkIndex].status === "submitted") {
    homeworkItems[homeworkIndex].submittedContent = content;
    
    // If there's a new attachment, simulate updating it
    if (req.body.attachment) {
      homeworkItems[homeworkIndex].attachment = "https://example.com/files/updatedattachment.pdf";
    }
  }
  
  // Return updated homework list
  res.json({ homeworkItems });
});

// Endpoint to ask a question about homework
app.post("/api/askQuestionAboutHomework", (req, res) => {
  const { homeworkId, question } = req.body;
  
  // In a real application, this would store the question and notify the teacher
  // For this mock API, we'll just acknowledge receipt
  
  console.log(`Question received for homework ${homeworkId}: ${question}`);
  
  // Return success response
  res.json({ 
    success: true, 
    message: "Your question has been sent to the teacher."
  });
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
      title: "23 April (Kid Day) Event",
      date: "2025-04-23",
      time: "9:00 AM",
      location: "School Yard"
    },
    {
      title: "18 March Theater",
      date: "2025-03-18",
      time: "2:00 PM",
      location: "School Conference"
    },
    {
      title: "Math Test 3/A",
      date: "2025-03-28",
      time: "10:00 AM",
      location: "3/A"
    },
    {
      title: "Graduation Ceremony",
      date: "2025-06-16",
      time: "11:00 AM",
      location: "School"
    },
    {
      title: "Science Fair",
      date: "2025-05-15",
      time: "10:00 AM",
      location: "Laboratory"
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
      ID: 988, 
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
  if (req.body[0].ID === undefined || req.body[0].name === undefined || req.body[0].class === undefined || req.body[0].status === undefined){
    console.log('Invalid request body');  // DEBUG
    return res.status(400).json({ message: "Invalid request body" });
  } 


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
  if (req.body[0].ID === undefined || req.body[0].name === undefined || req.body[0].classes === undefined || req.body[0].lessons === undefined || req.body[0].status === undefined){
    console.log('Invalid request body');  // DEBUG
    return res.status(400).json({ message: "Invalid request body" });
  }
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