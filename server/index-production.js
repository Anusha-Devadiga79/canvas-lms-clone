const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(`${new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })} [express] ${logLine}`);
    }
  });

  next();
});

// Mock data and API routes
const mockUser = {
  id: "user1",
  username: "john.student",
  email: "john.student@university.edu",
  firstName: "John",
  lastName: "Student",
  role: "student"
};

const mockCourses = [
  {
    id: "course1",
    title: "Introduction to Data Science",
    code: "CS 301",
    instructor: "Dr. Sarah Johnson",
    semester: "Fall 2024",
    credits: 3,
    color: "bg-blue-500",
    progress: 75,
    nextAssignment: "Data Analysis Project",
    nextDueDate: "2024-12-15",
    description: "Comprehensive introduction to data science concepts, tools, and methodologies."
  },
  {
    id: "course2",
    title: "Advanced Web Development",
    code: "CS 405",
    instructor: "Prof. Michael Chen",
    semester: "Fall 2024",
    credits: 4,
    color: "bg-green-500",
    progress: 60,
    nextAssignment: "React Portfolio",
    nextDueDate: "2024-12-10",
    description: "Advanced concepts in modern web development including React, Node.js, and databases."
  },
  {
    id: "course3",
    title: "Machine Learning Fundamentals",
    code: "CS 422",
    instructor: "Dr. Emily Rodriguez",
    semester: "Fall 2024",
    credits: 3,
    color: "bg-purple-500",
    progress: 45,
    nextAssignment: "Neural Network Implementation",
    nextDueDate: "2024-12-20",
    description: "Introduction to machine learning algorithms and their practical applications."
  },
  {
    id: "course4",
    title: "Database Systems",
    code: "CS 380",
    instructor: "Prof. David Wilson",
    semester: "Fall 2024",
    credits: 3,
    color: "bg-orange-500",
    progress: 80,
    nextAssignment: "Database Design Project",
    nextDueDate: "2024-12-08",
    description: "Comprehensive study of database design, implementation, and optimization."
  }
];

const mockTasks = [
  {
    id: "task1",
    userId: "user1",
    title: "Complete Data Analysis Project",
    description: "Finish the final data analysis project for Introduction to Data Science",
    dueDate: "2024-12-15",
    priority: "high",
    completed: false,
    courseId: "course1",
    courseName: "Introduction to Data Science"
  },
  {
    id: "task2",
    userId: "user1",
    title: "Submit React Portfolio",
    description: "Complete and submit the React portfolio for Advanced Web Development",
    dueDate: "2024-12-10",
    priority: "high",
    completed: false,
    courseId: "course2",
    courseName: "Advanced Web Development"
  },
  {
    id: "task3",
    userId: "user1",
    title: "Study for ML Midterm",
    description: "Prepare for the Machine Learning Fundamentals midterm exam",
    dueDate: "2024-12-12",
    priority: "medium",
    completed: true,
    courseId: "course3",
    courseName: "Machine Learning Fundamentals"
  }
];

// API Routes
app.get("/api/user", (req, res) => {
  res.json(mockUser);
});

app.get("/api/courses", (req, res) => {
  res.json(mockCourses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = mockCourses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json(course);
});

app.get("/api/tasks", (req, res) => {
  res.json(mockTasks);
});

app.patch("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const task = mockTasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  
  if (req.body.hasOwnProperty('completed')) {
    task.completed = req.body.completed;
  }
  
  res.json(task);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Serve static files from dist/public
const distPath = path.resolve(__dirname, "public");

if (!fs.existsSync(distPath)) {
  console.error(`Could not find the build directory: ${distPath}`);
  process.exit(1);
}

app.use(express.static(distPath));

// Catch-all handler for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`${new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })} [express] serving on port ${PORT}`);
});
