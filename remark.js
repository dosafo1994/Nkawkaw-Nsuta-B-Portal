const students = JSON.parse(localStorage.getItem("studentDatabase")) || [];
const remarksDB = JSON.parse(localStorage.getItem("studentRemarks")) || [];

const classSelect = document.getElementById("select-class");
const studentSelect = document.getElementById("select-student");

classSelect.addEventListener("change", () => {
  const selectedClass = classSelect.value;
  const filtered = students.filter(s => s.class === selectedClass);
  studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
  filtered.forEach(s => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = `${s.name} (${s.id})`;
    studentSelect.appendChild(option);
  });
});

function saveRemarks() {
  const studentId = studentSelect.value;
  if (!studentId) return alert("Please select a student");

  const entry = {
    id: studentId,
    class: classSelect.value,
    attendance: document.getElementById("attendance").value,
    opened: document.getElementById("opened").value,
    strength: document.getElementById("strength").value,
    interest: document.getElementById("interest").value,
    conduct: document.getElementById("conduct").value,
    teacherRemarks: document.getElementById("teacher-remarks").value,
    timestamp: new Date().toISOString()
  };

  // Update or insert
  const existingIndex = remarksDB.findIndex(r => r.id === studentId && r.class === entry.class);
  if (existingIndex !== -1) {
    remarksDB[existingIndex] = entry;
  } else {
    remarksDB.push(entry);
  }

  localStorage.setItem("studentRemarks", JSON.stringify(remarksDB));
  alert("✅ Remarks saved successfully!");
}