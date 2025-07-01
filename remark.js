const students = JSON.parse(localStorage.getItem("studentDatabase")) || [];
let remarksDB = JSON.parse(localStorage.getItem("studentRemarks")) || [];

const classSelect = document.getElementById("select-class");
const studentSelect = document.getElementById("select-student");

// Populate students when class is selected
function populateStudents() {
  const selectedClass = classSelect.value;
  const filtered = students.filter(s => s.class === selectedClass);
  studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
  filtered.forEach(s => {
    const option = document.createElement("option");
    option.value = s.studentId || s.id;
    option.textContent = `${s.name} (${s.studentId || s.id})`;
    studentSelect.appendChild(option);
  });
}

// Save remarks to localStorage
function saveRemarks() {
  const studentId = studentSelect.value;
  if (!studentId) return alert("Please select a student");

  const entry = {
    id: studentId,
    class: classSelect.value,
    attendance: document.getElementById("attendance").value.trim(),
    opened: document.getElementById("opened").value.trim(),
    strength: document.getElementById("strength").value.trim(),
    interest: document.getElementById("interest").value.trim(),
    conduct: document.getElementById("conduct").value.trim(),
    teacherRemarks: document.getElementById("teacher-remarks").value.trim(),
    timestamp: new Date().toISOString()
  };

  const existingIndex = remarksDB.findIndex(r => r.id === studentId && r.class === entry.class);
  if (existingIndex !== -1) {
    remarksDB[existingIndex] = entry;
  } else {
    remarksDB.push(entry);
  }

  localStorage.setItem("studentRemarks", JSON.stringify(remarksDB));
  alert("✅ Remarks saved successfully!");
}