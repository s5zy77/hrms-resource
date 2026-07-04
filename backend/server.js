const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Request body parser middleware
app.use(cors());
app.use(express.json());

// Routes declarations
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const salaryRoutes = require('./routes/salary');
const employeeRoutes = require('./routes/employee');

// Routes mount
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/employees', employeeRoutes);

// Base route checker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HRMS server is running smoothly' });
});

// Database connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connection initialized successfully'))
  .catch(err => console.error('MongoDB connection establishment error:', err));

app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
