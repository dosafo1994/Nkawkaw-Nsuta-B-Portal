const students = JSON.parse(localStorage.getItem("studentDatabase")) || [];
const scores = JSON.parse(localStorage.getItem("submittedScores")) || [];

const studentSelect = document.getElementById("select-student");
const subjectBody = document.getElementById("subject-scores");
const reportArea = document.getElementById("report-area");

function populateDropdown() {
  students.forEach((s) => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = `${s.name} (${s.class})`;
    studentSelect.appendChild(option);
  });
}

function getClassSize(studentClass) {
  return students.filter((s) => s.class === studentClass).length;
}

function getSubjectPosition(className, subject, targetScore) {
  const allInClass = scores.filter(s => s.class === className && s.subject === subject);
  const ranked = allInClass
    .map(s => s.finalScore)
    .sort((a, b) => b - a);
  return ranked.indexOf(targetScore) + 1;
}

function getClassPosition(studentId, className) {
  const byStudent = {};

  scores.forEach(s => {
    if (s.class === className) {
      byStudent[s.studentId] = (byStudent[s.studentId] || 0) + s.finalScore;
    }
  });

  const ranking = Object.entries(byStudent)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return ranking.indexOf(studentId) + 1;
}

function loadReport() {
  const studentId = studentSelect.value;
  if (!studentId) return alert("Please select a student");

  const student = students.find(s => s.id === studentId);
  const studentScores = scores.filter(s => s.studentId === studentId);

  if (!studentScores.length) {
    return alert("No scores available for this student yet.");
  }

  // Fill basic info
  document.getElementById("r-name").textContent = student.name;
  document.getElementById("r-id").textContent = student.id;
  document.getElementById("r-class").textContent = student.class;
  document.getElementById("r-roll").textContent = getClassSize(student.class);
  document.getElementById("r-position").textContent = getClassPosition(student.id, student.class);

  subjectBody.innerHTML = "";

  let total = 0;

  studentScores.forEach((s) => {
    const subjectTotal = s.classScore + s.examScore;
    const subjectPos = getSubjectPosition(s.class, s.subject, s.finalScore);
    total += s.finalScore;

    subjectBody.innerHTML += `
      <tr>
        <td>${s.subject}</td>
        <td>${s.classScore}</td>
        <td>${s.examScore}</td>
        <td>${subjectTotal}</td>
        <td>${subjectPos}</td>
      </tr>
    `;
  });

  const average = (total / studentScores.length).toFixed(2);
  document.getElementById("r-total").textContent = total;
  document.getElementById("r-average").textContent = average;

  reportArea.style.display = "block";
}

populateDropdown();