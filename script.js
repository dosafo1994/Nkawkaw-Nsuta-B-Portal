// ⬇️ Load teacher submissions from localStorage
const submissions = JSON.parse(localStorage.getItem("submittedScores")) || [];
const students = [];

/* === Headteacher Submissions Table === */
const tableBody = document.getElementById("submission-table");
const filterDropdown = document.getElementById("filter-status");

function renderTable(filteredList) {
  tableBody.innerHTML = "";
  filteredList.forEach((submission, index) => {
    const disabled = submission.status !== "Pending" ? "disabled" : "";
    tableBody.innerHTML += `
      <tr>
        <td>${submission.class}</td>
        <td>${submission.subject}</td>
        <td>${submission.teacher}</td>
        <td>${submission.date}</td>
        <td><span class="badge ${submission.status.toLowerCase()}">${submission.status}</span></td>
        <td>
          <button class="accept" onclick="updateStatus(${index}, 'Accepted')" ${disabled}>Accept</button>
          <button class="reject" onclick="updateStatus(${index}, 'Rejected')" ${disabled}>Reject</button>
        </td>
      </tr>
    `;
  });
}

function updateStatus(index, newStatus) {
  if (submissions[index].status !== "Pending") return;
  submissions[index].status = newStatus;
  localStorage.setItem("submittedScores", JSON.stringify(submissions));
  filterSubmissions();
}

function filterSubmissions() {
  const status = filterDropdown.value;
  const filtered = status === "All"
    ? submissions
    : submissions.filter(entry => entry.status === status);
  renderTable(filtered);
}

filterSubmissions();

/* === Class Rankings === */
function renderRankingTable() {
  const selectedClass = document.getElementById("class-select").value;
  const rankingBody = document.getElementById("ranking-body");

  const classStudents = students.filter(s => s.class === selectedClass);

  const ranked = classStudents.map(student => {
    const total = Object.values(student.finalScores).reduce((a, b) => a + b, 0);
    const average = Math.round(total / Object.keys(student.finalScores).length);
    const lastTotal = total - Math.floor(Math.random() * 21); // simulated

    return { name: student.name, total, average, lastTotal };
  });

  ranked.sort((a, b) => b.total - a.total);

  rankingBody.innerHTML = ranked.map((s, i) => {
    const diff = s.total - s.lastTotal;
    const trend = diff > 0 ? "📈" : diff < 0 ? "📉" : "➖";
    const tooltip = diff === 0 ? "No change" : `${diff > 0 ? "+" : ""}${diff} marks`;
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name} <span title="${tooltip}">${trend}</span></td>
        <td>${s.total}</td>
        <td>${s.average}</td>
      </tr>
    `;
  }).join("");
}

renderRankingTable();

/* === Student List View === */
function renderStudentList() {
  const selectedClass = document.getElementById("student-class-select").value;
  const search = document.getElementById("search-box").value.toLowerCase();
  const studentBody = document.getElementById("student-body");

  const filtered = students.filter(
    s => s.class === selectedClass &&
      (s.name.toLowerCase().includes(search) || s.id.toLowerCase().includes(search))
  );

  studentBody.innerHTML = filtered.map(student => {
    const subjects = Object.entries(student.finalScores)
      .map(([sub, score]) => `${sub}: ${score}`)
      .join(", ");
    return `
      <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.class}</td>
        <td>${subjects}</td>
      </tr>
    `;
  }).join("");
}

renderStudentList();

/* === CSV Upload Logic with C.score and E.score === */
function loadStudentCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function({ data, meta }) {
      students.length = 0;
      const headers = meta.fields;

      const subjects = [];

      // Detect subject base names from "Subject C.score" / "Subject E.score"
      headers.forEach((h, i) => {
        if (h.includes("C.score")) {
          const base = h.replace("C.score", "").trim();
          subjects.push(base);
        }
      });

      data.forEach(row => {
        const id = row["id"]?.trim();
        const name = row["name"]?.trim();
        const studentClass = row["class"]?.trim();

        const finalScores = {};

        subjects.forEach(subject => {
          const csKey = headers.find(h => h.startsWith(subject) && h.includes("C.score"));
          const esKey = headers.find(h => h.startsWith(subject) && h.includes("E.score"));

          const cRaw = parseFloat(row[csKey]) || 0;
          const eRaw = parseFloat(row[esKey]) || 0;

          const final = Math.round(((cRaw / 60) * 50) + ((eRaw / 100) * 50));
          finalScores[subject] = final;
        });

        students.push({
          id,
          name,
          class: studentClass,
          finalScores
        });
      });

      renderStudentList();
      renderRankingTable();
    }
  });
}
const teacherAccounts = [
  { name: "Mr. Kwesi", subject: "Mathematics", class: "JHS1" },
  { name: "Ms. Serwaa", subject: "Science", class: "JHS1" },
  { name: "Mr. Ampofo", subject: "English Language", class: "JHS1" },
  { name: "Mrs. Akua", subject: "Social Studies", class: "JHS1" }
];
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
// In index.html
if (sessionStorage.getItem("role") !== "headteacher") {
  window.location.href = "login.html";
}