# 🚀 AeroLeave HRMS
**Next-Generation Human Resource Management System**

![AeroLeave Dashboard](https://github.com/user-attachments/assets/placeholder) *(Note: Add a screenshot of your dashboard here!)*

AeroLeave is a comprehensive, sleek, and highly responsive HR Management System designed to streamline employee tracking, time-off requests, attendance, and payroll. Built with a modern tech stack and a stunning glassmorphism UI, AeroLeave is optimized for both employee self-service and administrative oversight.

---

## ✨ Key Features

### 👥 For Employees
- **Personalized Dashboard & Profile:** View your ID, timezone, contact info, and manage your "Resume", "Private Info", and "Salary Info" in a unified portal.
- **Attendance Tracking:** Simple Check-In / Check-Out system with daily and weekly logs, calculating exact work hours and overtime.
- **Leave Management:** Request Time-Off (Paid, Unpaid, Sick) with an intuitive form. Track your available balances and past requests.
- **Payslips:** View and download monthly payslips, factoring in attendance, unpaid leaves, and standard deductions (PF, Professional Tax).
- **Colleague Directory:** Read-only access to view team members and their contact information.

### 🛡️ For Administrators
- **Global Employee Directory:** Overview of all employees with quick stats (Total, Present, On Leave). Includes real-time search functionality.
- **Leave Approvals:** Approve or reject leave requests with a single click and optional comments.
- **Attendance Monitoring:** View global attendance logs across the entire organization.
- **Payroll Configuration:** Configure salary components, working days, and tax rates dynamically per employee.

### ⚡ Technical Highlights
- **Stunning UI/UX:** Built with Tailwind CSS featuring a dreamy ethereal color palette, glassmorphism components, and a fully responsive mobile-first design.
- **Robust State Management:** Context API (`AuthContext`) handles session persistence seamlessly.
- **Fault-Tolerant:** Graceful fallbacks using `localStorage` and mock data if the backend server becomes unreachable.
- **Automated Payroll Engine:** Calculates Basic, HRA, LTA, Performance Bonus, and prorated deductions automatically.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router v6, Tailwind CSS, Lucide React (Icons), React Joyride (Onboarding)
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Architecture:** RESTful API with modular MVC-style backend controllers and routes.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/s5zy77/hrms-resource.git
cd hrms-resource
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hrms
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🎭 Hackathon Demo Accounts

For quick evaluation, use the one-click demo logins on the Sign-In page:
- **Admin Demo:** Full access to approve leaves, set salaries, and view all attendance.
- **Employee Demo:** Standard view for checking in, requesting leaves, and viewing payslips.

*(Credentials are pre-filled automatically for seamless testing!)*

---

## 👨‍💻 Team
Built with ❤️ by our team during the hackathon.

- Anushka Ghosh
- Ranish D
- schach306-png
- Subhasree Majumder