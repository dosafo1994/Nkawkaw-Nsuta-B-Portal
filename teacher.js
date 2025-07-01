const name = sessionStorage.getItem("displayName") || "Teacher";
const phone = sessionStorage.getItem("username");
const role = sessionStorage.getItem("role");
const assignments = JSON.parse(sessionStorage.getItem("assignedSubjects")) || [];

document.getElementById("teacher-name").textContent = name;

// ⚠️ If role isn’t teacher, redirect
if (role !== "teacher") {
  alert("Access denied.");
  window.location.href = "welcome.html";
}

// 📌 Render assigned subjects as links
const assignmentDiv = document.getElementById("assignment-list");

if (assignments.length) {
  assignments.forEach(a => {
    const params = new URLSearchParams({
      subject: a.subject,
      class: a.class
    }).toString();

    const link = document.createElement("a");
    link.href = `score-entry.html?${params}`;
    link.className = "assignment-link";
    link.textContent = `${a.subject} — ${a.class}`;
    assignmentDiv.appendChild(link);
  });
} else {
  assignmentDiv.innerHTML = "<p>You don’t have any subject assignments yet.</p>";
}

// 🔔 Notification system
function toggleNotifications() {
  const list = document.getElementById("notif-list");
  list.style.display = list.style.display === "block" ? "none" : "block";
}

function loadNotifications() {
  const all = JSON.parse(localStorage.getItem("teacherNotifications")) || {};
  const personal = all[phone] || [];

  const notifList = document.getElementById("notif-list");
  const badge = document.getElementById("notif-badge");

  if (personal.length > 0) {
    badge.style.display = "inline-block";
    badge.textContent = personal.length;

    notifList.innerHTML = "";
    personal.reverse().forEach(n => {
      const li = document.createElement("li");
      li.textContent = `${n.subject} (${n.class}) was ${n.status} — ${n.date}`;
      notifList.appendChild(li);
    });
  } else {
    badge.style.display = "none";
    notifList.innerHTML = "<li>No recent updates.</li>";
  }
}

loadNotifications();