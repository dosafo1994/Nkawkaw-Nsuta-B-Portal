// router.js — Master client-side routing and role validation

(function () {
  const protectedRoutes = {
    headteacher: [
      "teachers.html",
      "report.html",
      "print-report.html",
      "report-hybrid.html", // ✅ NEW: Unified reporting interface
      "remark.html",
      "class-summary.html"
    ],
    teacher: [
      "teacher.html",
      "submission.html",
      "assignment.html",
      "report.html"
    ],
    admin: [
      "admin.html",
      "teachers.html"
    ]
  };

  const currentPage = window.location.pathname.split("/").pop().toLowerCase();
  const userRole = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");

  // 1. Redirect to welcome if not authenticated
  if (!username || !userRole) {
    if (!["welcome.html", "head-login.html", "forgot-pin.html", "index.html"].includes(currentPage)) {
      window.location.href = "welcome.html";
    }
    return;
  }

  // 2. Role-based route restriction
  const allowedPages = protectedRoutes[userRole] || [];
  const universallyAllowed = [
    "index.html",
    "portals.html",
    "change-pin.html",
    "pin-settings.html"
  ];

  if (
    allowedPages.length &&
    !allowedPages.includes(currentPage) &&
    !universallyAllowed.includes(currentPage)
  ) {
    alert("⛔ Access denied.");
    window.location.href = "index.html";
  }

  // 3. Global logout
  window.logout = function () {
    sessionStorage.clear();
    localStorage.removeItem("sessionToken");
    window.location.href = "welcome.html";
  };
})();