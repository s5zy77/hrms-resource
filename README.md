<div align="center">
  <img src="https://img.shields.io/badge/Nexus-HR%20Management-714B67?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcng9IjIwIiBmaWxsPSIjNzE0QjY3Ii8+PHRleHQgeD0iNTAiIHk9IjY1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0NCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OWDwvdGV4dD48L3N2Zz4=" />

  <h1>Nexus — Smart HR Management</h1>
  <p><strong>A full-stack Human Resource Management System built for modern teams.</strong></p>

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
</div>

---

## Overview

**Nexus** is a modern, production-ready Human Resource Management System (HRMS) designed for small to mid-sized organizations. It provides a unified platform for managing employees, attendance logs, leave requests, payroll configurations, and team communication — all with a beautiful, responsive UI.

Built as a hackathon project by a team of 4 developers.

---

## Features

### Employee Directory
- 🗂 Browse all employees with live local time clocks per timezone
- 🔍 Search by name or department (Ctrl+K shortcut)
- 📋 Click-to-copy Employee ID and Email
- 👤 Admin can view detailed employee profiles with salary, resume, and private info tabs

### Attendance Management
- 📅 Daily attendance monitor with check-in/check-out times
- ⏱ Work hours and overtime auto-calculated
- 🗓 Navigate across dates with a date picker

### Time-Off & Leave Management
- 📝 Employees can submit leave requests with attachment support
- ✅ Admins can Approve or Reject requests with comments
- 📊 Leave balance allocations per employee

### Payroll & Salary
- 💰 Real-time salary breakdown: Basic, HRA, PF, Standard Allowance, LTA
- 🧮 Live recalculation when admin changes base wage, PF rate, or professional tax
- 📄 Payslip generation per employee

### Profile Management
- ✏️ Employees can edit their own name, job title, phone and location
- 📄 Resume tab with skills and education
- 🔒 Private info tab with emergency contacts
- 🕒 Live timezone clock on every profile

### Authentication
- 🔐 Role-based access control (Admin / Employee)
- 🚀 One-click demo logins for Admin (John Doe) and Employee (Anushka Ghosh)
- 💡 Onboarding tour for first-time admin logins

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, TailwindCSS 3 |
| Routing | React Router v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Icons | Lucide React |
| Animations | CSS Keyframes, Canvas Confetti |

---

## Project Structure

```
hrms/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth context (React Context API)
│   │   ├── hooks/      # Custom hooks (usePageTitle, etc.)
│   │   └── pages/      # Route-level page components
│   └── index.html
└── backend/            # Node.js + Express API server
    ├── models/         # Mongoose data models
    ├── routes/         # API route handlers
    └── server.js       # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/s5zy77/hrms-resource.git
cd hrms-resource

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Running Locally

```bash
# Start backend (from /backend)
npm run dev   # runs on http://localhost:5000

# Start frontend (from /frontend)
npm run dev   # runs on http://localhost:5173
```

### Environment Variables

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## Team

| Name | Role |
|---|---|
| Subhasree Majumder | Frontend Developer |
| Anushka Ghosh | Frontend Developer |
| Ranish D | UI/UX Design & Frontend |
| *(4th Member)* | Backend Developer |

---

## License

This project is open source and available under the [MIT License](LICENSE).
