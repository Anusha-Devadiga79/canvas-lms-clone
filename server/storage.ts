import { type User, type InsertUser, type Course, type Task, type Assignment, type InsertCourse, type InsertTask, type InsertAssignment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  
  getAssignments(courseId: string): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private courses: Map<string, Course>;
  private tasks: Map<string, Task>;
  private assignments: Map<string, Assignment>;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.tasks = new Map();
    this.assignments = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Create sample user
    const user: User = {
      id: "user1",
      username: "john.student",
      password: "password",
      displayName: "John Student",
      role: "student"
    };
    this.users.set(user.id, user);

    // Create sample courses
    const sampleCourses: Course[] = [
      {
        id: "course1",
        title: "Introduction to Data Science",
        instructor: "Dr. Sarah Johnson",
        description: "This course provides a comprehensive introduction to data science, covering fundamental concepts, tools, and techniques used in data analysis.",
        term: "Spring 2024",
        credits: 3,
        meetingTimes: "MWF 10:00-11:30 AM",
        location: "Science Building Room 204",
        progress: 75
      },
      {
        id: "course2",
        title: "Advanced Mathematics",
        instructor: "Prof. Michael Chen",
        description: "Advanced mathematical concepts and applications.",
        term: "Spring 2024",
        credits: 4,
        meetingTimes: "TTh 2:00-3:30 PM",
        location: "Math Building Room 101",
        progress: 60
      },
      {
        id: "course3",
        title: "Web Development Fundamentals",
        instructor: "Ms. Emily Rodriguez",
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
        term: "Spring 2024",
        credits: 3,
        meetingTimes: "MWF 1:00-2:30 PM",
        location: "Computer Lab A",
        progress: 90
      },
      {
        id: "course4",
        title: "Digital Marketing Strategy",
        instructor: "Dr. James Wilson",
        description: "Comprehensive course on digital marketing strategies and techniques.",
        term: "Spring 2024",
        credits: 3,
        meetingTimes: "TTh 10:00-11:30 AM",
        location: "Business Building Room 205",
        progress: 45
      },
      {
        id: "course5",
        title: "Psychology 101",
        instructor: "Dr. Lisa Thompson",
        description: "Introduction to psychological principles and theories.",
        term: "Spring 2024",
        credits: 3,
        meetingTimes: "MWF 9:00-10:30 AM",
        location: "Psychology Building Room 301",
        progress: 30
      },
      {
        id: "course6",
        title: "Business Analytics",
        instructor: "Prof. Robert Davis",
        description: "Learn business analytics techniques and data-driven decision making.",
        term: "Spring 2024",
        credits: 3,
        meetingTimes: "TTh 3:00-4:30 PM",
        location: "Business Building Room 310",
        progress: 80
      }
    ];

    sampleCourses.forEach(course => this.courses.set(course.id, course));

    // Create sample tasks
    const sampleTasks: Task[] = [
      {
        id: "task1",
        userId: "user1",
        title: "Complete Data Science Assignment 3",
        description: "Create interactive charts using Python",
        dueDate: new Date("2024-03-18"),
        priority: "high",
        completed: false,
        courseId: "course1"
      },
      {
        id: "task2",
        userId: "user1",
        title: "Submit Web Development Project",
        description: "Final project submission",
        dueDate: new Date("2024-03-15"),
        priority: "high",
        completed: true,
        courseId: "course3"
      },
      {
        id: "task3",
        userId: "user1",
        title: "Read Chapter 5: Advanced Mathematics",
        description: "Study chapter 5 materials",
        dueDate: new Date("2024-03-20"),
        priority: "medium",
        completed: false,
        courseId: "course2"
      },
      {
        id: "task4",
        userId: "user1",
        title: "Attend Marketing Strategy Discussion",
        description: "Class discussion on marketing strategies",
        dueDate: new Date("2024-03-22"),
        priority: "medium",
        completed: false,
        courseId: "course4"
      },
      {
        id: "task5",
        userId: "user1",
        title: "Psychology Essay Draft",
        description: "First draft of psychology essay",
        dueDate: new Date("2024-03-25"),
        priority: "low",
        completed: false,
        courseId: "course5"
      }
    ];

    sampleTasks.forEach(task => this.tasks.set(task.id, task));

    // Create sample assignments
    const sampleAssignments: Assignment[] = [
      {
        id: "assign1",
        courseId: "course1",
        title: "Assignment 3: Data Visualization",
        description: "Create interactive charts using Python",
        dueDate: new Date("2024-03-18"),
        status: "pending",
        grade: null,
        maxGrade: 100
      },
      {
        id: "assign2",
        courseId: "course1",
        title: "Assignment 2: Statistical Analysis",
        description: "Analyze dataset using statistical methods",
        dueDate: new Date("2024-03-04"),
        status: "graded",
        grade: 95,
        maxGrade: 100
      },
      {
        id: "assign3",
        courseId: "course1",
        title: "Quiz 2",
        description: "Statistical concepts quiz",
        dueDate: new Date("2024-02-28"),
        status: "graded",
        grade: 92,
        maxGrade: 100
      },
      {
        id: "assign4",
        courseId: "course1",
        title: "Assignment 1",
        description: "Introduction to data science concepts",
        dueDate: new Date("2024-02-20"),
        status: "graded",
        grade: 88,
        maxGrade: 100
      }
    ];

    sampleAssignments.forEach(assignment => this.assignments.set(assignment.id, assignment));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async getAssignments(courseId: string): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(assignment => assignment.courseId === courseId);
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = randomUUID();
    const assignment: Assignment = { ...insertAssignment, id };
    this.assignments.set(id, assignment);
    return assignment;
  }
}

export const storage = new MemStorage();
