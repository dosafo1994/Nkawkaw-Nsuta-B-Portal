// preload.js

window.seedDefaultStudents = function () {
  if (!localStorage.getItem("studentDatabase")) {
    const defaultStudents = [
      { studentId: "FM1_01", name: "ACHEAMPONG OSEI NESTER", class: "JHS 1", gender: "Male" },
      { studentId: "FM1_02", name: "ADDO JONAS", class: "JHS 1", gender: "Male" },
      { studentId: "FM1_03", name: "ASIEDU BLESS", class: "JHS 1", gender: "Female" },
      { studentId: "FM1_04", name: "KWAME MENSAH", class: "JHS 1", gender: "Male" },
      { studentId: "FM1_05", name: "NYARKO GRACE", class: "JHS 1", gender: "Female" },
      { studentId: "FM2_01", name: "BOATENG EMMANUEL", class: "JHS 2", gender: "Male" },
      { studentId: "FM2_02", name: "OWUSU AKUA", class: "JHS 2", gender: "Female" },
      { studentId: "FM3_01", name: "AMOAKO MERCY", class: "JHS 3", gender: "Female" },
      { studentId: "FM3_02", name: "YAWSON ERIC", class: "JHS 3", gender: "Male" }
    ];

    localStorage.setItem("studentDatabase", JSON.stringify(defaultStudents));
    console.log("✅ Student database preloaded with default entries.");
  }
};

// Auto-run immediately
seedDefaultStudents();