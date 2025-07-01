const studentSelect = document.getElementById("student-select");
const container = document.getElementById("report-container");

const students = JSON.parse(localStorage.getItem("studentDatabase")) || [];
const scores = JSON.parse(localStorage.getItem("submittedScores")) || [];
const remarks = JSON.parse(localStorage.getItem("studentRemarks")) || [];
const termData = JSON.parse(localStorage.getItem("schoolTerm")) || {};
const term = termData.term || "Term 2";
const year = termData.year || "2025";

// Populate dropdown
studentSelect.innerHTML = '<option value="">-- All Students --</option>';
students.forEach(s => {
  const option = document.createElement("option");
  option.value = s.studentId || s.id;
  option.textContent = `${s.name} (${s.studentId || s.id})`;
  studentSelect.appendChild(option);
});

function getGrade(score) {
  if (score >= 90) return "1";
  if (score >= 80) return "2";
  if (score >= 70) return "3";
  if (score >= 60) return "4";
  if (score >= 55) return "5";
  if (score >= 50) return "6";
  if (score >= 40) return "7";
  if (score >= 35) return "8";
  return "9";
}

function getRemark(score) {
  if (score >= 90) return "Exceptional";
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 55) return "Fairly Good";
  if (score >= 50) return "Satisfactory";
  if (score >= 40) return "Needs Improvement";
  if (score >= 35) return "Below Average";
  return "Poor";
}

function getTeacherRemark(total, count) {
  const percent = (total / (count * 100)) * 100;
  if (percent >= 90) return "Outstanding performance. Keep it up!";
  if (percent >= 80) return "Excellent effort. Maintain this standard.";
  if (percent >= 70) return "Very good work. Aim even higher.";
  if (percent >= 60) return "Good. Can improve with consistent effort.";
  if (percent >= 50) return "Satisfactory. Show more commitment.";
  if (percent >= 40) return "Below average. Must work harder.";
  return "Poor. Seek support and focus on basics.";
}

function renderReports() {
  const filterId = studentSelect.value;
  container.innerHTML = "";

  const map = {};
  scores.forEach(entry => {
    if (!map[entry.studentId]) {
      map[entry.studentId] = {
        name: entry.studentName,
        id: entry.studentId,
        class: entry.class,
        entries: [],
        total: 0
      };
    }
    const final = parseFloat(entry.finalScore);
    map[entry.studentId].entries.push({
      subject: entry.subject,
      classScore: entry.classScore,
      examScore: entry.examScore,
      finalScore: final,
      grade: getGrade(final),
      remark: getRemark(final)
    });
    map[entry.studentId].total += final;
  });

  const ranked = Object.values(map)
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, position: i + 1 }));

  const filtered = filterId
    ? ranked.filter(s => s.id === filterId)
    : ranked;

  filtered.forEach(s => {
    const existing = remarks.find(r => r.id === s.id && r.class === s.class) || {};
    const percent = (s.total / (s.entries.length * 100)) * 100;

    const box = document.createElement("div");
    box.className = "report";
    box.innerHTML = `
      <div class="banner">
        <h2>GHANA EDUCATION SERVICE</h2>
        <div class="school-name">NKAWKAW NSUTA B BASIC SCHOOL</div>
        <div class="motto">"KNOWLEDGE IS POWER"</div>
        <h3 class="term-title">TERMINAL REPORT — ${term.toUpperCase()} ${year}</h3>
      </div>

      <div class="info-grid">
        <div><strong>Name:</strong> ${s.name}</div>
        <div><strong>Student ID:</strong> ${s.id}</div>
        <div><strong>Class:</strong> ${s.class}</div>
        <div><strong>Position:</strong> ${s.position} / ${ranked.length}</div>
        <div><strong>Date of Vacation:</strong> <input type="text" value="${existing.vacation || ''}" /></div>
        <div><strong>Next Term Begins:</strong> <input type="text" value="${existing.reopen || ''}" /></div>
      </div>

      <img class="student-photo" src="photos/${s.id}.jpg" onerror="this.src='photos/placeholder.jpg'" />

      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Class Score</th>
            <th>Exam</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          ${s.entries.map(e => `
            <tr>
              <td>${e.subject}</td>
              <td>${e.classScore}</td>
              <td>${e.examScore}</td>
              <td>${e.finalScore}</td>
              <td>${e.grade}</td>
              <td>${e.remark}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="info-grid">
        <div><strong>Total Marks:</strong> ${s.total}</div>
        <div><strong>Average:</strong> ${(s.total / s.entries.length).toFixed(1)}</div>
        <div><strong>Total Attendance:</strong><input type="text" value="${existing.attendance || ''}" /></div>
        <div><strong>Times School Opened:</strong><input type="text" value="${existing.opened || ''}" /></div>
        <div><strong>Interest:</strong><textarea>${existing.interest || ''}</textarea></div>
        <div><strong>Conduct:</strong><textarea>${existing.conduct || ''}</textarea></div>
        <div><strong>Strength / Weakness:</strong><textarea>${existing.strength || ''}</textarea></div>
        <div><strong>Teacher's Remarks:</strong><textarea>${existing.teacherRemarks || getTeacherRemark(s.total, s.entries.length)}</textarea></div>
        <div><strong>Headteacher's Remarks:</strong><textarea>${existing.headRemarks || ''}</textarea></div>
      </div>

      <div class="buttons no-print">
        ${!filterId ? "" : '<button onclick="window.print()">🖨️ Print This Report</button>'}
      </div>
    `;

    container.appendChild(box);
  });
}

function downloadAll() {
  const element = document.getElementById("report-container");
  const opt = {
    margin: 0.25,
    filename: 'All-Reports.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(element).save();
}