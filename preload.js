// preload.js

(function preloadStudents() {
  if (!localStorage.getItem("studentDatabase")) {
    const defaultStudents = [
      { id: "FM1_01", name: "ACHEAMPONG OSEI NESTER", class: "JHS1" },
      { id: "FM1_02", name: "ADDO JONAS", class: "JHS1" },
      { id: "FM1_03", name: "ASIEDU BLESS", class: "JHS1" },
      { id: "FM1_04", name: "KWAME MENSAH", class: "JHS1" },
      { id: "FM1_05", name: "NYARKO GRACE", class: "JHS1" },
      { id: "FM2_01", name: "BOATENG EMMANUEL", class: "JHS2" },
      { id: "FM2_02", name: "OWUSU AKUA", class: "JHS2" },
      { id: "FM3_01", name: "AMOAKO MERCY", class: "JHS3" },
      { id: "FM3_02", name: "YAWSON ERIC", class: "JHS3" }
    ];

    localStorage.setItem("studentDatabase", JSON.stringify(defaultStudents));
    console.log("✅ Student database preloaded.");
  }
})();