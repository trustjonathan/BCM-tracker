// ===== Sample Data =====
const students = [
  { id: 1, name: "Amina", bio: 85, chem: 78, math: 92, total: 255 },
  { id: 2, name: "Joel", bio: 75, chem: 82, math: 80, total: 237 },
  { id: 3, name: "Moses", bio: 65, chem: 70, math: 68, total: 203 }
];

// ===== Populate Ranking Table =====
const rankingBody = document.getElementById("ranking-body");

function populateRanking() {
  rankingBody.innerHTML = "";
  students.sort((a, b) => b.total - a.total); // Sort by total
  students.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="student-name" data-id="${student.id}">${student.name}</td>
            <td>${student.bio}</td>
            <td>${student.chem}</td>
            <td>${student.math}</td>
            <td>${student.total}</td>
        `;
    rankingBody.appendChild(tr);
  });
}

// ===== Student Panel =====
const studentPanel = document.getElementById("student-panel");

function openStudentPanel(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById("student-name").textContent = student.name;
  document.getElementById("bio-avg").textContent = student.bio;
  document.getElementById("chem-avg").textContent = student.chem;
  document.getElementById("math-avg").textContent = student.math;

  // TODO: Load charts with Chart.js
  studentPanel.classList.add("active");
}

function closePanel() {
  studentPanel.classList.remove("active");
}

// ===== Event Listener for table click =====
rankingBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("student-name")) {
    const id = parseInt(e.target.dataset.id);
    openStudentPanel(id);
  }
});

// ===== Score Modal =====
const scoreModal = document.getElementById("score-modal");

function openModal() {
  scoreModal.style.display = "block";
}

function closeModal() {
  scoreModal.style.display = "none";
}

// ===== Event Listener for Score Form =====
const scoreForm = document.getElementById("score-form");
scoreForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = parseInt(document.getElementById("student").value);
  const subjectId = parseInt(document.getElementById("subject").value);
  const assessmentId = parseInt(document.getElementById("assessment").value);
  const score = parseFloat(document.getElementById("score").value);

  // TODO: POST to backend API
  console.log({ studentId, subjectId, assessmentId, score });

  closeModal();
});

// ===== Populate Student Select Dropdown =====
const studentSelect = document.getElementById("student");
students.forEach(student => {
  const option = document.createElement("option");
  option.value = student.id;
  option.textContent = student.name;
  studentSelect.appendChild(option);
});

// ===== Initialize =====
populateRanking();

// ===== Charts =====

// Function to create a line chart
function createLineChart(ctx, labels, data, label, color) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: color + '33', // light transparent fill
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, max: 100 },
      }
    }
  });
}

// ===== Student Charts =====
let bioChart, chemChart, mathChart;

function loadStudentCharts(student) {
  const labels = ["Test 1", "Test 2", "Midterm", "Final"]; // sample assessments
  const bioData = [student.bio - 5, student.bio - 2, student.bio, student.bio]; // sample
  const chemData = [student.chem - 4, student.chem - 1, student.chem, student.chem];
  const mathData = [student.math - 6, student.math - 3, student.math, student.math];

  const bioCtx = document.getElementById('bio-chart').getContext('2d');
  const chemCtx = document.getElementById('chem-chart').getContext('2d');
  const mathCtx = document.getElementById('math-chart').getContext('2d');

  if (bioChart) bioChart.destroy();
  if (chemChart) chemChart.destroy();
  if (mathChart) mathChart.destroy();

  bioChart = createLineChart(bioCtx, labels, bioData, "Biology", "#1e3a8a");
  chemChart = createLineChart(chemCtx, labels, chemData, "Chemistry", "#16a34a");
  mathChart = createLineChart(mathCtx, labels, mathData, "Math", "#d97706");
}

// Modify openStudentPanel to include charts
function openStudentPanel(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  document.getElementById("student-name").textContent = student.name;
  document.getElementById("bio-avg").textContent = student.bio;
  document.getElementById("chem-avg").textContent = student.chem;
  document.getElementById("math-avg").textContent = student.math;

  loadStudentCharts(student);
  studentPanel.classList.add("active");
}

// ===== Class Analytics Charts =====
const classBioCtx = document.getElementById('class-bio-chart').getContext('2d');
const classChemCtx = document.getElementById('class-chem-chart').getContext('2d');
const classMathCtx = document.getElementById('class-math-chart').getContext('2d');

function loadClassAnalytics() {
  const labels = ["Test 1", "Test 2", "Midterm", "Final"];

  // Calculate class averages
  const bioData = labels.map(() => {
    return Math.round(students.reduce((sum, s) => sum + s.bio, 0) / students.length);
  });
  const chemData = labels.map(() => {
    return Math.round(students.reduce((sum, s) => sum + s.chem, 0) / students.length);
  });
  const mathData = labels.map(() => {
    return Math.round(students.reduce((sum, s) => sum + s.math, 0) / students.length);
  });

  createLineChart(classBioCtx, labels, bioData, "Biology Avg", "#1e3a8a");
  createLineChart(classChemCtx, labels, chemData, "Chemistry Avg", "#16a34a");
  createLineChart(classMathCtx, labels, mathData, "Math Avg", "#d97706");
}

// Call on load
loadClassAnalytics();