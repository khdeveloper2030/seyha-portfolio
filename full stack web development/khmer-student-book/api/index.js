const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ភ្ជាប់ទៅកាន់ Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// API ទេសាកល្បង
app.get('/api/health', (req, res) => {
  res.json({ status: "Backend ដំណើរការធម្មតា!" });
});

// API ទាញយកទិន្នន័យសិស្ស និងពិន្ទុ ១៣ មុខវិជ្ជា
app.get('/api/student-book/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    const scores = await pool.query('SELECT * FROM scores WHERE student_id = $1', [id]);
    const signatures = await pool.query('SELECT * FROM signatures WHERE student_id = $1', [id]);

    res.json({
      student: student.rows[0],
      scores: scores.rows,
      signatures: signatures.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API សម្រាប់ចុះហត្ថលេខា
app.post('/api/sign', async (req, res) => {
  const { student_id, semester, role } = req.body; 
  const columnToUpdate = `${role}_signed`;

  try {
    await pool.query(
      `UPDATE signatures SET ${columnToUpdate} = TRUE WHERE student_id = $1 AND semester = $2`,
      [student_id, semester]
    );
    res.json({ success: true, message: `បានចុះហត្ថលេខាជោគជ័យ!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;