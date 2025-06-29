// ✅ Multi-subject teacher account structure
const teacherAccounts = [
  {
    name: "Mr. Bright Ahiable",
    assignments: [
      { subject: "Mathematics", class: "JHS1" },
      { subject: "Mathematics", class: "JHS2" }
    ]
  },
  {
    name: "Mr. Stephen Amnakwah",
    assignments: [
      { subject: "Science", class: "JHS1" },
      { subject: "Science", class: "JHS2" }
    ]
  },
  {
    name: "Mr. Nii Quaye Kotei",
    assignments: [
      { subject: "English Language", class: "JHS1" },
      { subject: "Computing", class: "JHS1" },
      { subject: "English Language", class: "JHS2" },
      { subject: "Computing", class: "JHS2" }
    ]
  },
  {
    name: "Mr. Owusu",
    assignments: [
      { subject: "Ghanaian Language", class: "JHS1" },
      { subject: "Ghanaian Language", class: "JHS2" }
    ]
  },
  {
    name: "Mr. Yiadom",
    assignments: [
      { subject: "Social Studies", class: "JHS1" },
      { subject: "Social Studies", class: "JHS2" }
    ]
  },
  {
    name: "Mr. Frank Opoku",
    assignments: [
      { subject: "Creative Arts Design", class: "JHS1" },
      { subject: "Creative Arts Design", class: "JHS2" }
    ]
  },
  {
    name: "Mrs. Matilda Sagoe",
    assignments: [
      { subject: "Religious And Moral Education", class: "JHS1" },
      { subject: "Religious And Moral Education", class: "JHS2" }
    ]
  },
  {
    name: "Mrs. Cathrine",
    assignments: [
      { subject: "Career Technology", class: "JHS1" },
      { subject: "Career Technology", class: "JHS2" }
    ]
  }
];

// 🔐 Session validation
const username = sessionStorage.getItem("username");
const role = sessionStorage.getItem("role");

if (role !== "teacher" || !username) {
  window.location.href = "login.html";
}

const teacher = teacherAccounts.find(t => t.name.trim().toLowerCase() === username.trim().toLowerCase());
if (!teacher) {
  alert("Access denied: teacher not found.");
  window.location.href = "login.html";
}

document.getElementById("teacher-name").textContent = teacher.name;
document.getElementById("welcome-msg").style.display = "block";

// 🛎️ Load notifications
function loadNotifications() {
  const notifStore = JSON.parse(localStorage.getItem("teacherNotifications")) || {};
  const myNotes = notifStore[teacher.name] || [];

  const badge = document.getElementById("notif-badge");
  const list = document.getElementById("notif-list");

  if (myNotes.length) {
    badge.textContent = myNotes.length;
    badge.style.display = "inline-block";

    list.innerHTML = myNotes.map(n =>
      `<li><strong>${n.subject}</strong> (${n.class}) was <em>${n.status}</em> on ${n.date}</li>`
    ).join("");
  } else {
    badge.style.display = "none";
    list.innerHTML = "<li>No notifications yet.</li>";
  }
}

function toggleNotifications() {
  const list = document.getElementById("notif-list");
  list.style.display = list.style.display === "block" ? "none" : "block";
}

loadNotifications();

// 🔁 Assignment select
const select = document.getElementById("assignment-select");
teacher.assignments.forEach(a => {
  const opt = document.createElement("option");
  opt.value = `${a.subject}|${a.class}`;
  opt.textContent = `${a.subject} (${a.class})`;
  select.appendChild(opt);
});

let currentAssignment = {};

function loadStudents() {
  const selected = select.value;
  if (!selected) return alert("Please choose a subject/class");

  const [subject, className] = selected.split("|");
  currentAssignment = { subject, class: className };

  const submitted = JSON.parse(localStorage.getItem("submittedScores")) || [];
  const alreadySubmitted = submitted.some(s =>
    s.subject === subject &&
    s.class === className &&
    s.teacher === teacher.name
  );

  if (alreadySubmitted) {
    alert(`⚠️ You've already submitted ${subject} scores for ${className}. Contact the headteacher to unlock.`);
    return;
  }

  const students = JSON.parse(localStorage.getItem("studentDatabase")) || [];
  const classList = students.filter(s => s.class === className);

  const tbody = document.getElementById("score-table-body");
  tbody.innerHTML = "";

  classList.forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td><input type="number" name="cs-${s.id}" min="0" max="60" /></td>
        <td><input type="number" name="es-${s.id}" min="0" max="100" /></td>
      </tr>
    `;
  });

  document.getElementById("subject-header").textContent = `Enter Scores for ${subject} - ${className}`;
  document.getElementById("score-entry").style.display = "block";
}

function submitScores() {
  const rows = document.querySelectorAll("#score-table-body tr");
  const entries = [];
  const date = new Date().toISOString().split("T")[0];

  rows.forEach(row => {
    const id = row.cells[0].textContent;
    const name = row.cells[1].textContent;
    const classScore = parseInt(row.querySelector(`input[name="cs-${id}"]`).value) || 0;
    const examScore = parseInt(row.querySelector(`input[name="es-${id}"]`).value) || 0;
    const final = Math.round((classScore / 60) * 50 + (examScore / 100) * 50);

    entries.push({
      studentId: id,
      studentName: name,
      classScore,
      examScore,
      finalScore: final,
      subject: currentAssignment.subject,
      class: currentAssignment.class,
      teacher: teacher.name,
      status: "Pending",
      date
    });
  });

  const existing = JSON.parse(localStorage.getItem("submittedScores")) || [];
  localStorage.setItem("submittedScores", JSON.stringify([...existing, ...entries]));
  alert("✅ Scores submitted successfully.");
  document.getElementById("score-entry").style.display = "none";
}

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}