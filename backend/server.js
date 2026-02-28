const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory database
let students = [];

// Dashboard summary
app.get('/api/dashboard/summary', (req, res) => {
  const class_size = students.length;
  const class_average = students.length ? (students.reduce((sum, s) => {
    const latestBio = Math.max(...Object.values(s.scores.bio || { 0: 0 }));
    const latestChem = Math.max(...Object.values(s.scores.chem || { 0: 0 }));
    const latestMath = Math.max(...Object.values(s.scores.math || { 0: 0 }));
    return sum + latestBio + latestChem + latestMath;
  }, 0) / (students.length * 3)).toFixed(2) : 0;

  const best_performer = students.length ? students.reduce((a, b) => {
    return a.total >= b.total ? a : b;
  }).name : '-';

  res.json({ class_size, class_average, best_performer, most_improved: '-' });
});

// Class ranking
app.get('/api/class-ranking', (req, res) => {
  // calculate latest total per student
  students.forEach(s => {
    const latestBio = Math.max(...Object.values(s.scores.bio || { 0: 0 }));
    const latestChem = Math.max(...Object.values(s.scores.chem || { 0: 0 }));
    const latestMath = Math.max(...Object.values(s.scores.math || { 0: 0 }));
    s.total = latestBio + latestChem + latestMath;
  });
  // sort descending
  const ranking = students.sort((a, b) => b.total - a.total).map((s, i) => ({ rank: i + 1, ...s }));
  res.json(ranking);
});

// Add score
app.post('/api/add-score', (req, res) => {
  const { student_name, subject_id, assessment_id, score, password } = req.body;
  if (password !== "7optimus10") return res.json({ status: "error", message: "Unauthorized" });

  let student = students.find(s => s.name === student_name);
  if (!student) {
    student = { name: student_name, scores: { bio: {}, chem: {}, math: {} }, total: 0 };
    students.push(student);
  }

  let subject = subject_id === 1 ? 'bio' : subject_id === 2 ? 'chem' : 'math';
  student.scores[subject][assessment_id] = score;

  const latestBio = Math.max(...Object.values(student.scores.bio || { 0: 0 }));
  const latestChem = Math.max(...Object.values(student.scores.chem || { 0: 0 }));
  const latestMath = Math.max(...Object.values(student.scores.math || { 0: 0 }));
  student.total = latestBio + latestChem + latestMath;

  res.json({ status: "success" });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));