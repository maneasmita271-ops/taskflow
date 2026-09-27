TaskFlow — Small Business Workflow & Task Management Platform

A lightweight workflow and task management platform designed to help small businesses organize tasks, assign responsibilities, track deadlines, and monitor team workload from one simple dashboard.

Hackathon

FIT-FEST 2026 Hackathon
Flora Institute of Technology, Pune

Problem Statement

Small businesses often manage daily work through WhatsApp messages, spreadsheets, phone calls, notebooks, and verbal communication. This makes it difficult to track:

What work is pending
Who is responsible for a task
Which tasks are urgent
Which deadlines are approaching
How work is distributed among employees
Our Solution

TaskFlow brings task creation, assignment, deadlines, priorities, status tracking, team workload, and workflow insights into one simple platform.

Instead of being only a basic to-do list, TaskFlow helps a manager understand what needs attention and who is handling the work.

Key Features
1. Task Management
Create tasks
Edit tasks
Delete tasks
Search and filter tasks
Set task deadlines
Track task status
2. Task Assignment

Tasks can be assigned to specific team members so that responsibility is clearly defined.

3. Priority Management

Each task can have a priority:

Low
Medium
High
Urgent
4. Status Tracking

Tasks can move through:

To Do
In Progress
Completed
5. Dashboard

The dashboard provides a quick overview of:

Total tasks
In-progress tasks
Completed tasks
Overdue tasks
Today's tasks
6. Smart Workflow

TaskFlow includes lightweight rule-based workflow assistance.

Task Urgency

The system calculates task urgency using factors such as:

Priority
Deadline
Overdue status
Completion status
Today's Action Plan

The system creates a prioritized list of tasks that need attention based on urgency and deadlines.

Team Workload

The system shows the number of active tasks assigned to each team member, helping managers identify workload distribution.

7. Team Management

Managers can:

View team members
Add team members
Assign tasks
Monitor active workload
How TaskFlow Works
Manager
   ↓
Create Task
   ↓
Set Priority + Deadline
   ↓
Assign Team Member
   ↓
Task Status Tracking
   ↓
Workflow Analysis
   ↓
Urgency + Today's Action Plan + Workload
   ↓
Manager Takes Action
Technology Stack

Frontend

React.js
JavaScript
Vite
HTML
CSS

Backend

Vercel Serverless API

Database

MongoDB Atlas

Deployment

Vercel

Version Control

Git
GitHub
Project Structure
taskflow/
├── api/
│   ├── _lib/
│   ├── activities.js
│   ├── members/
│   ├── seed.js
│   └── tasks/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── App.css
│
├── public/
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
Live Application

TaskFlow:
https://taskflow-ten-rosy.vercel.app/

GitHub Repository

https://github.com/maneasmita271-ops/taskflow

Local Setup
1. Clone the repository
git clone https://github.com/maneasmita271-ops/taskflow.git
cd taskflow
2. Install dependencies
npm install
3. Configure environment variables

Create a .env.local file:

MONGODB_URI=your_mongodb_connection_string

Do not commit your MongoDB credentials to GitHub.

4. Start the development server
npm run dev

The application will be available through the local Vite development URL shown in the terminal.

5. Build the project
npm run build
Demo Flow

For the hackathon demonstration:

Open the Dashboard.
Show overall task statistics.
Create a new high-priority task.
Assign it to a team member.
Set today's deadline.
Show the task appearing in Today's Tasks.
Show its urgency.
Open Team and demonstrate workload.
Change the task status.
Show the updated dashboard.
Why TaskFlow?

Traditional task lists mainly answer:

"What tasks do I have?"

TaskFlow additionally helps answer:

"What needs attention first, and how is the work distributed?"

This makes the platform more useful for small-business workflow management while keeping the interface simple and easy to operate.

Future Improvements

Possible future enhancements include:

User authentication and role-based access
Email/SMS/WhatsApp notifications
Recurring tasks
Activity history and audit logs
Real-time team collaboration
Advanced productivity analytics
AI-powered natural-language task creation
Calendar integration
Team

Developer: Asmita Ramesh Mane

Hackathon: FIT-FEST 2026
Venue: Flora Institute of Technology, Pune

Acknowledgement

Built for FIT-FEST 2026 Hackathon organized at Flora Institute of Technology, Pune.
