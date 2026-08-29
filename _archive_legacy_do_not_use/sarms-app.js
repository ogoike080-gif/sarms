// React hooks from CDN
const { useState, useEffect, useCallback, useRef } = React;

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const COLORS = {
  navy: "#0B1437",
  navyLight: "#112060",
  indigo: "#1B3A8F",
  blue: "#2563EB",
  blueLight: "#3B82F6",
  gold: "#F59E0B",
  goldLight: "#FCD34D",
  emerald: "#10B981",
  rose: "#F43F5E",
  slate: "#64748B",
  slateLight: "#94A3B8",
  surface: "#0F172A",
  surfaceCard: "#1E293B",
  surfaceBorder: "#334155",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
};

// ─── INITIAL STATE (used only before data loads from server) ──────────────────
const INITIAL_STATE = {
  institution: {
    name: "My School",
    address: "",
    principal: "",
    principalComment: "",
    logo: null,
    signature: null,
  },
  sessions: ["2024/2025"],
  currentSession: "2024/2025",
  terms: ["First Term", "Second Term", "Third Term"],
  currentTerm: "First Term",
  gradingSystem: [
    { min: 70, max: 100, grade: "A", remark: "Excellent" },
    { min: 60, max: 69, grade: "B", remark: "Very Good" },
    { min: 50, max: 59, grade: "C", remark: "Good" },
    { min: 40, max: 49, grade: "D", remark: "Fair" },
    { min: 0,  max: 39, grade: "F", remark: "Fail"      },
  ],
  classes:   [],
  subjects:  [],
  // Only the admin account — all others added through the app
  users: [
    {
      id: "admin_1",
      role: "admin",
      name: "Administrator",
      email: "admin@school.com",
      password: "admin@2024",
      avatar: null,
    },
  ],
  scores:           [],
  announcements:    [],
  auditTrail:       [],
  resultPublished:  false,
  pinCodes:         [],
  assignments:      [],
  characterReports: {},
  characterTraits:  ["Punctuality","Neatness","Attentiveness","Cooperation","Honesty","Respect","Diligence"],
  payments: [],
  paymentTypes: ["School Fees", "Exam Fees", "Development Levy", "Uniform", "Books", "PTA Levy", "Others"],
  attendance: [],   // [{id, teacherId, date, timeIn, timeOut, status, classId, note, recordedBy}]
  // API sync flags
  _loaded: false,
  _apiError: null,
};

// ─── DB: PHP/MySQL BRIDGE ─────────────────────────────────────────────────────
// All data is read from / written to MySQL via the PHP API files.
// This runs silently in the background on every state change.
const DB = (() => {
  // Works on both:
  // - Vite dev server (localhost:5173) with proxy → calls /api/db.php → proxied to XAMPP
  // - XAMPP production (localhost/sarms) → calls /sarms/api/db.php directly
  const BASE = (() => {
    const { origin, port } = window.location;
    // On Vite dev server (port 5173), proxy handles /api/ → XAMPP
    if (port === '5173' || port === '3000') {
      return '/api/db.php';
    }
    // On XAMPP (port 80), detect the subfolder from the URL
    const segments = window.location.pathname.split('/').filter(Boolean);
    const folder = segments.length > 0 ? '/' + segments[0] : '';
    return origin + folder + '/api/db.php';
  })();

  async function req(action, method = "GET", body = null) {
    const url = `${BASE}?action=${action}`;
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`API ${action} failed (${res.status}): ${txt.slice(0, 120)}`);
    }
    return res.json();
  }

  return {
    // Load ALL app state from MySQL on startup
    loadAll: () => req("load_all"),

    // Save whichever slices were updated (called automatically by updateState)
    saveSlices: async (updates, fullState) => {
      const jobs = [];
      if (updates.institution)     jobs.push(req("save_institution",    "POST", { data: fullState.institution }));
      if (updates.users)           jobs.push(req("save_users",          "POST", { data: fullState.users }));
      if (updates.classes)         jobs.push(req("save_classes",        "POST", { data: fullState.classes }));
      if (updates.subjects)        jobs.push(req("save_subjects",       "POST", { data: fullState.subjects }));
      if (updates.scores)          jobs.push(req("save_scores",         "POST", { data: fullState.scores }));
      if (updates.announcements)   jobs.push(req("save_announcements",  "POST", { data: fullState.announcements }));
      if (updates.assignments)     jobs.push(req("save_assignments",    "POST", { data: fullState.assignments }));
      if (updates.pinCodes)        jobs.push(req("save_pins",           "POST", { data: fullState.pinCodes }));
      if (updates.auditTrail)      jobs.push(req("save_audit",          "POST", { data: fullState.auditTrail }));
      if (updates.gradingSystem)   jobs.push(req("save_grading",        "POST", { data: fullState.gradingSystem }));
      if (updates.characterReports) jobs.push(req("save_character",     "POST", { data: fullState.characterReports }));
      if (updates.payments)         jobs.push(req("save_payments",       "POST", { data: fullState.payments }));
      if (updates.paymentTypes)     jobs.push(req("save_payment_types",  "POST", { data: fullState.paymentTypes }));
      if (updates.attendance)       jobs.push(req("save_attendance",     "POST", { data: fullState.attendance }));
      if (updates.sessions !== undefined || updates.currentSession !== undefined ||
          updates.currentTerm !== undefined || updates.resultPublished !== undefined) {
        jobs.push(req("save_settings", "POST", {
          data: {
            sessions:        fullState.sessions,
            currentSession:  fullState.currentSession,
            currentTerm:     fullState.currentTerm,
            resultPublished: fullState.resultPublished,
          }
        }));
      }
      await Promise.all(jobs);
    },
  };
})();

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function getGrade(total, gradingSystem) {
  for (const g of gradingSystem) {
    if (total >= g.min && total <= g.max) return g;
  }
  return { grade: "F", remark: "Fail" };
}

function computeStudentResults(studentId, scores, gradingSystem) {
  const studentScores = scores.filter((s) => s.studentId === studentId);
  return studentScores.map((s) => {
    const total = (s.ca || 0) + (s.exam || 0);
    const gradeInfo = getGrade(total, gradingSystem);
    return { ...s, total, grade: gradeInfo.grade, remark: gradeInfo.remark };
  });
}

function rankStudents(students, scores, classId, session, term, gradingSystem) {
  const ranked = students.map((st) => {
    const stScores = scores.filter(
      (s) =>
        s.studentId === st.id &&
        s.classId === classId &&
        s.session === session &&
        s.term === term
    );
    const totalScore = stScores.reduce(
      (acc, s) => acc + (s.ca || 0) + (s.exam || 0),
      0
    );
    const avg =
      stScores.length > 0 ? (totalScore / stScores.length).toFixed(1) : 0;
    return { ...st, totalScore, avg, subjectCount: stScores.length };
  });

  ranked.sort((a, b) => b.totalScore - a.totalScore);

  // handle ties
  let rank = 1;
  for (let i = 0; i < ranked.length; i++) {
    if (i > 0 && ranked[i].totalScore === ranked[i - 1].totalScore) {
      ranked[i].position = ranked[i - 1].position;
    } else {
      ranked[i].position = rank;
    }
    rank++;
  }
  return ranked;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function generatePinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "GFA-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    users: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    book: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    chart: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    bell: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    settings: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    logout: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    plus: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    edit: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    trash: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    download: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    star: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        stroke={color}
        strokeWidth="1"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    lock: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    ai: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <circle cx="19" cy="5" r="3" fill={color} />
      </svg>
    ),
    search: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    pin: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    school: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    check: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    upload: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    chevronRight: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    eye: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    trophy: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="8 21 12 17 16 21" />
        <line x1="12" y1="17" x2="12" y2="11" />
        <path d="M7 4H17v7a5 5 0 0 1-10 0V4z" />
        <path d="M7 4a4 4 0 0 0-4 4v1h4" />
        <path d="M17 4a4 4 0 0 1 4 4v1h-4" />
      </svg>
    ),
    audit: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    promote: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    ),
    money: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    menu: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    close: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --navy: #0B1437;
    --navy-l: #112060;
    --indigo: #1B3A8F;
    --blue: #2563EB;
    --blue-l: #3B82F6;
    --gold: #F59E0B;
    --gold-l: #FCD34D;
    --emerald: #10B981;
    --rose: #F43F5E;
    --surface: #0F172A;
    --card: #1E293B;
    --border: #334155;
    --t1: #F1F5F9;
    --t2: #94A3B8;
    --t3: #64748B;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 16px;
    --r-xl: 24px;
    --shadow: 0 4px 24px rgba(0,0,0,0.3);
    --shadow-glow: 0 0 32px rgba(37,99,235,0.2);
  }

  html, body, #root { height: 100%; background: var(--surface); color: var(--t1); }
  body { font-family: var(--font-body); font-size: 14px; line-height: 1.6; }
  
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--card); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--t3); }

  .sarms-app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 260px; min-width: 260px;
    background: linear-gradient(180deg, var(--navy) 0%, var(--surface) 100%);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    transition: all 0.3s; position: relative; z-index: 10;
    overflow-y: auto;
  }
  .sidebar.collapsed { width: 72px; min-width: 72px; }
  .sidebar-logo {
    display: flex; align-items: center; gap: 12px;
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .sidebar-logo-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue), var(--indigo));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: var(--shadow-glow);
  }
  .sidebar-logo-text { font-family: var(--font-display); font-size: 16px; font-weight: 700; line-height: 1.2; }
  .sidebar-logo-sub { font-size: 11px; color: var(--t3); font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
  .sidebar-section { padding: 16px 12px 8px; }
  .sidebar-section-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--t3); padding: 0 8px 8px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: var(--r-sm);
    cursor: pointer; transition: all 0.2s;
    color: var(--t2); font-weight: 500; font-size: 14px;
    margin-bottom: 2px;
  }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: var(--t1); }
  .nav-item.active {
    background: linear-gradient(135deg, rgba(37,99,235,0.25), rgba(27,58,143,0.15));
    color: var(--blue-l);
    border: 1px solid rgba(37,99,235,0.2);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  }
  .nav-item .nav-icon { width: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .nav-item .nav-badge {
    margin-left: auto; background: var(--gold); color: #000;
    font-size: 10px; font-weight: 700; padding: 2px 6px;
    border-radius: 10px; min-width: 20px; text-align: center;
  }
  .sidebar-footer { margin-top: auto; padding: 16px 12px; border-top: 1px solid var(--border); }

  /* MAIN CONTENT */
  .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    height: 64px; display: flex; align-items: center;
    padding: 0 24px; gap: 16px;
    background: rgba(15,23,42,0.8); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 5;
  }
  .topbar-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; flex: 1; }
  .topbar-badge {
    background: linear-gradient(135deg, var(--blue), var(--indigo));
    color: white; font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 20px; letter-spacing: 0.03em;
  }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--blue));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 14px;
    cursor: pointer;
  }
  .page-content { flex: 1; overflow-y: auto; padding: 24px; }

  /* CARDS */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 24px;
    box-shadow: var(--shadow);
  }
  .card-sm { padding: 16px; border-radius: var(--r-md); }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px;
    position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow), var(--shadow-glow); }
  .stat-card-glow {
    position: absolute; top: -20px; right: -20px;
    width: 80px; height: 80px; border-radius: 50%;
    opacity: 0.15; filter: blur(20px);
  }
  .stat-card-icon {
    width: 44px; height: 44px; border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
  }
  .stat-card-value {
    font-family: var(--font-display); font-size: 32px; font-weight: 800;
    line-height: 1; margin-bottom: 4px;
  }
  .stat-card-label { font-size: 13px; color: var(--t2); font-weight: 500; }

  /* STATS GRID */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }

  /* TABLE */
  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left; padding: 12px 16px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--t3);
    border-bottom: 1px solid var(--border);
    background: rgba(0,0,0,0.2);
  }
  td { padding: 12px 16px; border-bottom: 1px solid rgba(51,65,85,0.5); font-size: 14px; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  /* FORMS */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--t2); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }
  .form-input {
    width: 100%; padding: 10px 14px;
    background: rgba(0,0,0,0.3); border: 1px solid var(--border);
    border-radius: var(--r-sm); color: var(--t1); font-family: var(--font-body); font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
  .form-input::placeholder { color: var(--t3); }
  select.form-input { cursor: pointer; }
  option { background: var(--card); }
  textarea.form-input { resize: vertical; min-height: 80px; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: var(--r-sm);
    font-family: var(--font-body); font-size: 14px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s;
    text-decoration: none; white-space: nowrap;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--blue), var(--indigo));
    color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }
  .btn-secondary { background: var(--card); color: var(--t1); border: 1px solid var(--border); }
  .btn-secondary:hover { background: rgba(255,255,255,0.08); }
  .btn-danger { background: rgba(244,63,94,0.15); color: var(--rose); border: 1px solid rgba(244,63,94,0.3); }
  .btn-danger:hover { background: rgba(244,63,94,0.25); }
  .btn-success { background: rgba(16,185,129,0.15); color: var(--emerald); border: 1px solid rgba(16,185,129,0.3); }
  .btn-success:hover { background: rgba(16,185,129,0.25); }
  .btn-gold { background: linear-gradient(135deg, var(--gold), #D97706); color: #000; font-weight: 700; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn-icon { padding: 8px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .badge-blue { background: rgba(37,99,235,0.2); color: var(--blue-l); }
  .badge-green { background: rgba(16,185,129,0.2); color: var(--emerald); }
  .badge-red { background: rgba(244,63,94,0.2); color: var(--rose); }
  .badge-gold { background: rgba(245,158,11,0.2); color: var(--gold); }
  .badge-gray { background: rgba(100,116,139,0.2); color: var(--t2); }

  /* GRADE BADGE */
  .grade-A { background: rgba(16,185,129,0.2); color: #10B981; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .grade-B { background: rgba(37,99,235,0.2); color: #60A5FA; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .grade-C { background: rgba(245,158,11,0.2); color: #FCD34D; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .grade-D { background: rgba(249,115,22,0.2); color: #FB923C; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .grade-F { background: rgba(244,63,94,0.2); color: #F43F5E; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px); z-index: 100;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn 0.15s ease;
  }
  .modal {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r-xl); padding: 28px;
    width: 100%; max-width: 560px; max-height: 90vh;
    overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
    animation: slideUp 0.2s ease;
  }
  .modal-lg { max-width: 800px; }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* LOGIN PAGE */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at 20% 20%, rgba(27,58,143,0.3) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(37,99,235,0.2) 0%, transparent 60%),
                var(--surface);
    padding: 24px;
  }
  .login-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r-xl); padding: 40px;
    width: 100%; max-width: 420px;
    box-shadow: var(--shadow), var(--shadow-glow);
  }
  .login-logo {
    width: 56px; height: 56px; border-radius: 14px;
    background: linear-gradient(135deg, var(--blue), var(--indigo));
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; box-shadow: var(--shadow-glow);
  }
  .login-title { font-family: var(--font-display); font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 4px; }
  .login-sub { font-size: 13px; color: var(--t2); text-align: center; margin-bottom: 28px; }

  /* PROGRESS BAR */
  .progress { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }

  /* AI INSIGHT */
  .ai-insight {
    background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(27,58,143,0.05));
    border: 1px solid rgba(37,99,235,0.2);
    border-radius: var(--r-md); padding: 16px;
    display: flex; gap: 12px; align-items: flex-start;
  }
  .ai-insight-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--blue), var(--indigo));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ANNOUNCEMENT */
  .announcement-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r-md); padding: 16px; margin-bottom: 12px;
    border-left: 3px solid var(--blue);
    transition: transform 0.2s;
  }
  .announcement-card:hover { transform: translateX(4px); }
  .announcement-card.admin-ann { border-left-color: var(--gold); }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
  .section-sub { font-size: 13px; color: var(--t2); margin-top: 2px; }

  /* RESULT PDF VIEW */
  .result-sheet {
    background: white; color: #1a1a2e; padding: 32px;
    border-radius: var(--r-md); font-family: 'Georgia', serif;
    max-width: 700px; margin: 0 auto;
  }
  .result-school-header { text-align: center; border-bottom: 2px solid #1B3A8F; padding-bottom: 16px; margin-bottom: 20px; }
  .result-school-name { font-size: 22px; font-weight: 700; color: #1B3A8F; }
  .result-school-addr { font-size: 12px; color: #666; margin-top: 4px; }
  .result-title { font-size: 14px; font-weight: 700; text-align: center; margin: 12px 0; color: #1B3A8F; text-transform: uppercase; letter-spacing: 0.1em; }
  .result-student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; font-size: 13px; }
  .result-info-item { display: flex; gap: 8px; }
  .result-info-label { font-weight: 700; color: #333; min-width: 80px; }
  .result-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
  .result-table th { background: #1B3A8F; color: white; padding: 8px; text-align: center; font-size: 11px; }
  .result-table td { padding: 7px 8px; border: 1px solid #ccc; text-align: center; }
  .result-table tr:nth-child(even) td { background: #f0f4ff; }
  .result-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid #ccc; }
  .result-signature { text-align: center; }
  .result-sig-line { border-top: 1px solid #333; margin-top: 40px; padding-top: 4px; font-size: 11px; }

  /* TAB */
  .tabs { display: flex; gap: 4px; padding: 4px; background: rgba(0,0,0,0.3); border-radius: var(--r-sm); margin-bottom: 20px; }
  .tab {
    flex: 1; padding: 8px 16px; border-radius: 6px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    text-align: center; transition: all 0.2s; color: var(--t2);
  }
  .tab.active { background: var(--blue); color: white; }
  .tab:hover:not(.active) { background: rgba(255,255,255,0.06); color: var(--t1); }

  /* SEARCH BAR */
  .search-bar {
    display: flex; align-items: center; gap: 10px;
    background: rgba(0,0,0,0.3); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 8px 14px;
  }
  .search-bar input { background: none; border: none; outline: none; color: var(--t1); font-family: var(--font-body); font-size: 14px; flex: 1; }
  .search-bar input::placeholder { color: var(--t3); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .sidebar { position: fixed; left: -260px; top: 0; bottom: 0; }
    .sidebar.mobile-open { left: 0; box-shadow: 10px 0 40px rgba(0,0,0,0.5); }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .page-content { padding: 16px; }
    .topbar { padding: 0 16px; }
  }

  /* BROADSHEET */
  .broadsheet-table { font-size: 12px; }
  .broadsheet-table th, .broadsheet-table td { padding: 8px 10px; }
  .position-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border-radius: 50%; font-weight: 700; font-size: 12px;
  }
  .pos-1 { background: linear-gradient(135deg, var(--gold), #D97706); color: #000; }
  .pos-2 { background: linear-gradient(135deg, #94A3B8, #64748B); color: #fff; }
  .pos-3 { background: linear-gradient(135deg, #B45309, #92400E); color: #fff; }
  .pos-other { background: var(--border); color: var(--t2); }

  /* SPINNER */
  .spinner {
    width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* INPUT RANGE */
  input[type=range] { accent-color: var(--blue); }

  /* SCORE INPUT */
  .score-input {
    width: 70px; padding: 6px 10px;
    background: rgba(0,0,0,0.3); border: 1px solid var(--border);
    border-radius: 6px; color: var(--t1); font-size: 14px;
    text-align: center; outline: none;
    transition: border-color 0.2s;
  }
  .score-input:focus { border-color: var(--blue); }

  /* NOTIFICATION DOT */
  .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rose); flex-shrink: 0; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 48px 24px; color: var(--t3); }
  .empty-state-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state-text { font-size: 16px; margin-bottom: 8px; color: var(--t2); font-weight: 500; }

  /* TOOLTIP */
  .tooltip-wrap { position: relative; display: inline-flex; }
  .tooltip-wrap:hover .tooltip { opacity: 1; transform: translateY(-4px); }
  .tooltip {
    position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%) translateY(0); opacity: 0;
    background: #1a1a2e; border: 1px solid var(--border);
    border-radius: 6px; padding: 5px 10px; font-size: 12px;
    white-space: nowrap; pointer-events: none;
    transition: all 0.15s; z-index: 20;
  }

  /* ANALYSIS BAR */
  .analysis-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .analysis-bar-label { font-size: 13px; color: var(--t2); min-width: 100px; }
  .analysis-bar-track { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .analysis-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .analysis-bar-value { font-size: 13px; font-weight: 600; min-width: 40px; text-align: right; }

  /* ANNOUNCEMENT COMPOSE */
  .compose-area { background: rgba(0,0,0,0.2); border-radius: var(--r-md); padding: 16px; margin-top: 16px; }

  /* SCORE TABLE SPECIFIC */
  .score-row td { padding: 8px 12px; }

  /* HIGHLIGHT ROW */
  .highlight-row td { background: rgba(37,99,235,0.08) !important; }

  /* TERM SELECTOR */
  .term-selector {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .term-chip {
    padding: 6px 16px; border-radius: 20px; cursor: pointer;
    font-size: 13px; font-weight: 600; transition: all 0.2s;
    border: 1px solid var(--border); color: var(--t2);
  }
  .term-chip.active { background: var(--blue); color: white; border-color: var(--blue); }
  .term-chip:hover:not(.active) { border-color: var(--blue-l); color: var(--blue-l); }

  /* PAGE ANIMATIONS */
  .page-enter { animation: pageEnter 0.25s ease; }
  @keyframes pageEnter { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
`;

// ─── APP COMPONENT ────────────────────────────────────────────────────────────
function SARMS() {
  // ── State: starts empty, loads from PHP/MySQL on mount ──────
  const [state, setState]         = useState(INITIAL_STATE);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError]   = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePage, setActivePage]   = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed]   = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [modal, setModal]           = useState(null);
  const [notification, setNotification] = useState(null);
  const styleRef = useRef(null);

  // ── Inject CSS once ──────────────────────────────────────────
  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement("style");
      style.textContent = injectStyles();
      document.head.appendChild(style);
      styleRef.current = style;
    }
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  // ── Load ALL data from PHP/MySQL on startup ──────────────────
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setAppLoading(true);
    setAppError(null);
    try {
      const data = await DB.loadAll();
      setState((prev) => ({ ...prev, ...data, _loaded: true }));
    } catch (err) {
      setAppError(err.message);
    } finally {
      setAppLoading(false);
    }
  };

  // ── showNotification must be declared BEFORE any early returns ──
  // React Rules of Hooks: all hooks must be called in the same order every render
  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ── Show loading screen while fetching from MySQL ────────────
  if (appLoading) {
    return (
      <div style={{ height:"100vh", display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center", gap:16,
                    background:"#0F172A" }}>
        <div style={{ width:72, height:72, borderRadius:18,
                      background:"linear-gradient(135deg,#2563EB,#1B3A8F)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:36, boxShadow:"0 0 32px rgba(37,99,235,0.4)" }}>🏫</div>
        <div style={{ fontFamily:"var(--font-display,sans-serif)", fontSize:24, fontWeight:800, color:"#F1F5F9" }}>
          SARMS
        </div>
        <div style={{ fontSize:13, color:"#64748B" }}>Connecting to database...</div>
        <div style={{ width:200, height:4, background:"#1E293B", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", background:"linear-gradient(90deg,#2563EB,#3B82F6)",
                        borderRadius:2, animation:"sarms-load 1.5s ease-in-out infinite" }} />
        </div>
        <style>{`@keyframes sarms-load{0%{width:0%;margin-left:0%}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}`}</style>
      </div>
    );
  }

  // ── Show error if DB connection fails ────────────────────────
  if (appError) {
    // Work out what URL the app is trying to reach
    const tryUrl = (() => {
      try {
        const loc = window.location;
        const parts = loc.pathname.split('/');
        const idx = parts.findIndex(p => p === 'sarms');
        if (idx >= 0) {
          return loc.origin + parts.slice(0, idx + 1).join('/') + '/api/db.php?action=ping';
        }
        return loc.origin + '/sarms/api/db.php?action=ping';
      } catch(e) { return 'http://localhost/sarms/api/db.php?action=ping'; }
    })();

    return (
      <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
                    background:"#0F172A", padding:24 }}>
        <div style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.3)",
                      borderRadius:16, padding:"32px 40px", maxWidth:560, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
          <div style={{ fontWeight:800, fontSize:20, color:"#F43F5E", marginBottom:16 }}>
            Database Connection Failed
          </div>

          <div style={{ color:"#94A3B8", fontSize:13, lineHeight:1.9, marginBottom:16, textAlign:"left" }}>
            <strong style={{color:"#F1F5F9"}}>Check these one by one:</strong><br/>
            <br/>
            <strong style={{color:"#F1F5F9"}}>1.</strong> XAMPP Control Panel → both <strong>Apache</strong> and <strong>MySQL</strong> must be green (Running)<br/>
            <strong style={{color:"#F1F5F9"}}>2.</strong> Address bar must show <code style={{background:"#1E293B",padding:"2px 6px",borderRadius:4,color:"#38BDF8"}}>http://localhost/sarms</code> — not a file path like <code style={{background:"#1E293B",padding:"2px 6px",borderRadius:4,color:"#f87171"}}>C:\xampp\...</code><br/>
            <strong style={{color:"#F1F5F9"}}>3.</strong> phpMyAdmin → database <code style={{background:"#1E293B",padding:"2px 6px",borderRadius:4,color:"#38BDF8"}}>sarms_db</code> must exist (import the SQL file if not)<br/>
            <strong style={{color:"#F1F5F9"}}>4.</strong> The file <code style={{background:"#1E293B",padding:"2px 6px",borderRadius:4,color:"#38BDF8"}}>api\db.php</code> must be inside your sarms folder<br/>
          </div>

          <div style={{ background:"#1E293B", borderRadius:8, padding:"12px 16px", marginBottom:16, textAlign:"left" }}>
            <div style={{ fontSize:11, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Test the PHP file directly — open this in your browser:
            </div>
            <a href={tryUrl} target="_blank" rel="noreferrer"
               style={{ color:"#38BDF8", fontSize:13, wordBreak:"break-all" }}>
              {tryUrl}
            </a>
            <div style={{ fontSize:11, color:"#64748B", marginTop:6 }}>
              You should see: <code style={{color:"#6ee7b7"}}>{'{"ok":true,"php":"8.x","db":"sarms_db"}'}</code><br/>
              If you see a 404 page → <strong style={{color:"#fca5a5"}}>db.php is not in the right folder</strong>
            </div>
          </div>

          <div style={{ fontSize:11, color:"#64748B", marginBottom:16 }}>
            Error detail: {appError}
          </div>

          <button onClick={loadAllData}
            style={{ padding:"10px 28px", background:"linear-gradient(135deg,#2563EB,#1B3A8F)",
                     color:"white", border:"none", borderRadius:8, cursor:"pointer",
                     fontWeight:700, fontSize:14 }}>
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const login = (email, password) => {
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      setActivePage("dashboard");
      showNotification(`Welcome back, ${user.name.split(" ")[0]}!`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage("dashboard");
  };

  // updateState: updates React state AND persists the relevant slice to MySQL
  const updateState = (updates) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      // Fire-and-forget save to DB (errors shown as notifications)
      DB.saveSlices(updates, next).catch((err) => {
        console.warn("DB save error:", err);
        showNotification("Auto-save failed: " + err.message, "error");
      });
      return next;
    });
  };

  // Updates both the users list AND the live currentUser session
  const updateCurrentUser = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setState((prev) => {
      const next = {
        ...prev,
        users: prev.users.map((u) => (u.id === currentUser.id ? updated : u)),
      };
      DB.saveSlices({ users: next.users }, next).catch((err) => {
        console.warn("DB save error:", err);
      });
      return next;
    });
  };

  if (!currentUser) {
    return <LoginPage onLogin={login} state={state} updateState={updateState} />;
  }

  const NavItems = getNavItems(currentUser.role);

  return (
    <div className="sarms-app">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9,
          }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileSidebarOpen ? "mobile-open" : ""}`}
      >
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Icon name="school" color="white" size={22} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="sidebar-logo-text">
                {state.institution.name.split(" ")[0]}
              </div>
              <div className="sidebar-logo-sub">SARMS v2.0</div>
            </div>
          )}
        </div>

        {NavItems.map((section) => (
          <div className="sidebar-section" key={section.section}>
            {!sidebarCollapsed && (
              <div className="sidebar-section-label">{section.section}</div>
            )}
            {section.items.map((item) => (
              <div
                key={item.key}
                className={`nav-item ${activePage === item.key ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.key);
                  setMobileSidebarOpen(false);
                }}
              >
                <span className="nav-icon">
                  <Icon
                    name={item.icon}
                    size={18}
                    color={
                      activePage === item.key
                        ? COLORS.blueLight
                        : COLORS.slateLight
                    }
                  />
                </span>
                {!sidebarCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div
            className="nav-item"
            onClick={logout}
            style={{ color: COLORS.rose }}
          >
            <span className="nav-icon">
              <Icon name="logout" size={18} color={COLORS.rose} />
            </span>
            {!sidebarCollapsed && <span>Logout</span>}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileSidebarOpen(!mobileSidebarOpen);
              } else {
                setSidebarCollapsed(!sidebarCollapsed);
              }
            }}
            style={{ marginRight: 4 }}
          >
            <Icon name="menu" size={16} />
          </button>
          <div className="topbar-title">
            {NavItems.flatMap((s) => s.items).find(
              (i) => i.key === activePage
            )?.label || "Dashboard"}
          </div>
          <div className="topbar-badge">{currentUser.role.toUpperCase()}</div>
          {(currentUser.role === "admin" || currentUser.role === "teacher") ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <select
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--t1)", fontSize: 12, padding: "4px 8px", cursor: "pointer", outline: "none", fontWeight: 600 }}
                value={state.currentSession}
                onChange={(e) => {
                  if (e.target.value === "__add__") {
                    setActivePage("institution");
                  } else {
                    updateState({ currentSession: e.target.value });
                  }
                }}
              >
                {state.sessions.map((s) => <option key={s} value={s}>{s}</option>)}
                {currentUser.role === "admin" && <option value="__add__">＋ Add Session…</option>}
              </select>
              <select
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--t1)", fontSize: 12, padding: "4px 8px", cursor: "pointer", outline: "none", fontWeight: 600 }}
                value={state.currentTerm}
                onChange={(e) => updateState({ currentTerm: e.target.value })}
              >
                {state.terms.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: COLORS.textSecondary, marginLeft: 8 }}>
              {state.currentTerm} · {state.currentSession}
            </div>
          )}
          <div
            className="avatar"
            onClick={() => setActivePage("profile")}
            title="My Profile"
            style={{ cursor: "pointer", position: "relative" }}
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
            )}
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div
            style={{
              position: "fixed",
              top: 80,
              right: 24,
              background:
                notification.type === "error" ? COLORS.rose : COLORS.emerald,
              color: "white",
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              zIndex: 200,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              animation: "slideUp 0.2s ease",
            }}
          >
            {notification.msg}
          </div>
        )}

        {/* PAGE CONTENT */}
        <div className="page-content page-enter">
          <PageRouter
            activePage={activePage}
            state={state}
            updateState={updateState}
            updateCurrentUser={updateCurrentUser}
            currentUser={currentUser}
            modal={modal}
            setModal={setModal}
            showNotification={showNotification}
          />
        </div>
      </div>
    </div>
  );
}

function getNavItems(role) {
  if (role === "admin") {
    return [
      {
        section: "Overview",
        items: [
          { key: "dashboard", label: "Dashboard", icon: "dashboard" },
          { key: "analytics", label: "Analytics", icon: "chart" },
          { key: "announcements", label: "Announcements", icon: "bell" },
        ],
      },
      {
        section: "Management",
        items: [
          { key: "students", label: "Students", icon: "users" },
          { key: "teachers", label: "Teachers", icon: "users" },
          { key: "classes", label: "Classes & Subjects", icon: "book" },
        ],
      },
      {
        section: "Finance",
        items: [
          { key: "payments", label: "Payments", icon: "money" },
        ],
      },
      {
        section: "Results",
        items: [
          { key: "broadsheet", label: "Broadsheet", icon: "chart" },
          { key: "pinmanager", label: "PIN Manager", icon: "pin" },
          { key: "audittrail", label: "Audit Trail", icon: "audit" },
        ],
      },
      {
        section: "Settings",
        items: [
          { key: "institution", label: "Institution", icon: "school" },
          { key: "grading", label: "Grading System", icon: "star" },
          { key: "profile", label: "My Profile", icon: "settings" },
        ],
      },
    ];
  }
  if (role === "teacher") {
    return [
      {
        section: "Overview",
        items: [
          { key: "dashboard",     label: "Dashboard",     icon: "dashboard" },
          { key: "announcements", label: "Announcements", icon: "bell" },
          { key: "attendance",    label: "My Attendance",  icon: "check" },
        ],
      },
      {
        section: "Scores",
        items: [
          { key: "scoreentry", label: "Score Entry",       icon: "edit" },
          { key: "broadsheet", label: "Class Broadsheet",  icon: "chart" },
        ],
      },
      {
        section: "Assignments",
        items: [
          { key: "assignments", label: "Assignments", icon: "book" },
        ],
      },
    ];
  }
  if (role === "principal") {
    return [
      {
        section: "Overview",
        items: [
          { key: "dashboard",     label: "Dashboard",       icon: "dashboard" },
          { key: "attendance",    label: "Staff Attendance", icon: "check" },
          { key: "analytics",     label: "Analytics",        icon: "chart" },
          { key: "broadsheet",    label: "Broadsheet",       icon: "book" },
          { key: "announcements", label: "Announcements",    icon: "bell" },
        ],
      },
      {
        section: "Administration",
        items: [
          { key: "students",  label: "Students",  icon: "users" },
          { key: "teachers",  label: "Staff",     icon: "teacher" },
          { key: "audittrail",label: "Audit Trail",icon: "audit" },
        ],
      },
      {
        section: "Account",
        items: [
          { key: "profile", label: "My Profile", icon: "settings" },
        ],
      },
    ];
  }
  if (role === "bursar") {
    return [
      {
        section: "Finance",
        items: [
          { key: "dashboard",    label: "Dashboard",    icon: "dashboard" },
          { key: "payments",     label: "Payments",     icon: "money" },
          { key: "announcements",label: "Announcements",icon: "bell" },
        ],
      },
      {
        section: "Account",
        items: [
          { key: "profile", label: "My Profile", icon: "settings" },
        ],
      },
    ];
  }
  if (role === "student") {
    return [
      {
        section: "My Portal",
        items: [
          { key: "dashboard", label: "Dashboard", icon: "dashboard" },
          { key: "announcements", label: "Announcements", icon: "bell" },
          { key: "assignments", label: "Assignments", icon: "upload" },
        ],
      },
    ];
  }
  if (role === "parent") {
    return [
      {
        section: "Portal",
        items: [
          { key: "dashboard", label: "Dashboard", icon: "dashboard" },
          { key: "announcements", label: "Announcements", icon: "bell" },
          { key: "assignments", label: "Assignments", icon: "upload" },
        ],
      },
    ];
  }
  return [];
}

// ─── PAGE ROUTER ──────────────────────────────────────────────────────────────
function PageRouter({
  activePage,
  state,
  updateState,
  updateCurrentUser,
  currentUser,
  modal,
  setModal,
  showNotification,
}) {
  const props = {
    state,
    updateState,
    updateCurrentUser,
    currentUser,
    modal,
    setModal,
    showNotification,
  };

  const isRestricted  = ["student", "parent"].includes(currentUser.role);
  const isBursar      = currentUser.role === "bursar";
  const isPrincipal   = currentUser.role === "principal";

  const pages = {
    dashboard:     <DashboardPage {...props} />,
    analytics:     isBursar ? <DashboardPage {...props} /> : <AnalyticsPage {...props} />,
    announcements: <AnnouncementsPage {...props} />,
    attendance:    <AttendancePage {...props} />,
    students:      isBursar ? <DashboardPage {...props} /> : <StudentsPage {...props} />,
    teachers:      isBursar ? <DashboardPage {...props} /> : <TeachersPage {...props} />,
    classes:       (isBursar || isPrincipal) ? <DashboardPage {...props} /> : <ClassesPage {...props} />,
    broadsheet:    isRestricted || isBursar ? <DashboardPage {...props} /> : <BroadsheetPage {...props} />,
    myresult:      isRestricted || isBursar ? <DashboardPage {...props} /> : <MyResultPage {...props} />,
    payments:      <PaymentsPage {...props} />,
    pinmanager:    (isBursar || isPrincipal) ? <DashboardPage {...props} /> : <PINManagerPage {...props} />,
    audittrail:    isBursar ? <DashboardPage {...props} /> : <AuditTrailPage {...props} />,
    institution:   (isBursar || isPrincipal) ? <DashboardPage {...props} /> : <InstitutionPage {...props} />,
    grading:       (isBursar || isPrincipal) ? <DashboardPage {...props} /> : <GradingPage {...props} />,
    scoreentry:    isBursar ? <DashboardPage {...props} /> : <ScoreEntryPage {...props} />,
    assignments:   isBursar ? <DashboardPage {...props} /> : <AssignmentsPage {...props} />,
    profile:       <ProfilePage {...props} />,
  };

  return pages[activePage] || <DashboardPage {...props} />;
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, state, updateState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | checker

  // Result checker state — 4 steps: class → student → term → PIN
  const [checkerClass, setCheckerClass]         = useState("");
  const [checkerStudentId, setCheckerStudentId] = useState("");
  const [checkerTerm, setCheckerTerm]           = useState("");
  const [checkerPin, setCheckerPin]             = useState("");
  const [checkerResult, setCheckerResult]       = useState(null);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const ok = onLogin(email, password);
    if (!ok) setError("Invalid email or password.");
    setLoading(false);
  };

  const handleChecker = () => {
    setError("");
    if (!checkerClass)     { setError("Please select a class."); return; }
    if (!checkerStudentId) { setError("Please select your registration number."); return; }
    if (!checkerTerm)      { setError("Please select a term."); return; }
    if (!checkerPin)       { setError("Please enter your result PIN."); return; }

    const student = state.users.find(
      (u) => u.role === "student" && u.id === checkerStudentId && u.classId === checkerClass
    );
    if (!student) { setError("Student not found."); return; }

    // PIN validation — pool system
    const pinEntry = (state.pinCodes || []).find(
      (p) => p.code === checkerPin.trim().toUpperCase()
    );
    if (!pinEntry) {
      setError("Invalid PIN. Please enter a valid result PIN code."); return;
    }
    if (pinEntry.claimedBy && pinEntry.claimedBy !== student.id) {
      setError("This PIN belongs to another student."); return;
    }
    if (pinEntry.usedCount >= 3) {
      setError("This PIN has been used 3 times and is exhausted. Contact your school admin for a new PIN."); return;
    }

    // Consume one use — claim and increment
    const newPinCodes = (state.pinCodes || []).map((p) =>
      p.code === pinEntry.code
        ? { ...p, claimedBy: student.id, usedCount: p.usedCount + 1 }
        : p
    );
    updateState({ pinCodes: newPinCodes });

    const usesLeft = 3 - (pinEntry.usedCount + 1);
    setCheckerResult({ classId: checkerClass, term: checkerTerm, student, usesLeft });
  };

  if (checkerResult) {
    return (
      <ResultCheckerView
        result={checkerResult}
        state={state}
        onBack={() => {
          setCheckerResult(null);
          setCheckerClass("");
          setCheckerStudentId("");
          setCheckerTerm("");
          setCheckerPin("");
          setError("");
        }}
      />
    );
  }

  // Students in the selected class (for the reg-number dropdown)
  const studentsInClass = state.users.filter(
    (u) => u.role === "student" && u.classId === checkerClass
  );

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Icon name="school" color="white" size={28} />
        </div>
        <div className="login-title">{state.institution.name}</div>
        <div className="login-sub">School Academic Record Management System</div>

        <div className="tabs">
          <div
            className={`tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Staff / Student Login
          </div>
          <div
            className={`tab ${mode === "checker" ? "active" : ""}`}
            onClick={() => { setMode("checker"); setError(""); }}
          >
            Result Checker
          </div>
        </div>

        {mode === "login" ? (
          <>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {error && (
              <div style={{ color: COLORS.rose, fontSize: 13, marginBottom: 12,
                            padding: "8px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8 }}>
                {error}
              </div>
            )}
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : "Sign In"}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, textAlign: "center" }}>
              Select your class, registration number and term to view your result
            </div>

            {/* Step 1 — Class */}
            <div className="form-group">
              <label className="form-label">① Class</label>
              <select
                className="form-input"
                value={checkerClass}
                onChange={(e) => {
                  setCheckerClass(e.target.value);
                  setCheckerStudentId("");
                  setError("");
                }}
              >
                <option value="">— Select your class —</option>
                {state.classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Step 2 — Registration Number (appears after class) */}
            {checkerClass && (
              <div className="form-group">
                <label className="form-label">② Registration Number</label>
                {studentsInClass.length === 0 ? (
                  <div style={{ fontSize: 13, color: COLORS.textMuted, padding: "10px 14px",
                                background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
                    No students found in this class.
                  </div>
                ) : (
                  <select
                    className="form-input"
                    value={checkerStudentId}
                    onChange={(e) => { setCheckerStudentId(e.target.value); setError(""); }}
                  >
                    <option value="">— Select your reg number —</option>
                    {studentsInClass.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.studentId} — {s.name}
                      </option>
                    ))}
                  </select>
                )}
                {/* Student preview card */}
                {checkerStudentId && (() => {
                  const sel = state.users.find((u) => u.id === checkerStudentId);
                  return sel ? (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10,
                                  padding: "10px 12px", background: "rgba(37,99,235,0.1)",
                                  borderRadius: 8, border: "1px solid rgba(37,99,235,0.2)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
                                    background: sel.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                        {sel.avatar
                          ? <img src={sel.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : sel.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{sel.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>
                          {sel.studentId} · {state.classes.find(c => c.id === sel.classId)?.name}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Step 3 — Term (appears after student) */}
            {checkerStudentId && (
              <div className="form-group">
                <label className="form-label">③ Term</label>
                <select
                  className="form-input"
                  value={checkerTerm}
                  onChange={(e) => { setCheckerTerm(e.target.value); setError(""); }}
                >
                  <option value="">— Select term —</option>
                  {(state.terms || ["First Term", "Second Term", "Third Term"]).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Step 4 — PIN (appears after term selected) */}
            {checkerTerm && (
              <div className="form-group">
                <label className="form-label">④ Result PIN</label>
                <input
                  className="form-input"
                  placeholder="e.g. GFA-X7K2M"
                  value={checkerPin}
                  onChange={(e) => { setCheckerPin(e.target.value.toUpperCase()); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleChecker()}
                  style={{ letterSpacing: "0.12em", fontWeight: 700, fontSize: 15 }}
                />
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 5 }}>
                  🔑 Each PIN can be used 3 times. Contact your school admin if you need a PIN.
                </div>
              </div>
            )}

            {error && (
              <div style={{ color: COLORS.rose, fontSize: 13, marginBottom: 12,
                            padding: "8px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8 }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={!checkerClass || !checkerStudentId || !checkerTerm || !checkerPin}
              onClick={handleChecker}
            >
              <Icon name="search" size={16} /> Check My Result
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── RESULT CHECKER VIEW ──────────────────────────────────────────────────────
function ResultCheckerView({ result, state, onBack }) {
  const { classId, term, student, usesLeft } = result;
  const cls = state.classes.find((c) => c.id === classId);

  const scores = state.scores.filter(
    (s) => s.studentId === student.id && s.term === term && s.session === state.currentSession
  );

  const classStudents = state.users.filter((u) => u.role === "student" && u.classId === classId);
  const ranked = rankStudents(
    classStudents,
    state.scores.filter((s) => s.term === term && s.session === state.currentSession),
    classId, state.currentSession, term, state.gradingSystem
  );
  const myRank = ranked.find((r) => r.id === student.id);

  return (
    <div className="login-page" style={{ flexDirection: "column", gap: 16, padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 740, margin: "0 auto", width: "100%" }}>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Check Another Result
        </button>
        {/* PIN uses remaining indicator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: usesLeft === 0 ? "rgba(244,63,94,0.1)" : usesLeft === 1 ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
          border: `1px solid ${usesLeft === 0 ? "rgba(244,63,94,0.3)" : usesLeft === 1 ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
          color: usesLeft === 0 ? COLORS.rose : usesLeft === 1 ? COLORS.gold : COLORS.emerald,
        }}>
          🔑 {usesLeft === 0
            ? "PIN exhausted — contact admin for a new PIN"
            : `${usesLeft} PIN use${usesLeft !== 1 ? "s" : ""} remaining`}
        </div>
      </div>

      {/* No scores message */}
      {scores.length === 0 ? (
        <div style={{ maxWidth: 740, margin: "0 auto", width: "100%" }}>
          <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              No Result Available
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: 14 }}>
              No scores have been entered for <strong>{student.name}</strong> in <strong>{term}</strong> yet.
              Please check back later or contact your school admin.
            </div>
          </div>
        </div>
      ) : (
        <ResultSheet
          student={student}
          scores={scores}
          term={term}
          state={state}
          cls={cls}
          forcedRank={myRank}
          totalStudents={classStudents.length}
        />
      )}
    </div>
  );
}

// ─── RESULT SHEET ─────────────────────────────────────────────────────────────
function ResultSheet({ student, scores, term, state, cls, isAnnual, forcedRank, totalStudents: forcedTotal }) {
  const TRAITS = state.characterTraits || ["Punctuality","Neatness","Attentiveness","Cooperation","Honesty","Respect","Diligence"];
  const RATINGS = ["Excellent","Very Good","Good","Fair","Poor"];

  // Load saved character report for this student/session/term
  const charKey = `${student.id}_${state.currentSession}_${term}`;
  const charReports = state.characterReports || {};
  const charData = charReports[charKey] || {};

  // Use pre-computed rank if passed (from ResultCheckerView), otherwise compute here
  const rankedStudents = (!forcedRank && cls)
    ? rankStudents(
        state.users.filter((u) => u.role === "student" && u.classId === student.classId),
        state.scores, student.classId, state.currentSession, term, state.gradingSystem
      )
    : [];
  const myRank      = forcedRank || rankedStudents.find((r) => r.id === student.id);
  const totalStudents = forcedTotal || rankedStudents.length;

  const grandTotal = isAnnual
    ? scores.reduce((a, s) => a + (s.annualAvg || 0), 0)
    : scores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0);
  const grandAvg = scores.length > 0 ? (grandTotal / scores.length).toFixed(1) : 0;
  const grandGrade = getGrade(Number(grandAvg), state.gradingSystem);

  const ratingColor = (r) => {
    if (r === "Excellent") return "#10B981";
    if (r === "Very Good") return "#3B82F6";
    if (r === "Good") return "#F59E0B";
    if (r === "Fair") return "#F97316";
    return "#F43F5E";
  };

  const printHtml = () => {
    const subRows = scores.map((s) => {
      const sub = state.subjects.find((sb) => sb.id === s.subjectId);
      if (isAnnual) {
        const gi = getGrade(s.annualAvg, state.gradingSystem);
        const parts = (s.comment || "").split("|").map(p => p.trim().split(":")[1]?.trim());
        return `<tr>
          <td style="text-align:left;font-weight:600">${sub?.name}</td>
          <td>${parts[0] || "—"}</td><td>${parts[1] || "—"}</td><td>${parts[2] || "—"}</td>
          <td style="font-weight:800;color:#1B3A8F">${s.annualAvg}</td>
          <td style="font-weight:800;color:#1B3A8F">${gi.grade}</td><td>${gi.remark}</td>
        </tr>`;
      }
      const tot = (s.ca || 0) + (s.exam || 0);
      const gi = getGrade(tot, state.gradingSystem);
      return `<tr>
        <td style="text-align:left;font-weight:600">${sub?.name}</td>
        <td>${s.ca}</td><td>${s.exam}</td>
        <td style="font-weight:800;color:#1B3A8F">${tot}</td>
        <td style="font-weight:800;color:#1B3A8F">${gi.grade}</td>
        <td>${gi.remark}</td><td style="font-size:11px;color:#555">${s.comment || ""}</td>
      </tr>`;
    }).join("");

    const traitRows = TRAITS.map((t) => {
      const rating = charData[t] || "—";
      const col = charData[t] ? ratingColor(charData[t]) : "#999";
      return `<tr><td style="text-align:left">${t}</td><td style="font-weight:700;color:${col}">${rating}</td></tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Result — ${student.name}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Georgia',serif;background:#f5f7ff;padding:28px;color:#1a1a2e}
  .page{background:white;max-width:740px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.15)}
  .header{background:linear-gradient(135deg,#1B3A8F,#2563EB);color:white;padding:24px 28px;display:flex;align-items:center;gap:20px}
  .logo{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:cover}
  .school-name{font-size:22px;font-weight:800;letter-spacing:0.02em}
  .school-addr{font-size:12px;opacity:0.8;margin-top:4px}
  .result-banner{background:linear-gradient(90deg,#F59E0B,#D97706);color:#000;text-align:center;padding:8px;font-size:13px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase}
  .body{padding:24px 28px}
  .student-row{display:flex;gap:20px;margin-bottom:20px;align-items:flex-start}
  .passport{width:90px;height:110px;border:3px solid #1B3A8F;border-radius:6px;overflow:hidden;background:#e8eaf6;display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0}
  .passport img{width:100%;height:100%;object-fit:cover}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;flex:1}
  .info-item{display:flex;gap:6px;font-size:13px}
  .info-label{font-weight:700;color:#333;min-width:80px}
  .section-title{font-size:13px;font-weight:800;color:#1B3A8F;text-transform:uppercase;letter-spacing:0.1em;border-bottom:2px solid #1B3A8F;padding-bottom:4px;margin:18px 0 10px}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{background:#1B3A8F;color:white;padding:7px 8px;font-size:11px;text-align:center}
  th:first-child{text-align:left}
  td{padding:6px 8px;border:1px solid #dce3f5;text-align:center}
  td:first-child{text-align:left}
  tr:nth-child(even) td{background:#f0f4ff}
  tfoot td{background:#e8edf8;font-weight:700}
  .char-table{width:auto;min-width:280px}
  .summary-box{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}
  .summary-item{background:#f0f4ff;border:1px solid #c7d4f5;border-radius:8px;padding:10px;text-align:center}
  .summary-val{font-size:22px;font-weight:800;color:#1B3A8F}
  .summary-lbl{font-size:10px;color:#666;text-transform:uppercase;letter-spacing:0.06em;margin-top:2px}
  .footer-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:24px;padding-top:16px;border-top:2px solid #1B3A8F}
  .sig-block{text-align:center}
  .sig-img{height:50px;max-width:120px;object-fit:contain;display:block;margin:0 auto 4px}
  .sig-line{border-top:1px solid #333;padding-top:4px;font-size:11px;color:#444}
  .principal-comment{background:#f0f4ff;border-left:4px solid #1B3A8F;padding:10px 14px;border-radius:0 8px 8px 0;font-style:italic;font-size:13px;color:#333;margin-top:14px}
  .stamp{border:3px double #1B3A8F;border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;color:#1B3A8F;font-size:9px;font-weight:700;text-align:center;padding:8px;line-height:1.3}
  @media print{body{background:white;padding:0}.page{box-shadow:none;border-radius:0}}
</style></head><body>
<div class="page">
  <div class="header">
    <div class="logo">${state.institution.logo ? `<img src="${state.institution.logo}" alt="logo"/>` : "🏫"}</div>
    <div>
      <div class="school-name">${state.institution.name}</div>
      <div class="school-addr">${state.institution.address}</div>
    </div>
  </div>
  <div class="result-banner">📋 ${term} Academic Result Report · ${state.currentSession}</div>
  <div class="body">
    <div class="student-row">
      <div class="passport">${student.avatar ? `<img src="${student.avatar}" alt="${student.name}"/>` : "👤"}</div>
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Full Name:</span><strong>${student.name}</strong></div>
        <div class="info-item"><span class="info-label">Class:</span>${cls?.name}</div>
        <div class="info-item"><span class="info-label">Student ID:</span>${student.studentId}</div>
        <div class="info-item"><span class="info-label">Position:</span><strong>${myRank ? `${ordinal(myRank.position)} of ${totalStudents}` : "N/A"}</strong></div>
        <div class="info-item"><span class="info-label">Session:</span>${state.currentSession}</div>
        <div class="info-item"><span class="info-label">Term:</span>${term}</div>
      </div>
    </div>

    <div class="summary-box">
      <div class="summary-item"><div class="summary-val">${scores.length}</div><div class="summary-lbl">Subjects</div></div>
      <div class="summary-item"><div class="summary-val" style="color:#1B3A8F">${typeof grandTotal === 'number' ? grandTotal.toFixed(1) : grandTotal}</div><div class="summary-lbl">Total Score</div></div>
      <div class="summary-item"><div class="summary-val">${grandAvg}</div><div class="summary-lbl">Average</div></div>
      <div class="summary-item"><div class="summary-val" style="color:${grandGrade.grade === 'A' ? '#10B981' : grandGrade.grade === 'F' ? '#F43F5E' : '#1B3A8F'}">${grandGrade.grade}</div><div class="summary-lbl">Overall Grade</div></div>
    </div>

    <div class="section-title">📚 Academic Performance</div>
    <table>
      <thead><tr>
        <th>Subject</th>
        ${isAnnual ? "<th>1st Term</th><th>2nd Term</th><th>3rd Term</th><th>Annual Avg</th>" : "<th>CA (40)</th><th>Exam (60)</th><th>Total (100)</th>"}
        <th>Grade</th><th>Remark</th>${!isAnnual ? "<th>Teacher's Comment</th>" : ""}
      </tr></thead>
      <tbody>${subRows}</tbody>
      <tfoot><tr>
        <td colspan="${isAnnual ? 4 : 3}" style="text-align:right">Grand Total / Average:</td>
        <td>${typeof grandTotal === 'number' ? grandTotal.toFixed(1) : grandTotal} / ${grandAvg}</td>
        <td style="color:#1B3A8F">${grandGrade.grade}</td>
        <td>${grandGrade.remark}</td>${!isAnnual ? "<td></td>" : ""}
      </tr></tfoot>
    </table>

    <div style="display:flex;gap:24px;margin-top:4px;align-items:flex-start">
      <div style="flex:1">
        <div class="section-title">🌟 Character & Moral Assessment</div>
        <table class="char-table">
          <thead><tr><th style="text-align:left">Trait</th><th>Rating</th></tr></thead>
          <tbody>${traitRows}</tbody>
        </table>
      </div>
      <div style="flex:1">
        <div class="section-title">📝 Teacher's Remark</div>
        <div style="font-size:13px;color:#333;font-style:italic;line-height:1.6;background:#f9f9ff;padding:10px 14px;border-radius:8px;border:1px solid #dce3f5">
          ${charData._teacherRemark || (Number(grandAvg) >= 70 ? "Outstanding academic performance. This student demonstrates excellent dedication and hard work. Keep it up!" : Number(grandAvg) >= 50 ? "Good performance this term. With more focus and consistency, even greater heights can be achieved." : "Improvement is needed in several areas. We encourage this student to put in more effort and seek help where needed.")}
        </div>
      </div>
    </div>

    ${state.institution.principalComment ? `
    <div class="principal-comment">
      <strong>Principal's Note:</strong> ${state.institution.principalComment}
    </div>` : ""}

    <div class="footer-row">
      <div class="sig-block">
        <div style="height:50px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px">
          <div style="width:100px;border-bottom:1px solid #333"></div>
        </div>
        <div class="sig-line">Class Teacher</div>
      </div>
      <div class="stamp">
        <div>${state.institution.name.split(" ").map(w=>w[0]).join("").slice(0,4)}<br/>OFFICIAL<br/>STAMP</div>
      </div>
      <div class="sig-block">
        ${state.institution.signature ? `<img class="sig-img" src="${state.institution.signature}" alt="Principal Signature"/>` : `<div style="height:50px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px"><div style="width:120px;border-bottom:1px solid #333"></div></div>`}
        <div class="sig-line">${state.institution.principal}<br/><span style="color:#888">Principal</span></div>
      </div>
    </div>

    <div style="text-align:center;font-size:10px;color:#aaa;margin-top:16px;border-top:1px solid #eee;padding-top:10px">
      This result is computer-generated by SARMS · ${state.institution.name} · ${new Date().toLocaleDateString()}
      · Any alteration renders this document invalid
    </div>
  </div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div>
      {/* Action bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={printHtml}>
          <Icon name="download" size={16} /> Download / Print PDF
        </button>
      </div>

      {/* Live preview card */}
      <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", maxWidth: 740, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1B3A8F,#2563EB)", color: "white", padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, overflow: "hidden" }}>
            {state.institution.logo ? <img src={state.institution.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🏫"}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>{state.institution.name}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>{state.institution.address}</div>
          </div>
        </div>
        <div style={{ background: "linear-gradient(90deg,#F59E0B,#D97706)", color: "#000", textAlign: "center", padding: "7px", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          📋 {term} Academic Result Report · {state.currentSession}
        </div>

        <div style={{ padding: "24px 28px", color: "#1a1a2e" }}>
          {/* Student info */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
            <div style={{ width: 90, height: 110, border: "3px solid #1B3A8F", borderRadius: 6, overflow: "hidden", background: "#e8eaf6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {student.avatar ? <img src={student.avatar} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 40 }}>👤</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", flex: 1 }}>
              {[
                ["Full Name", student.name],
                ["Class", cls?.name],
                ["Student ID", student.studentId],
                ["Position", myRank ? `${ordinal(myRank.position)} of ${totalStudents}` : "N/A"],
                ["Session", state.currentSession],
                ["Term", term],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", gap: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: "#333", minWidth: 80 }}>{l}:</span>
                  <span style={{ fontWeight: l === "Full Name" || l === "Position" ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Subjects", val: scores.length, color: "#1B3A8F" },
              { label: "Total", val: typeof grandTotal === "number" ? grandTotal.toFixed(1) : grandTotal, color: "#1B3A8F" },
              { label: "Average", val: grandAvg, color: "#D97706" },
              { label: "Grade", val: grandGrade.grade, color: grandGrade.grade === "A" ? "#10B981" : grandGrade.grade === "F" ? "#F43F5E" : "#1B3A8F" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#f0f4ff", border: "1px solid #c7d4f5", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Academic table */}
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1B3A8F", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "2px solid #1B3A8F", paddingBottom: 4, marginBottom: 10 }}>📚 Academic Performance</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 20 }}>
            <thead>
              <tr>
                <th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px", textAlign: "left" }}>Subject</th>
                {isAnnual
                  ? <><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>1st</th><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>2nd</th><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>3rd</th><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>Annual</th></>
                  : <><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>CA(40)</th><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>Exam(60)</th><th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>Total</th></>
                }
                <th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>Grade</th>
                <th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px" }}>Remark</th>
                {!isAnnual && <th style={{ background: "#1B3A8F", color: "white", padding: "7px 8px", textAlign: "left" }}>Comment</th>}
              </tr>
            </thead>
            <tbody>
              {scores.map((s, idx) => {
                const sub = state.subjects.find((sb) => sb.id === s.subjectId);
                if (isAnnual) {
                  const gi = getGrade(s.annualAvg, state.gradingSystem);
                  const parts = (s.comment || "").split("|").map(p => p.trim().split(":")[1]?.trim());
                  return (
                    <tr key={s.id || idx} style={{ background: idx % 2 === 1 ? "#f0f4ff" : "white" }}>
                      <td style={{ padding: "6px 8px", fontWeight: 600, border: "1px solid #dce3f5" }}>{sub?.name}</td>
                      {parts.map((p, i) => <td key={i} style={{ padding: "6px 8px", border: "1px solid #dce3f5", textAlign: "center" }}>{p || "—"}</td>)}
                      <td style={{ padding: "6px 8px", fontWeight: 800, color: "#1B3A8F", border: "1px solid #dce3f5", textAlign: "center" }}>{s.annualAvg}</td>
                      <td style={{ padding: "6px 8px", fontWeight: 800, color: "#1B3A8F", border: "1px solid #dce3f5", textAlign: "center" }}>{gi.grade}</td>
                      <td style={{ padding: "6px 8px", border: "1px solid #dce3f5", textAlign: "center" }}>{gi.remark}</td>
                    </tr>
                  );
                }
                const tot = (s.ca || 0) + (s.exam || 0);
                const gi = getGrade(tot, state.gradingSystem);
                return (
                  <tr key={s.id || idx} style={{ background: idx % 2 === 1 ? "#f0f4ff" : "white" }}>
                    <td style={{ padding: "6px 8px", fontWeight: 600, border: "1px solid #dce3f5" }}>{sub?.name}</td>
                    <td style={{ padding: "6px 8px", border: "1px solid #dce3f5", textAlign: "center" }}>{s.ca}</td>
                    <td style={{ padding: "6px 8px", border: "1px solid #dce3f5", textAlign: "center" }}>{s.exam}</td>
                    <td style={{ padding: "6px 8px", fontWeight: 800, color: "#1B3A8F", border: "1px solid #dce3f5", textAlign: "center" }}>{tot}</td>
                    <td style={{ padding: "6px 8px", fontWeight: 800, color: "#1B3A8F", border: "1px solid #dce3f5", textAlign: "center" }}>{gi.grade}</td>
                    <td style={{ padding: "6px 8px", border: "1px solid #dce3f5", textAlign: "center" }}>{gi.remark}</td>
                    <td style={{ padding: "6px 8px", border: "1px solid #dce3f5", fontSize: 11, color: "#555" }}>{s.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Character + Remarks side by side */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1B3A8F", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "2px solid #1B3A8F", paddingBottom: 4, marginBottom: 10 }}>🌟 Character & Moral</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ background: "#1B3A8F", color: "white", padding: "6px 8px", textAlign: "left" }}>Trait</th>
                    <th style={{ background: "#1B3A8F", color: "white", padding: "6px 8px" }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {TRAITS.map((t, i) => (
                    <tr key={t} style={{ background: i % 2 === 1 ? "#f0f4ff" : "white" }}>
                      <td style={{ padding: "5px 8px", border: "1px solid #dce3f5" }}>{t}</td>
                      <td style={{ padding: "5px 8px", border: "1px solid #dce3f5", textAlign: "center", fontWeight: 700, color: charData[t] ? ratingColor(charData[t]) : "#999" }}>
                        {charData[t] || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1B3A8F", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "2px solid #1B3A8F", paddingBottom: 4, marginBottom: 10 }}>📝 Remarks</div>
              <div style={{ background: "#f9f9ff", border: "1px solid #dce3f5", borderRadius: 8, padding: "12px 14px", fontSize: 13, fontStyle: "italic", color: "#333", lineHeight: 1.7, marginBottom: 12 }}>
                <strong>Teacher:</strong> {charData._teacherRemark || (Number(grandAvg) >= 70 ? "Outstanding performance. Keep it up!" : Number(grandAvg) >= 50 ? "Good performance. Room for improvement." : "More effort needed. We believe in you!")}
              </div>
              {state.institution.principalComment && (
                <div style={{ background: "#f0f4ff", borderLeft: "4px solid #1B3A8F", borderRadius: "0 8px 8px 0", padding: "10px 14px", fontSize: 13, fontStyle: "italic", color: "#333", lineHeight: 1.6 }}>
                  <strong>Principal:</strong> {state.institution.principalComment}
                </div>
              )}
            </div>
          </div>

          {/* Footer: signatures */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "2px solid #1B3A8F" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 100, borderBottom: "1px solid #333", marginBottom: 4, height: 44 }}></div>
              <div style={{ fontSize: 11, color: "#444" }}>Class Teacher</div>
            </div>
            <div style={{ border: "3px double #1B3A8F", borderRadius: "50%", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", color: "#1B3A8F", fontSize: 9, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
              {state.institution.name.split(" ").map(w => w[0]).join("").slice(0, 4)}<br />OFFICIAL
            </div>
            <div style={{ textAlign: "center" }}>
              {state.institution.signature
                ? <img src={state.institution.signature} alt="Signature" style={{ height: 44, maxWidth: 120, objectFit: "contain", display: "block", marginBottom: 4 }} />
                : <div style={{ width: 120, borderBottom: "1px solid #333", marginBottom: 4, height: 44 }}></div>
              }
              <div style={{ fontSize: 11, color: "#444" }}>{state.institution.principal}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Principal</div>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#aaa", marginTop: 14, paddingTop: 10, borderTop: "1px solid #eee" }}>
            SARMS · {state.institution.name} · Generated {new Date().toLocaleDateString()} · Any alteration renders this document invalid
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ state, currentUser, updateState, showNotification }) {
  const students = state.users.filter((u) => u.role === "student");
  const teachers = state.users.filter((u) => u.role === "teacher");
  const announcements = state.announcements
    .filter(
      (a) =>
        a.targetClass === "all" ||
        (currentUser.classId && a.targetClass === currentUser.classId) ||
        currentUser.role === "admin" ||
        currentUser.role === "teacher" ||
        currentUser.role === "bursar"
    )
    .slice(0, 4);

  // ── BURSAR DASHBOARD ─────────────────────────────────────────
  if (currentUser.role === "bursar") {
    const payments     = state.payments || [];
    const formatMoney  = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2 });
    const totalConf    = payments.filter(p => p.status === "Confirmed").reduce((s, p) => s + Number(p.amount), 0);
    const totalPend    = payments.filter(p => p.status === "Pending").reduce((s, p) => s + Number(p.amount), 0);
    const todayStr     = new Date().toDateString();
    const todayPayments= payments.filter(p => new Date(p.createdAt).toDateString() === todayStr);
    const todayTotal   = todayPayments.filter(p => p.status === "Confirmed").reduce((s, p) => s + Number(p.amount), 0);
    const pending      = payments.filter(p => p.status === "Pending");
    const recentConf   = payments.filter(p => p.status === "Confirmed")
                           .sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt))
                           .slice(0, 5);

    return (
      <div>
        {/* Welcome */}
        <div className="card" style={{
          background: "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(16,185,129,0.1))",
          border: "1px solid rgba(37,99,235,0.25)", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 20,
        }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
            background: currentUser.avatar ? "transparent" : "linear-gradient(135deg,var(--emerald),var(--blue))",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
            border: "3px solid rgba(16,185,129,0.4)" }}>
            {currentUser.avatar
              ? <img src={currentUser.avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
              : currentUser.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:20 }}>
              Welcome, {currentUser.name.split(" ")[0]} 👋
            </div>
            <div style={{ color:COLORS.textSecondary, marginTop:4, fontSize:13 }}>
              Bursar · {state.institution?.name} · {state.currentSession} — {state.currentTerm}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { label:"Total Collected",  value: formatMoney(totalConf), color: COLORS.emerald, icon:"💰", sub:`${payments.filter(p=>p.status==="Confirmed").length} payments` },
            { label:"Pending Amount",   value: formatMoney(totalPend), color: COLORS.gold,    icon:"⏳", sub:`${pending.length} awaiting confirmation` },
            { label:"Collected Today",  value: formatMoney(todayTotal),color: COLORS.blue,    icon:"📅", sub:`${todayPayments.length} payments today` },
            { label:"Total Students",   value: students.length,         color: COLORS.blueLight,icon:"👥",sub:"enrolled students" },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div className="stat-card-value" style={{ color:s.color, fontSize:20 }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
              <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Pending payments that need confirmation */}
          <div className="card">
            <div className="section-title" style={{ marginBottom:12 }}>
              ⏳ Awaiting Confirmation ({pending.length})
            </div>
            {pending.length === 0 ? (
              <div className="empty-state" style={{ padding:20 }}>
                <div className="empty-state-icon">✅</div>
                <div style={{ fontSize:13, color:COLORS.textMuted }}>All payments confirmed</div>
              </div>
            ) : (
              pending.slice(0,5).map(p => {
                const st = state.users.find(u => u.id === p.studentId);
                const cls= state.classes.find(c => c.id === st?.classId);
                return (
                  <div key={p.id} style={{ padding:"10px 14px", marginBottom:8, borderRadius:10,
                    background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)",
                    display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{st?.name}</div>
                      <div style={{ fontSize:12, color:COLORS.textSecondary }}>
                        {p.paymentType} · {cls?.name} · {p.method}
                      </div>
                    </div>
                    <div style={{ fontWeight:800, color:COLORS.gold, fontSize:15 }}>
                      {formatMoney(p.amount)}
                    </div>
                  </div>
                );
              })
            )}
            {pending.length > 5 && (
              <div style={{ fontSize:12, color:COLORS.textMuted, textAlign:"center", marginTop:8 }}>
                +{pending.length - 5} more — go to Payments to confirm all
              </div>
            )}
          </div>

          {/* Recently confirmed */}
          <div className="card">
            <div className="section-title" style={{ marginBottom:12 }}>
              ✅ Recently Confirmed
            </div>
            {recentConf.length === 0 ? (
              <div className="empty-state" style={{ padding:20 }}>
                <div className="empty-state-icon">💳</div>
                <div style={{ fontSize:13, color:COLORS.textMuted }}>No confirmed payments yet</div>
              </div>
            ) : (
              recentConf.map(p => {
                const st = state.users.find(u => u.id === p.studentId);
                return (
                  <div key={p.id} style={{ padding:"10px 14px", marginBottom:8, borderRadius:10,
                    background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.15)",
                    display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{st?.name}</div>
                      <div style={{ fontSize:12, color:COLORS.textSecondary }}>
                        {p.paymentType} · {p.receiptNo}
                      </div>
                      <div style={{ fontSize:11, color:COLORS.textMuted }}>
                        {new Date(p.confirmedAt).toLocaleDateString("en-NG")}
                      </div>
                    </div>
                    <div style={{ fontWeight:800, color:COLORS.emerald, fontSize:15 }}>
                      {formatMoney(p.amount)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="card" style={{ marginTop: 20 }}>
            <div className="section-title" style={{ marginBottom:12 }}>School Announcements</div>
            {announcements.map(a => (
              <div key={a.id} className="announcement-card">
                <div style={{ fontWeight:600, fontSize:14 }}>{a.title}</div>
                <div style={{ fontSize:12, color:COLORS.textSecondary, marginTop:4 }}>{a.content.slice(0,90)}</div>
                <div style={{ fontSize:11, color:COLORS.textMuted, marginTop:4 }}>{a.author} · {a.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (currentUser.role === "principal") {
    const today       = new Date().toISOString().split("T")[0];
    const todayAtt    = (state.attendance || []).filter(a => a.date === today);
    const teachers    = state.users.filter(u => u.role === "teacher");
    const presentToday= todayAtt.filter(a => a.status === "Present").length;
    const absentToday = todayAtt.filter(a => a.status === "Absent").length;
    const lateToday   = todayAtt.filter(a => a.status === "Late").length;
    const unmarked    = teachers.length - todayAtt.length;

    // Weekly attendance summary (last 7 days)
    const last7 = Array.from({length:7}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6-i));
      const ds = d.toISOString().split("T")[0];
      const dayAtt = (state.attendance||[]).filter(a => a.date === ds);
      return {
        date: ds,
        label: d.toLocaleDateString("en-NG",{weekday:"short"}),
        present: dayAtt.filter(a=>a.status==="Present").length,
        absent:  dayAtt.filter(a=>a.status==="Absent").length,
        late:    dayAtt.filter(a=>a.status==="Late").length,
        total:   teachers.length,
      };
    });

    // Recently absent teachers
    const recentAbsent = (state.attendance||[])
      .filter(a => a.status === "Absent")
      .sort((a,b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    return (
      <div>
        {/* Welcome */}
        <div className="card" style={{
          background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(37,99,235,0.15))",
          border:"1px solid rgba(139,92,246,0.3)", marginBottom:24,
          display:"flex", alignItems:"center", gap:20,
        }}>
          <div style={{ width:60, height:60, borderRadius:"50%", flexShrink:0,
            background: currentUser.avatar ? "transparent" : "linear-gradient(135deg,#7c3aed,#2563EB)",
            overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontWeight:800, fontSize:22,
            border:"3px solid rgba(139,92,246,0.4)" }}>
            {currentUser.avatar
              ? <img src={currentUser.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : currentUser.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div style={{fontFamily:"var(--font-display)",fontWeight:800,fontSize:20}}>
              Welcome, {currentUser.name.split(" ")[0]} 👋
            </div>
            <div style={{color:COLORS.textSecondary, marginTop:4, fontSize:13}}>
              Principal · {state.institution?.name} · {new Date().toLocaleDateString("en-NG",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </div>
          </div>
        </div>

        {/* Today's attendance stats */}
        <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:16,marginBottom:12}}>
          📋 Today's Staff Attendance — {new Date().toLocaleDateString("en-NG",{day:"numeric",month:"long"})}
        </div>
        <div className="stats-grid" style={{marginBottom:24}}>
          {[
            {label:"Present",    value:presentToday, color:COLORS.emerald, icon:"✅", sub:`of ${teachers.length} teachers`},
            {label:"Absent",     value:absentToday,  color:COLORS.rose,    icon:"❌", sub:"not in school"},
            {label:"Late",       value:lateToday,    color:COLORS.gold,    icon:"⏰", sub:"arrived late"},
            {label:"Not Marked", value:unmarked,     color:COLORS.textMuted,icon:"❓",sub:"awaiting check-in"},
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div style={{fontSize:28,marginBottom:4}}>{s.icon}</div>
              <div className="stat-card-value" style={{color:s.color,fontSize:24}}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
              <div style={{fontSize:11,color:COLORS.textMuted,marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Weekly trend */}
          <div className="card">
            <div className="section-title" style={{marginBottom:16}}>📊 7-Day Attendance Trend</div>
            {last7.map(day => {
              const pct = day.total > 0 ? Math.round(day.present / day.total * 100) : 0;
              return (
                <div key={day.date} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13}}>
                    <span style={{fontWeight:600}}>{day.label} <span style={{fontSize:11,color:COLORS.textMuted}}>{day.date}</span></span>
                    <span style={{display:"flex",gap:10,fontSize:12}}>
                      <span style={{color:COLORS.emerald}}>✅{day.present}</span>
                      <span style={{color:COLORS.rose}}>❌{day.absent}</span>
                      <span style={{color:COLORS.gold}}>⏰{day.late}</span>
                      <span style={{fontWeight:700,color: pct>=80?COLORS.emerald:pct>=60?COLORS.gold:COLORS.rose}}>{pct}%</span>
                    </span>
                  </div>
                  <div style={{height:8,background:"var(--border)",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${pct>=80?"var(--emerald)":pct>=60?"var(--gold)":"var(--rose)"},${pct>=80?"#059669":pct>=60?"#d97706":"#e11d48"})`,borderRadius:4,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Teacher status today */}
          <div className="card">
            <div className="section-title" style={{marginBottom:12}}>
              👨‍🏫 Teacher Status — Today
            </div>
            {teachers.length === 0 ? (
              <div className="empty-state" style={{padding:20}}>
                <div className="empty-state-icon">👥</div>
                <div style={{fontSize:13,color:COLORS.textMuted}}>No teachers added yet</div>
              </div>
            ) : (
              teachers.map(t => {
                const rec = todayAtt.find(a => a.teacherId === t.id);
                const statusColor = !rec ? COLORS.textMuted : rec.status==="Present" ? COLORS.emerald : rec.status==="Late" ? COLORS.gold : COLORS.rose;
                const statusIcon  = !rec ? "❓" : rec.status==="Present" ? "✅" : rec.status==="Late" ? "⏰" : "❌";
                return (
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                      background:t.avatar?"transparent":"linear-gradient(135deg,var(--blue),var(--indigo))",
                      overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
                      {t.avatar?<img src={t.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        :t.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{t.name}</div>
                      {rec && <div style={{fontSize:11,color:COLORS.textMuted}}>
                        In: {rec.timeIn || "—"} {rec.timeOut ? `· Out: ${rec.timeOut}` : ""}
                      </div>}
                    </div>
                    <div style={{fontSize:14,fontWeight:700,color:statusColor}}>
                      {statusIcon} {rec?.status || "Not Marked"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent absences */}
        {recentAbsent.length > 0 && (
          <div className="card" style={{marginTop:20}}>
            <div className="section-title" style={{marginBottom:12}}>⚠️ Recent Absences</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Teacher</th><th>Date</th><th>Note</th><th>Recorded By</th></tr></thead>
                <tbody>
                  {recentAbsent.map(a => {
                    const t = state.users.find(u => u.id === a.teacherId);
                    return (
                      <tr key={a.id}>
                        <td style={{fontWeight:600}}>{t?.name || "—"}</td>
                        <td style={{fontSize:12,color:COLORS.textSecondary}}>{a.date}</td>
                        <td style={{fontSize:12,color:COLORS.textMuted}}>{a.note || "—"}</td>
                        <td style={{fontSize:12,color:COLORS.textMuted}}>{a.recordedByName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentUser.role === "admin") {
    const statData = [
      {
        label: "Total Students",
        value: students.length,
        icon: "users",
        color: COLORS.blue,
        bg: "rgba(37,99,235,0.15)",
      },
      {
        label: "Total Teachers",
        value: teachers.length,
        icon: "users",
        color: COLORS.gold,
        bg: "rgba(245,158,11,0.15)",
      },
      {
        label: "Classes",
        value: state.classes.length,
        icon: "book",
        color: COLORS.emerald,
        bg: "rgba(16,185,129,0.15)",
      },
      {
        label: "Subjects",
        value: state.subjects.length,
        icon: "star",
        color: COLORS.rose,
        bg: "rgba(244,63,94,0.15)",
      },
    ];

    return (
      <div>
        <div
          style={{ marginBottom: 24 }}
          className="card"
          style={{
            background:
              "linear-gradient(135deg, rgba(27,58,143,0.5), rgba(37,99,235,0.3))",
            border: "1px solid rgba(37,99,235,0.3)",
            marginBottom: 24,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              Welcome back, Admin 👋
            </div>
            <div style={{ color: COLORS.textSecondary, marginTop: 4 }}>
              {state.currentTerm} · {state.currentSession} ·{" "}
              {state.institution.name}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {!state.resultPublished ? (
              <button
                className="btn btn-gold"
                onClick={() => {
                  updateState({ resultPublished: true });
                  showNotification("Results published successfully!");
                }}
              >
                <Icon name="check" size={16} /> Publish Results
              </button>
            ) : (
              <span
                className="badge badge-green"
                style={{ padding: "8px 14px", fontSize: 13 }}
              >
                <Icon name="check" size={14} /> Results Published
              </span>
            )}
          </div>
        </div>

        <div className="stats-grid">
          {statData.map((s) => (
            <div className="stat-card" key={s.label}>
              <div
                className="stat-card-glow"
                style={{ background: s.color }}
              ></div>
              <div
                className="stat-card-icon"
                style={{ background: s.bg, color: s.color }}
              >
                <Icon name={s.icon} size={22} color={s.color} />
              </div>
              <div className="stat-card-value" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="section-header">
              <div>
                <div className="section-title">Recent Announcements</div>
              </div>
              <span className="badge badge-blue">
                {announcements.length} new
              </span>
            </div>
            {announcements.map((a) => (
              <div
                key={a.id}
                className={`announcement-card ${a.role === "admin" ? "admin-ann" : ""}`}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {a.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: COLORS.textSecondary,
                    marginBottom: 6,
                  }}
                >
                  {a.content.slice(0, 80)}...
                </div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                  {a.author} · {a.date}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-header">
              <div className="section-title">Quick Actions</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  label: "Add New Student",
                  icon: "plus",
                  color: COLORS.blue,
                  action: () => {},
                },
                {
                  label: "Add New Teacher",
                  icon: "plus",
                  color: COLORS.emerald,
                  action: () => {},
                },
                {
                  label: "Generate PIN Codes",
                  icon: "pin",
                  color: COLORS.gold,
                  action: () => {},
                },
                {
                  label: "View Broadsheet",
                  icon: "chart",
                  color: COLORS.rose,
                  action: () => {},
                },
              ].map((q) => (
                <button
                  key={q.label}
                  className="btn btn-secondary"
                  style={{ justifyContent: "flex-start" }}
                >
                  <Icon name={q.icon} size={16} color={q.color} />
                  {q.label}
                </button>
              ))}
            </div>

            <div className="divider" />
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Audit Trail (Recent)</div>
            {state.auditTrail.slice(0, 2).map((a) => (
              <div
                key={a.id}
                style={{
                  fontSize: 13,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontWeight: 600 }}>{a.userName}</span>{" "}
                <span style={{ color: COLORS.textSecondary }}>
                  {a.action}: {a.details}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === "teacher") {
    const myClasses = state.classes.filter((c) =>
      (currentUser.classes || []).includes(c.id)
    );
    const myStudents = students.filter((s) =>
      (currentUser.classes || []).includes(s.classId)
    );
    const myScores = state.scores.filter(
      (s) => s.enteredBy === currentUser.id
    );

    return (
      <div>
        <div
          className="card"
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(27,58,143,0.2))",
            border: "1px solid rgba(16,185,129,0.3)",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Welcome, {currentUser.name} 👋
          </div>
          <div style={{ color: COLORS.textSecondary, marginTop: 4 }}>
            {myClasses.map((c) => c.name).join(", ")} ·{" "}
            {(currentUser.subjects || []).length} Subjects
          </div>
        </div>

        <div className="stats-grid">
          {[
            {
              label: "My Classes",
              value: myClasses.length,
              color: COLORS.blue,
            },
            {
              label: "My Students",
              value: myStudents.length,
              color: COLORS.emerald,
            },
            {
              label: "Scores Entered",
              value: myScores.length,
              color: COLORS.gold,
            },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div
                className="stat-card-value"
                style={{ color: s.color, fontSize: 28 }}
              >
                {s.value}
              </div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            Recent Announcements
          </div>
          {announcements.slice(0, 3).map((a) => (
            <div key={a.id} className="announcement-card">
              <div style={{ fontWeight: 600 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
                {a.content.slice(0, 100)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Student / Parent dashboard
  const studentUser =
    currentUser.role === "parent"
      ? state.users.find((u) => u.id === currentUser.childId)
      : currentUser;
  const cls = state.classes.find((c) => c.id === studentUser?.classId);
  const recentAssignments = (state.assignments || [])
    .filter((a) => a.classId === studentUser?.classId)
    .slice(0, 3);

  return (
    <div>
      {/* Welcome card */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(37,99,235,0.15))",
          border: "1px solid rgba(245,158,11,0.2)",
          marginBottom: 24,
          display: "flex", alignItems: "center", gap: 20,
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
          border: "3px solid rgba(245,158,11,0.4)", overflow: "hidden",
          background: studentUser?.avatar ? "transparent" : "linear-gradient(135deg, var(--gold), var(--blue))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
        }}>
          {studentUser?.avatar
            ? <img src={studentUser.avatar} alt={studentUser.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : (studentUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?")
          }
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>
            {currentUser.role === "parent"
              ? `Welcome, ${currentUser.name.split(" ")[0]} 👋`
              : `Welcome, ${currentUser.name.split(" ")[0]} 👋`}
          </div>
          <div style={{ color: COLORS.textSecondary, marginTop: 4 }}>
            {currentUser.role === "parent"
              ? `Viewing portal for ${studentUser?.name} · ${cls?.name}`
              : `${cls?.name} · ID: ${studentUser?.studentId}`}
          </div>
        </div>
      </div>

      {/* Result checker notice */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(27,58,143,0.1))",
        border: "1px solid rgba(37,99,235,0.25)",
        borderRadius: 14, padding: "20px 24px",
        display: "flex", alignItems: "center", gap: 20,
        marginBottom: 24,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, var(--blue), var(--indigo))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 24px rgba(37,99,235,0.3)",
        }}>
          <Icon name="book" size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            View Your Academic Results
          </div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
            Use the <strong style={{ color: COLORS.textPrimary }}>Result Checker</strong> on the login page — select your class and term to view and download your result sheet.
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <span className="badge badge-green" style={{ fontSize: 12, padding: "6px 14px" }}>
            📋 Open Access
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Announcements */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            School Announcements
          </div>
          {announcements.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-icon">📢</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>No announcements yet</div>
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                  {a.content.slice(0, 90)}
                </div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>
                  {a.author} · {a.date}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent assignments */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 12 }}>
            Recent Assignments
          </div>
          {recentAssignments.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-icon">📚</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>No assignments yet</div>
            </div>
          ) : (
            recentAssignments.map((a) => {
              const sub = state.subjects.find((s) => s.id === a.subjectId);
              const isOverdue = new Date(a.dueDate) < new Date();
              const submitted = (a.submissions || []).some((s) => s.studentId === studentUser?.id);
              return (
                <div key={a.id} style={{
                  padding: "12px 14px", marginBottom: 10, borderRadius: 10,
                  background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)",
                  borderLeft: `3px solid ${submitted ? COLORS.emerald : isOverdue ? COLORS.rose : COLORS.blue}`,
                }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span className="badge badge-blue" style={{ fontSize: 11 }}>{sub?.name}</span>
                    <span className={`badge ${isOverdue ? "badge-red" : "badge-green"}`} style={{ fontSize: 11 }}>
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                    {submitted && <span className="badge badge-green" style={{ fontSize: 11 }}>✅ Submitted</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage({ state, currentUser, showNotification }) {
  const [aiInsight, setAiInsight] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const students = state.users.filter((u) => u.role === "student");

  const classPerformance = state.classes.map((cls) => {
    const clsStudents = students.filter((s) => s.classId === cls.id);
    const clsScores = state.scores.filter(
      (s) =>
        s.classId === cls.id &&
        s.session === state.currentSession &&
        s.term === state.currentTerm
    );
    const avg =
      clsScores.length > 0
        ? clsScores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0) /
          clsScores.length
        : 0;
    return { ...cls, avg: avg.toFixed(1), studentCount: clsStudents.length };
  });

  const subjectPerformance = state.subjects.map((sub) => {
    const subScores = state.scores.filter(
      (s) =>
        s.subjectId === sub.id &&
        s.session === state.currentSession &&
        s.term === state.currentTerm
    );
    const pass = subScores.filter(
      (s) => (s.ca || 0) + (s.exam || 0) >= 40
    ).length;
    const total = subScores.length;
    const passRate = total > 0 ? Math.round((pass / total) * 100) : 0;
    const avg =
      total > 0
        ? (
            subScores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0) /
            total
          ).toFixed(1)
        : 0;
    return { ...sub, passRate, avg, total };
  });

  const topStudents = students
    .map((st) => {
      const sc = state.scores.filter(
        (s) =>
          s.studentId === st.id &&
          s.session === state.currentSession &&
          s.term === state.currentTerm
      );
      const total = sc.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0);
      const avg = sc.length > 0 ? (total / sc.length).toFixed(1) : 0;
      const cls = state.classes.find((c) => c.id === st.classId);
      return { ...st, total, avg, cls };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const getAIInsights = async () => {
    setLoadingAI(true);
    try {
      const context = {
        classes: classPerformance,
        subjects: subjectPerformance,
        topStudents: topStudents.map((s) => ({
          name: s.name,
          avg: s.avg,
          class: s.cls?.name,
        })),
        totalStudents: students.length,
      };

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [
            {
              role: "user",
              content: `You are an academic analytics AI for ${state.institution.name}. Analyze this data and provide 3-4 specific, actionable insights in plain text (no markdown, just clear sentences). Focus on performance gaps, strengths, and recommendations. Data: ${JSON.stringify(context)}`,
            },
          ],
        }),
      });
      const data = await resp.json();
      setAiInsight(
        data.content?.[0]?.text || "Could not generate insights at this time."
      );
    } catch (e) {
      setAiInsight(
        "AI insights unavailable. Ensure API key is configured in the environment."
      );
    }
    setLoadingAI(false);
  };

  return (
    <div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            Class Performance Overview
          </div>
          {classPerformance.map((cls) => (
            <div key={cls.id} className="analysis-bar">
              <span
                className="analysis-bar-label"
                style={{ fontSize: 12, minWidth: 60 }}
              >
                {cls.name}
              </span>
              <div className="analysis-bar-track">
                <div
                  className="analysis-bar-fill"
                  style={{
                    width: `${Math.min(cls.avg, 100)}%`,
                    background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.indigo})`,
                  }}
                />
              </div>
              <span
                className="analysis-bar-value"
                style={{ color: COLORS.blueLight }}
              >
                {cls.avg}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            Top 5 Students
          </div>
          {topStudents.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                borderBottom:
                  i < 4 ? "1px solid var(--border)" : "none",
              }}
            >
              <span
                className={`position-badge ${i === 0 ? "pos-1" : i === 1 ? "pos-2" : i === 2 ? "pos-3" : "pos-other"}`}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary }}>
                  {s.cls?.name}
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: COLORS.gold }}>
                {s.avg}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div className="section-title">Subject Pass/Fail Rates</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Students Scored</th>
                <th>Avg Score</th>
                <th>Pass Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjectPerformance.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>
                    <span className="badge badge-blue">{s.code}</span>
                  </td>
                  <td>{s.total}</td>
                  <td>{s.avg}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 80, height: 6, background: "var(--border)", borderRadius: 3 }}>
                        <div
                          style={{
                            width: `${s.passRate}%`,
                            height: "100%",
                            background: s.passRate >= 70 ? COLORS.emerald : s.passRate >= 50 ? COLORS.gold : COLORS.rose,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.passRate}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        s.passRate >= 70
                          ? "badge badge-green"
                          : s.passRate >= 50
                            ? "badge badge-gold"
                            : "badge badge-red"
                      }
                    >
                      {s.passRate >= 70 ? "Good" : s.passRate >= 50 ? "Average" : "Needs Attention"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">🤖 AI-Powered Performance Insights</div>
            <div className="section-sub">Powered by Claude AI</div>
          </div>
          <button
            className="btn btn-primary"
            onClick={getAIInsights}
            disabled={loadingAI}
          >
            {loadingAI ? <div className="spinner" /> : <Icon name="ai" size={16} />}
            {loadingAI ? "Analyzing..." : "Generate Insights"}
          </button>
        </div>

        {aiInsight && (
          <div className="ai-insight">
            <div className="ai-insight-icon">
              <Icon name="ai" size={18} color="white" />
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textPrimary }}>
              {aiInsight}
            </div>
          </div>
        )}

        {!aiInsight && !loadingAI && (
          <div className="empty-state">
            <div className="empty-state-icon">🤖</div>
            <div className="empty-state-text">Click "Generate Insights" to get AI analysis</div>
            <div style={{ fontSize: 13 }}>Identifies patterns, strengths, and areas for improvement</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ANNOUNCEMENTS PAGE ───────────────────────────────────────────────────────
function AnnouncementsPage({ state, updateState, currentUser, showNotification }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", targetClass: "all" });

  const canPost = currentUser.role === "admin" || currentUser.role === "teacher";

  const visibleAnn = state.announcements.filter((a) => {
    if (currentUser.role === "admin") return true;
    if (currentUser.role === "teacher") return true;
    if (a.targetClass === "all") return true;
    if (currentUser.classId && a.targetClass === currentUser.classId) return true;
    return false;
  });

  const postAnnouncement = () => {
    if (!form.title || !form.content) {
      showNotification("Please fill all fields", "error");
      return;
    }
    const newAnn = {
      id: generateId(),
      ...form,
      author: currentUser.name,
      date: new Date().toISOString().split("T")[0],
      role: currentUser.role,
    };
    updateState({ announcements: [newAnn, ...state.announcements] });
    setForm({ title: "", content: "", targetClass: "all" });
    setShowForm(false);
    showNotification("Announcement posted!");
  };

  const deleteAnn = (id) => {
    updateState({ announcements: state.announcements.filter((a) => a.id !== id) });
    showNotification("Announcement deleted.");
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Announcements</div>
          <div className="section-sub">{visibleAnn.length} announcements</div>
        </div>
        {canPost && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Icon name="plus" size={16} />
            {showForm ? "Cancel" : "New Announcement"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="modal-title" style={{ marginBottom: 16 }}>
            New Announcement
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-input"
                value={form.targetClass}
                onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
              >
                <option value="all">Entire School</option>
                {state.classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-input"
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your announcement..."
            />
          </div>
          <button className="btn btn-primary" onClick={postAnnouncement}>
            <Icon name="bell" size={16} /> Post Announcement
          </button>
        </div>
      )}

      {visibleAnn.map((a) => (
        <div
          key={a.id}
          className={`announcement-card ${a.role === "admin" ? "admin-ann" : ""}`}
          style={{ marginBottom: 12 }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                {a.title}
              </div>
              <div style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                {a.content}
              </div>
              <div
                style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}
              >
                <span className="badge badge-blue">{a.author}</span>
                <span className="badge badge-gray">{a.date}</span>
                <span className="badge badge-gold">
                  {a.targetClass === "all"
                    ? "All School"
                    : state.classes.find((c) => c.id === a.targetClass)?.name || a.targetClass}
                </span>
              </div>
            </div>
            {(currentUser.role === "admin" || a.author === currentUser.name) && (
              <button
                className="btn btn-danger btn-sm btn-icon"
                onClick={() => deleteAnn(a.id)}
              >
                <Icon name="trash" size={14} />
              </button>
            )}
          </div>
        </div>
      ))}

      {visibleAnn.length === 0 && (
        <div className="empty-state card">
          <div className="empty-state-icon">📢</div>
          <div className="empty-state-text">No announcements yet</div>
        </div>
      )}
    </div>
  );
}

// ─── STUDENTS PAGE ────────────────────────────────────────────────────────────
function StudentsPage({ state, updateState, currentUser, showNotification }) {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", studentId: "", classId: "", password: "student123", avatar: null,
  });
  const fileInputRef    = useRef(null);
  const bulkImportRef   = useRef(null);

  // Bulk import state
  const [bulkRows,    setBulkRows]    = useState([]);
  const [bulkErrors,  setBulkErrors]  = useState([]);
  const [bulkDone,    setBulkDone]    = useState(false);
  const [showBulk,    setShowBulk]    = useState(false);

  const students = state.users
    .filter((u) => u.role === "student")
    .filter((u) =>
      (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.studentId?.includes(search)) &&
      (!filterClass || u.classId === filterClass)
    );

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((prev) => ({ ...prev, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ── Bulk Import Logic ─────────────────────────────────────
  const parseBulkCSV = (text) => {
    const allLines = text.trim().split(/\r?\n/);
    const lines = allLines.filter(l => l.trim() && !l.trim().startsWith("#"));
    if (lines.length < 2) return { rows: [], errors: ["File is empty or has no data rows."] };

    const headers = lines[0]
      .replace(/^\uFEFF/, "")
      .split(",")
      .map(h => h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""));

    const errors = [];

    const colIdx = {
      name:    headers.findIndex(h => ["name","fullname","studentname","student"].includes(h)),
      studentId: headers.findIndex(h => ["regno","regnum","studentid","id","reg","admno"].includes(h)),
      class:   headers.findIndex(h => ["class","classname","className","form","grade"].includes(h)),
      email:   headers.findIndex(h => ["email","emailaddress","mail"].includes(h)),
      password:headers.findIndex(h => ["password","pass","pwd"].includes(h)),
    };

    if (colIdx.name === -1) {
      errors.push("Required column 'Name' not found. Make sure your CSV has a Name column.");
      return { rows: [], errors };
    }
    if (colIdx.class === -1) errors.push("No 'Class' column found — students will have no class assigned.");

    const existingEmails = new Set(state.users.map(u => u.email.toLowerCase()));
    const existingIds    = new Set(state.users.filter(u => u.role === "student").map(u => (u.studentId || "").toLowerCase()));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse quoted CSV fields
      const cols = [];
      let cur = "", inQuote = false;
      for (let ci = 0; ci < line.length; ci++) {
        const ch = line[ci];
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur.trim());

      const rawName     = (colIdx.name      >= 0 ? cols[colIdx.name]      : "").replace(/^"|"$/g,"").trim();
      const rawStudentId= (colIdx.studentId >= 0 ? cols[colIdx.studentId] : "").replace(/^"|"$/g,"").trim();
      const rawClass    = (colIdx.class     >= 0 ? cols[colIdx.class]     : "").replace(/^"|"$/g,"").trim();
      const rawEmail    = (colIdx.email     >= 0 ? cols[colIdx.email]     : "").replace(/^"|"$/g,"").trim();
      const rawPassword = (colIdx.password  >= 0 ? cols[colIdx.password]  : "").replace(/^"|"$/g,"").trim();

      if (!rawName) continue;

      // Match class by name (case-insensitive partial match)
      const matchedClass = rawClass
        ? state.classes.find(c =>
            c.name.toLowerCase() === rawClass.toLowerCase() ||
            c.name.toLowerCase().includes(rawClass.toLowerCase()) ||
            rawClass.toLowerCase().includes(c.name.toLowerCase())
          )
        : null;

      // Generate email if not provided
      const genEmail = rawEmail ||
        `${rawName.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "")}${Math.floor(Math.random()*900)+100}@student.school`;

      // Check for duplicates
      const dupEmail = existingEmails.has(genEmail.toLowerCase());
      const dupId    = rawStudentId && existingIds.has(rawStudentId.toLowerCase());

      rows.push({
        rowNum: i + 1,
        name:      rawName,
        studentId: rawStudentId,
        classRaw:  rawClass,
        classId:   matchedClass?.id || null,
        className: matchedClass?.name || (rawClass ? `"${rawClass}" not found` : "No class"),
        email:     genEmail,
        password:  rawPassword || "student123",
        dupEmail,
        dupId,
        valid:     !!rawName && !dupEmail && !dupId,
        classFound: !!matchedClass || !rawClass,
      });
    }

    const invalid = rows.filter(r => !r.valid).length;
    const noClass = rows.filter(r => rawClass => !r.classFound).length;
    if (invalid > 0) errors.push(`${invalid} row(s) have issues (duplicate email or ID) and will be skipped.`);

    return { rows, errors };
  };

  const processBulkFile = (file) => {
    if (!file) return;
    setBulkRows([]); setBulkErrors([]); setBulkDone(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { rows, errors } = parseBulkCSV(ev.target.result);
      setBulkRows(rows);
      setBulkErrors(errors);
    };
    reader.onerror = () => setBulkErrors(["Could not read file. Please try again."]);
    reader.readAsText(file);
  };

  const confirmBulkImport = () => {
    const valid = bulkRows.filter(r => r.valid);
    if (valid.length === 0) { showNotification("No valid students to import.", "error"); return; }

    const newUsers  = [...state.users];
    const newAudit  = [...state.auditTrail];
    valid.forEach(row => {
      newUsers.push({
        id:        generateId(),
        role:      "student",
        name:      row.name,
        email:     row.email,
        password:  row.password,
        studentId: row.studentId || `STD${String(newUsers.filter(u=>u.role==="student").length+1).padStart(3,"0")}`,
        classId:   row.classId || null,
        avatar:    null,
      });
    });
    newAudit.unshift({
      id: generateId(), userId: currentUser.id, userName: currentUser.name,
      action: "Bulk Student Import",
      details: `Imported ${valid.length} students via CSV`,
      timestamp: new Date().toISOString(),
    });
    updateState({ users: newUsers, auditTrail: newAudit });
    setBulkDone(true);
    setBulkRows([]);
    showNotification(`✅ ${valid.length} students imported successfully!`);
  };

  const downloadStudentTemplate = () => {
    const csv = [
      "Name,RegNo,Class,Email,Password",
      "Chioma Eze,STD001,JSS 1,chioma@school.com,student123",
      "Emeka Obi,STD002,JSS 1,emeka@school.com,student123",
      "Fatima Bello,STD003,SSS 1,fatima@school.com,student123",
    ].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "sarms-students-template.csv";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showNotification("Template downloaded! Fill it in Excel and upload.");
  };

  const saveStudent = () => {
    if (!form.name || !form.email || !form.studentId || !form.classId) {
      showNotification("Fill all required fields", "error");
      return;
    }
    if (modal === "add") {
      const newStudent = {
        id: generateId(),
        role: "student",
        pin: `PIN${Date.now().toString().slice(-3)}`,
        pinUsed: 0,
        ...form,
      };
      updateState({
        users: [...state.users, newStudent],
        pinCodes: [
          ...state.pinCodes,
          { code: newStudent.pin, studentId: newStudent.id, usedCount: 0 },
        ],
        auditTrail: [
          {
            id: generateId(),
            userId: currentUser.id,
            userName: currentUser.name,
            action: "Student Added",
            details: `Added ${form.name} (${form.studentId})`,
            timestamp: new Date().toISOString(),
          },
          ...state.auditTrail,
        ],
      });
      showNotification("Student added successfully!");
    } else if (modal?.type === "edit") {
      updateState({
        users: state.users.map((u) => (u.id === modal.id ? { ...u, ...form } : u)),
      });
      showNotification("Student updated!");
    }
    setModal(null);
    setForm({ name: "", email: "", studentId: "", classId: "", password: "student123", avatar: null });
  };

  const deleteStudent = (id) => {
    updateState({ users: state.users.filter((u) => u.id !== id) });
    showNotification("Student removed.");
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Students</div>
          <div className="section-sub">{students.length} students found</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => { setShowBulk(!showBulk); setBulkRows([]); setBulkErrors([]); setBulkDone(false); }}>
            <Icon name="upload" size={16} /> Bulk Import
          </button>
          <button className="btn btn-primary" onClick={() => setModal("add")}>
            <Icon name="plus" size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* ── BULK IMPORT PANEL ── */}
      {showBulk && (
        <div className="card" style={{ marginBottom: 20, border: "1px solid rgba(37,99,235,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: COLORS.blueLight }}>
              📂 Bulk Student Import
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => { setShowBulk(false); setBulkRows([]); setBulkErrors([]); setBulkDone(false); }}>
              ✕ Close
            </button>
          </div>

          {/* Instructions */}
          {!bulkRows.length && !bulkDone && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 12 }}>
                Import many students at once from a CSV file (Excel or Google Sheets).
                The CSV must have at minimum a <strong style={{ color: COLORS.textPrimary }}>Name</strong> column.
                Optional columns: <strong style={{ color: COLORS.textPrimary }}>RegNo, Class, Email, Password</strong>.
              </div>
              <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 8, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Expected CSV Format
                </div>
                <code style={{ fontSize: 12, color: COLORS.blueLight, lineHeight: 1.9 }}>
                  Name,RegNo,Class,Email,Password<br/>
                  Chioma Eze,STD001,JSS 1,chioma@school.com,student123<br/>
                  Emeka Obi,STD002,JSS 1,,
                </code>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button className="btn btn-secondary btn-sm" onClick={downloadStudentTemplate}>
                  <Icon name="download" size={14} /> Download Template
                </button>
              </div>

              {/* Drop zone */}
              <div
                style={{ border: `2px dashed ${COLORS.blue}`, borderRadius: 12, padding: "28px 20px",
                          textAlign: "center", cursor: "pointer", background: "rgba(37,99,235,0.05)" }}
                onClick={() => bulkImportRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); processBulkFile(e.dataTransfer.files?.[0]); }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Click to upload or drag & drop</div>
                <div style={{ fontSize: 13, color: COLORS.textSecondary }}>CSV files only (.csv)</div>
                <div style={{ marginTop: 10 }}>
                  <span className="btn btn-primary btn-sm">Browse File</span>
                </div>
              </div>
              <input type="file" ref={bulkImportRef} accept=".csv,text/csv" style={{ display: "none" }}
                onChange={(e) => { processBulkFile(e.target.files?.[0]); setTimeout(() => { if(bulkImportRef.current) bulkImportRef.current.value=""; }, 100); }} />
            </div>
          )}

          {/* Warnings */}
          {bulkErrors.length > 0 && (
            <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8 }}>
              {bulkErrors.map((e, i) => <div key={i} style={{ fontSize: 13, color: COLORS.gold }}>⚠️ {e}</div>)}
            </div>
          )}

          {/* Preview table */}
          {bulkRows.length > 0 && (
            <div>
              <div className="section-header" style={{ marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    Preview — {bulkRows.filter(r => r.valid).length} of {bulkRows.length} students ready to import
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
                    Only ✅ Valid rows will be imported. ❌ rows are skipped.
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setBulkRows([]); setBulkErrors([]); }}>
                    ← Upload Different File
                  </button>
                  <button className="btn btn-primary" onClick={confirmBulkImport}
                    disabled={bulkRows.filter(r => r.valid).length === 0}>
                    <Icon name="check" size={16} /> Import {bulkRows.filter(r => r.valid).length} Students
                  </button>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Name</th>
                      <th>Reg No</th>
                      <th>Class</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((row, i) => (
                      <tr key={i} style={{ opacity: row.valid ? 1 : 0.55 }}>
                        <td>
                          {row.valid
                            ? <span className="badge badge-green" style={{ fontSize: 11 }}>✅ Valid</span>
                            : <span className="badge badge-red" style={{ fontSize: 11 }}>❌ Skip</span>
                          }
                        </td>
                        <td style={{ fontWeight: 600 }}>{row.name}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{row.studentId || <span style={{ color: COLORS.textMuted }}>auto</span>}</td>
                        <td>
                          {row.classId
                            ? <span className="badge badge-blue" style={{ fontSize: 11 }}>{row.className}</span>
                            : <span style={{ color: row.classRaw ? COLORS.rose : COLORS.textMuted, fontSize: 12 }}>
                                {row.classRaw ? `"${row.classRaw}" not found` : "None"}
                              </span>
                          }
                        </td>
                        <td style={{ fontSize: 12, color: COLORS.textSecondary }}>{row.email}</td>
                        <td style={{ fontSize: 12, color: COLORS.textMuted }}>{row.password}</td>
                        <td style={{ fontSize: 12, color: COLORS.rose }}>
                          {row.dupEmail && "Email already exists. "}
                          {row.dupId    && "Reg No already exists. "}
                          {!row.dupEmail && !row.dupId && row.valid && "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success */}
          {bulkDone && (
            <div style={{ textAlign: "center", padding: "28px 20px", border: "1px solid rgba(16,185,129,0.3)",
                          background: "rgba(16,185,129,0.08)", borderRadius: 12 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: COLORS.emerald, marginBottom: 6 }}>
                Import Successful!
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 14 }}>
                Students have been added. You can now assign them to classes and enter their scores.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setBulkDone(false); setShowBulk(false); }}>
                  Done
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setBulkDone(false); setBulkRows([]); setBulkErrors([]); }}>
                  Import More
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Icon name="search" size={16} color={COLORS.textMuted} />
          <input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          style={{ width: 160 }}
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {state.classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>PIN</th>
                <th>PIN Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const cls = state.classes.find((c) => c.id === s.classId);
                const pinRec = state.pinCodes.find((p) => p.studentId === s.id);
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: s.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "hidden", flexShrink: 0,
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
                      }}>
                        {s.avatar
                          ? <img src={s.avatar} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : s.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                        }
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{s.studentId}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{cls?.name || "—"}</td>
                    <td style={{ color: COLORS.textSecondary }}>{s.email}</td>
                    <td><span className="badge badge-gold">{s.pin}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[0, 1, 2].map((i) => (
                          <div key={i} style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: i < (pinRec?.usedCount || 0) ? COLORS.rose : COLORS.border,
                          }} />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm btn-icon"
                          onClick={() => {
                            setForm({
                              name: s.name,
                              email: s.email,
                              studentId: s.studentId,
                              classId: s.classId,
                              password: s.password,
                              avatar: s.avatar || null,
                            });
                            setModal({ type: "edit", id: s.id });
                          }}
                        >
                          <Icon name="edit" size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteStudent(s.id)}>
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-text">No students found</div>
            </div>
          )}
        </div>
      </div>

      {(modal === "add" || modal?.type === "edit") && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {modal === "add" ? "Add New Student" : "Edit Student"}
              </div>
              <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setModal(null)}>
                <Icon name="close" size={16} />
              </button>
            </div>

            {/* Avatar Upload */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: form.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0, border: "2px solid var(--border)",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
              }}>
                {form.avatar
                  ? <img src={form.avatar} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (form.name ? form.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "?")
                }
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Profile Photo</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 }}>Upload a passport-style photo (JPG, PNG)</div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
                    <Icon name="upload" size={14} /> Upload Photo
                  </button>
                  {form.avatar && (
                    <button className="btn btn-danger btn-sm" onClick={() => setForm((p) => ({ ...p, avatar: null }))}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Student ID *</label>
                <input className="form-input" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Class *</label>
                <select className="form-input" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                  <option value="">— Select —</option>
                  {state.classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveStudent}>
                <Icon name="check" size={16} /> {modal === "add" ? "Add Student" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TEACHERS PAGE ────────────────────────────────────────────────────────────
function TeachersPage({ state, updateState, currentUser, showNotification }) {
  const [tab, setTab]       = useState("teachers");
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState({
    name: "", email: "", subjects: [], classes: [], password: "teacher123",
  });
  const [bursarModal, setBursarModal] = useState(null);
  const [bursarForm, setBursarForm]   = useState({
    name: "", email: "", password: "bursar123",
  });

  const teachers = state.users.filter((u) => u.role === "teacher");
  const bursars  = state.users.filter((u) => u.role === "bursar");

  const saveTeacher = () => {
    if (!form.name || !form.email) { showNotification("Fill required fields", "error"); return; }
    if (modal === "add") {
      updateState({ users: [...state.users, { id: generateId(), role: "teacher", ...form }] });
      showNotification("Teacher added!");
    } else if (modal?.type === "edit") {
      updateState({ users: state.users.map((u) => (u.id === modal.id ? { ...u, ...form } : u)) });
      showNotification("Teacher updated!");
    }
    setModal(null);
    setForm({ name: "", email: "", subjects: [], classes: [], password: "teacher123" });
  };

  const saveBursar = () => {
    const role = (bursarModal === "add-principal" || bursarModal?.type === "edit-principal") ? "principal" : "bursar";
    if (!bursarForm.name || !bursarForm.email) { showNotification("Fill name and email", "error"); return; }
    const exists = state.users.find(u => u.email.toLowerCase() === bursarForm.email.toLowerCase());
    if (exists && (bursarModal === "add" || bursarModal === "add-principal")) { showNotification("Email already exists", "error"); return; }
    if (bursarModal === "add" || bursarModal === "add-principal") {
      updateState({ users: [...state.users, { id: generateId(), role, avatar: null, ...bursarForm }] });
      showNotification(`${role.charAt(0).toUpperCase()+role.slice(1)} account created!`);
    } else {
      updateState({ users: state.users.map(u => u.id === (bursarModal?.id) ? { ...u, ...bursarForm } : u) });
      showNotification("Account updated!");
    }
    setBursarModal(null);
    setBursarForm({ name: "", email: "", password: "bursar123" });
  };

  const deleteUser = (id, role) => {
    if (!window.confirm(`Delete this ${role}? This cannot be undone.`)) return;
    updateState({ users: state.users.filter(u => u.id !== id) });
    showNotification(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted.`);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Staff Management</div>
          <div className="section-sub">{teachers.length} teachers · {bursars.length} bursars</div>
        </div>
        <button className="btn btn-primary" onClick={() => tab === "bursars" ? setBursarModal("add") : tab === "principals" ? setBursarModal("add-principal") : setModal("add")}>
          <Icon name="plus" size={16} /> Add {tab === "bursars" ? "Bursar" : tab === "principals" ? "Principal" : "Teacher"}
        </button>
      </div>

      <div className="tabs">
        <div className={`tab ${tab === "teachers" ? "active" : ""}`} onClick={() => setTab("teachers")}>
          👨‍🏫 Teachers ({teachers.length})
        </div>
        <div className={`tab ${tab === "bursars" ? "active" : ""}`} onClick={() => setTab("bursars")}>
          💳 Bursars ({bursars.length})
        </div>
        <div className={`tab ${tab === "principals" ? "active" : ""}`} onClick={() => setTab("principals")}>
          🎓 Principals ({state.users.filter(u=>u.role==="principal").length})
        </div>
      </div>

      {/* ── TEACHERS TAB ── */}
      {tab === "teachers" && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subjects</th>
                  <th>Classes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.name}</td>
                    <td style={{ color: COLORS.textSecondary }}>{t.email}</td>
                    <td>
                      {(t.subjects || []).map((sid) => {
                        const sub = state.subjects.find((s) => s.id === sid);
                        return sub ? (
                          <span key={sid} className="badge badge-blue" style={{ marginRight: 4 }}>
                            {sub.code}
                        </span>
                      ) : null;
                    })}
                  </td>
                  <td>
                    {(t.classes || []).map((cid) => {
                      const cls = state.classes.find((c) => c.id === cid);
                      return cls ? (
                        <span key={cid} className="badge badge-green" style={{ marginRight: 4 }}>
                          {cls.name}
                        </span>
                      ) : null;
                    })}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm btn-icon"
                        onClick={() => {
                          setForm({
                            name: t.name,
                            email: t.email,
                            subjects: t.subjects || [],
                            classes: t.classes || [],
                            password: t.password,
                          });
                          setModal({ type: "edit", id: t.id });
                        }}
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() =>
                          updateState({ users: state.users.filter((u) => u.id !== t.id) })
                        }
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {(modal === "add" || modal?.type === "edit") && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {modal === "add" ? "Add Teacher" : "Edit Teacher"}
              </div>
              <button
                className="btn btn-secondary btn-sm btn-icon"
                onClick={() => setModal(null)}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subjects (hold Ctrl for multi-select)</label>
              <select
                className="form-input"
                multiple
                size={4}
                value={form.subjects}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subjects: Array.from(e.target.selectedOptions).map((o) => o.value),
                  })
                }
              >
                {state.subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Classes</label>
              <select
                className="form-input"
                multiple
                size={4}
                value={form.classes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    classes: Array.from(e.target.selectedOptions).map((o) => o.value),
                  })
                }
              >
                {state.classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveTeacher}>
                <Icon name="check" size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BURSARS TAB ── */}
      {tab === "bursars" && (
        <div>
          {bursars.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">💳</div>
                <div className="empty-state-text">No bursar accounts yet</div>
                <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 }}>
                  Create a bursar account so the school bursar can log in and manage payments independently.
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setBursarModal("add")}>
                  <Icon name="plus" size={14} /> Create Bursar Account
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bursars.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                              background: "linear-gradient(135deg,var(--emerald),var(--blue))",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 700,
                            }}>
                              {b.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{b.name}</div>
                              <span className="badge badge-green" style={{ fontSize: 10 }}>Bursar</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>{b.email}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.textMuted }}>{b.password}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => {
                              setBursarForm({ name: b.name, email: b.email, password: b.password });
                              setBursarModal({ type: "edit", id: b.id });
                            }}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteUser(b.id, "bursar")}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="card" style={{ marginTop: 16, background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: COLORS.blueLight }}>💡 About Bursar Accounts</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7 }}>
              A bursar logs in with their own email and password. They have access to:<br/>
              ✅ Payment Dashboard — view all collections<br/>
              ✅ Record new student payments<br/>
              ✅ Confirm payments and print receipts<br/>
              ❌ Cannot access scores, results, or settings
            </div>
          </div>
        </div>
      )}

      {/* ── PRINCIPALS TAB ── */}
      {tab === "principals" && (
        <div>
          {state.users.filter(u => u.role === "principal").length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🎓</div>
                <div className="empty-state-text">No principal account yet</div>
                <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, textAlign: "center" }}>
                  Create a principal account so the principal can monitor staff attendance and view school analytics.
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setBursarModal("add-principal")}>
                  <Icon name="plus" size={14} /> Create Principal Account
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Password</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {state.users.filter(u => u.role === "principal").map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                              background: "linear-gradient(135deg,#7c3aed,#2563EB)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 700, color: "white" }}>
                              {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.name}</div>
                              <span className="badge" style={{ fontSize: 10, background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>Principal</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>{p.email}</td>
                        <td style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.textMuted }}>{p.password}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => {
                              setBursarForm({ name: p.name, email: p.email, password: p.password });
                              setBursarModal({ type: "edit-principal", id: p.id });
                            }}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteUser(p.id, "principal")}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="card" style={{ marginTop: 16, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: "#a78bfa" }}>🎓 About Principal Account</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7 }}>
              The principal has their own login and can:<br/>
              ✅ Monitor daily staff attendance — mark Present, Late, Absent<br/>
              ✅ View 7-day attendance trend dashboard<br/>
              ✅ View staff attendance report with percentages<br/>
              ✅ View school analytics and broadsheet<br/>
              ✅ View student and teacher lists<br/>
              ✅ Post announcements<br/>
              ❌ Cannot edit scores, manage payments, or change system settings
            </div>
          </div>
        </div>
      )}

      {/* Bursar / Principal Modal */}
      {bursarModal && (
        <div className="modal-overlay" onClick={() => setBursarModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div className="modal-title">
                {(bursarModal === "add" || bursarModal?.type === "edit") ? "Bursar Account" : "Principal Account"}
                {" — "}
                {(bursarModal === "add" || bursarModal === "add-principal") ? "Create" : "Edit"}
              </div>
              <button className="modal-close" onClick={() => setBursarModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: "10px 14px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, fontSize: 12, color: COLORS.blueLight, marginBottom: 16 }}>
                🔑 The bursar uses this email and password to log in at the school portal login page.
              </div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="e.g. Mrs. Adaeze Okafor"
                  value={bursarForm.name} onChange={e => setBursarForm({...bursarForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="bursar@school.com"
                  value={bursarForm.email} onChange={e => setBursarForm({...bursarForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" placeholder="Minimum 6 characters"
                  value={bursarForm.password} onChange={e => setBursarForm({...bursarForm, password: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setBursarModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveBursar}>
                <Icon name="check" size={16} /> {bursarModal === "add" ? "Create Account" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLASSES PAGE ─────────────────────────────────────────────────────────────
function ClassesPage({ state, updateState, currentUser, showNotification }) {
  const [activeTab, setActiveTab] = useState("classes");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", level: "Junior" });
  const [subForm, setSubForm] = useState({ name: "", code: "" });

  const saveClass = () => {
    if (!form.name) return;
    if (modal === "addClass") {
      updateState({ classes: [...state.classes, { id: generateId(), ...form }] });
    } else if (modal?.type === "editClass") {
      updateState({ classes: state.classes.map((c) => (c.id === modal.id ? { ...c, ...form } : c)) });
    }
    setModal(null);
    showNotification("Saved!");
  };

  const saveSubject = () => {
    if (!subForm.name || !subForm.code) return;
    if (modal === "addSub") {
      updateState({ subjects: [...state.subjects, { id: generateId(), ...subForm }] });
    } else if (modal?.type === "editSub") {
      updateState({ subjects: state.subjects.map((s) => (s.id === modal.id ? { ...s, ...subForm } : s)) });
    }
    setModal(null);
    showNotification("Saved!");
  };

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${activeTab === "classes" ? "active" : ""}`} onClick={() => setActiveTab("classes")}>Classes ({state.classes.length})</div>
        <div className={`tab ${activeTab === "subjects" ? "active" : ""}`} onClick={() => setActiveTab("subjects")}>Subjects ({state.subjects.length})</div>
      </div>

      {activeTab === "classes" && (
        <>
          <div className="section-header">
            <div className="section-title">Class Management</div>
            <button className="btn btn-primary" onClick={() => { setForm({ name: "", level: "Junior" }); setModal("addClass"); }}>
              <Icon name="plus" size={16} /> Add Class
            </button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Class Name</th><th>Level</th><th>Students</th><th>Actions</th></tr></thead>
                <tbody>
                  {state.classes.map((c) => {
                    const count = state.users.filter((u) => u.role === "student" && u.classId === c.id).length;
                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td><span className={`badge ${c.level === "Senior" ? "badge-gold" : "badge-blue"}`}>{c.level}</span></td>
                        <td>{count}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setForm({ name: c.name, level: c.level }); setModal({ type: "editClass", id: c.id }); }}><Icon name="edit" size={14} /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => updateState({ classes: state.classes.filter((x) => x.id !== c.id) })}><Icon name="trash" size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "subjects" && (
        <>
          <div className="section-header">
            <div className="section-title">Subject Management</div>
            <button className="btn btn-primary" onClick={() => { setSubForm({ name: "", code: "" }); setModal("addSub"); }}>
              <Icon name="plus" size={16} /> Add Subject
            </button>
          </div>
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Subject Name</th><th>Code</th><th>Actions</th></tr></thead>
                <tbody>
                  {state.subjects.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500 }}>{s.name}</td>
                      <td><span className="badge badge-blue">{s.code}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-secondary btn-sm btn-icon" onClick={() => { setSubForm({ name: s.name, code: s.code }); setModal({ type: "editSub", id: s.id }); }}><Icon name="edit" size={14} /></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => updateState({ subjects: state.subjects.filter((x) => x.id !== s.id) })}><Icon name="trash" size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Class Modal */}
      {(modal === "addClass" || modal?.type === "editClass") && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === "addClass" ? "Add Class" : "Edit Class"}</div>
              <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setModal(null)}><Icon name="close" size={16} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Class Name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. JSS 3" />
            </div>
            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option>Junior</option><option>Senior</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveClass}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {(modal === "addSub" || modal?.type === "editSub") && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal === "addSub" ? "Add Subject" : "Edit Subject"}</div>
              <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setModal(null)}><Icon name="close" size={16} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Subject Name</label>
              <input className="form-input" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} placeholder="e.g. Mathematics" />
            </div>
            <div className="form-group">
              <label className="form-label">Code</label>
              <input className="form-input" value={subForm.code} onChange={(e) => setSubForm({ ...subForm, code: e.target.value })} placeholder="e.g. MTH" />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveSubject}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCORE ENTRY PAGE ─────────────────────────────────────────────────────────
function ScoreEntryPage({ state, updateState, currentUser, showNotification }) {
  const [activeTab, setActiveTab] = useState("scores");
  const [selectedClass, setSelectedClass] = useState(currentUser.classes?.[0] || "");
  const [selectedSubject, setSelectedSubject] = useState(currentUser.subjects?.[0] || "");
  const [selectedTerm, setSelectedTerm] = useState(state.currentTerm);
  const [localScores, setLocalScores] = useState({});
  const [comments, setComments] = useState({});
  const [aiLoading, setAiLoading] = useState(null);
  const [charLocal, setCharLocal] = useState({});

  // CSV Import state
  const [importClass, setImportClass]     = useState(currentUser.classes?.[0] || "");
  const [importSubject, setImportSubject] = useState(currentUser.subjects?.[0] || "");
  const [importTerm, setImportTerm]       = useState(state.currentTerm);
  const [importRows, setImportRows]       = useState([]); // parsed preview rows
  const [importErrors, setImportErrors]   = useState([]);
  const [importDone, setImportDone]       = useState(false);
  const fileInputRef = useRef(null);

  const TRAITS = state.characterTraits || ["Punctuality","Neatness","Attentiveness","Cooperation","Honesty","Respect","Diligence"];
  const RATINGS = ["Excellent","Very Good","Good","Fair","Poor"];

  const myClasses  = state.classes.filter((c) => (currentUser.classes  || []).includes(c.id));
  const mySubjects = state.subjects.filter((s) => (currentUser.subjects || []).includes(s.id));
  const classStudents = state.users.filter((u) => u.role === "student" && u.classId === selectedClass);

  const getExistingScore = (studentId) =>
    state.scores.find((s) =>
      s.studentId === studentId && s.subjectId === selectedSubject &&
      s.classId === selectedClass && s.session === state.currentSession && s.term === selectedTerm
    );

  useEffect(() => {
    const newLocal = {}; const newComments = {};
    classStudents.forEach((st) => {
      const existing = getExistingScore(st.id);
      newLocal[st.id]    = existing ? { ca: existing.ca, exam: existing.exam } : { ca: "", exam: "" };
      newComments[st.id] = existing?.comment || "";
    });
    setLocalScores(newLocal); setComments(newComments);
  }, [selectedClass, selectedSubject, selectedTerm]);

  useEffect(() => {
    const charReports = state.characterReports || {};
    const loaded = {};
    classStudents.forEach((st) => {
      const key = `${st.id}_${state.currentSession}_${selectedTerm}`;
      loaded[st.id] = charReports[key] || {};
    });
    setCharLocal(loaded);
  }, [selectedClass, selectedTerm]);

  const saveScores = () => {
    const newScores = [...state.scores]; const newAudit = [...state.auditTrail];
    classStudents.forEach((st) => {
      const score = localScores[st.id];
      if (!score || (score.ca === "" && score.exam === "")) return;
      const existing = newScores.findIndex((s) =>
        s.studentId === st.id && s.subjectId === selectedSubject &&
        s.classId === selectedClass && s.session === state.currentSession && s.term === selectedTerm
      );
      const scoreObj = {
        id: existing >= 0 ? newScores[existing].id : generateId(),
        studentId: st.id, subjectId: selectedSubject, classId: selectedClass,
        session: state.currentSession, term: selectedTerm,
        ca: Number(score.ca) || 0, exam: Number(score.exam) || 0,
        comment: comments[st.id] || "", locked: false, enteredBy: currentUser.id,
      };
      if (existing >= 0) newScores[existing] = scoreObj; else newScores.push(scoreObj);
      newAudit.unshift({ id: generateId(), userId: currentUser.id, userName: currentUser.name,
        action: "Score Entry", details: `Entered scores for ${st.name} — ${state.subjects.find((s) => s.id === selectedSubject)?.name}`,
        timestamp: new Date().toISOString() });
    });
    updateState({ scores: newScores, auditTrail: newAudit });
    showNotification("Scores saved successfully!");
  };

  const saveCharacterReports = () => {
    const existing = state.characterReports || {};
    const updated = { ...existing };
    classStudents.forEach((st) => {
      const key = `${st.id}_${state.currentSession}_${selectedTerm}`;
      updated[key] = charLocal[st.id] || {};
    });
    updateState({ characterReports: updated });
    showNotification("Character reports saved!");
  };

  const getAIComment = async (student) => {
    setAiLoading(student.id);
    const score = localScores[student.id];
    const ca = Number(score?.ca) || 0; const exam = Number(score?.exam) || 0; const total = ca + exam;
    const sub = state.subjects.find((s) => s.id === selectedSubject);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 100,
          messages: [{ role: "user", content: `Write a brief (1-2 sentence) teacher comment for a student who scored ${ca}/40 in CA and ${exam}/60 in exam (total: ${total}/100) in ${sub?.name}. Be encouraging, specific, and professional. No quotation marks.` }] }),
      });
      const data = await resp.json();
      setComments((prev) => ({ ...prev, [student.id]: data.content?.[0]?.text || "" }));
    } catch { showNotification("AI comment generation failed", "error"); }
    setAiLoading(null);
  };

  const getAICharacterRemark = async (student) => {
    setAiLoading(`char_${student.id}`);
    const traits = charLocal[student.id] || {};
    const traitSummary = TRAITS.map(t => `${t}: ${traits[t] || "unrated"}`).join(", ");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 120,
          messages: [{ role: "user", content: `Write a brief (2 sentences max) character remark for a student with these trait ratings: ${traitSummary}. Be warm, professional, and encouraging. No quotation marks.` }] }),
      });
      const data = await resp.json();
      setCharLocal((prev) => ({ ...prev, [student.id]: { ...prev[student.id], _teacherRemark: data.content?.[0]?.text || "" } }));
    } catch { showNotification("AI remark generation failed", "error"); }
    setAiLoading(null);
  };

  // ── CSV / Excel Import ──────────────────────────────────────
  const parseCSV = (text) => {
    // Split into lines, skip blank lines and comment lines starting with #
    const allLines = text.trim().split(/\r?\n/);
    const lines = allLines.filter(l => l.trim() && !l.trim().startsWith("#"));

    if (lines.length < 2) return { rows: [], errors: ["File is empty or has no data rows after skipping comment lines."] };

    // Parse header — remove BOM, quotes, trim, lowercase, strip non-alphanumeric
    const headers = lines[0]
      .replace(/^\uFEFF/, "") // remove BOM (Excel adds this)
      .split(",")
      .map(h => h.trim().replace(/^"|"$/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""));

    const errors = [];
    const rows = [];

    // Flexible column matching
    const colIdx = {
      regNo:   headers.findIndex(h => ["regno","regnum","studentid","id","reg","registrationnumber","admno","admissionno"].includes(h)),
      name:    headers.findIndex(h => ["name","studentname","fullname","student"].includes(h)),
      ca:      headers.findIndex(h => ["ca","continuousassessment","assessment","test","ca40","firstca"].includes(h)),
      exam:    headers.findIndex(h => ["exam","examination","examscore","score","exam60","examscore"].includes(h)),
      comment: headers.findIndex(h => ["comment","remark","remarks","note","notes","teachercomment"].includes(h)),
    };

    if (colIdx.regNo === -1 && colIdx.name === -1) {
      errors.push("Cannot find a student identifier. Make sure your CSV has a column named 'RegNo' or 'Name'.");
      return { rows, errors };
    }
    if (colIdx.ca   === -1) errors.push("No 'CA' column found — CA scores will be 0. Add a column named 'CA'.");
    if (colIdx.exam === -1) errors.push("No 'Exam' column found — Exam scores will be 0. Add a column named 'Exam'.");

    const importStudents = state.users.filter(u => u.role === "student" && u.classId === importClass);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted fields with commas inside them
      const cols = [];
      let cur = "", inQuote = false;
      for (let ci = 0; ci < line.length; ci++) {
        const ch = line[ci];
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === "," && !inQuote) { cols.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
      cols.push(cur.trim());

      const rawReg     = (colIdx.regNo  >= 0 ? cols[colIdx.regNo]  : "").replace(/^"|"$/g,"").trim();
      const rawName    = (colIdx.name   >= 0 ? cols[colIdx.name]   : "").replace(/^"|"$/g,"").trim();
      const rawCA      = (colIdx.ca     >= 0 ? cols[colIdx.ca]     : "0").replace(/^"|"$/g,"").trim();
      const rawExam    = (colIdx.exam   >= 0 ? cols[colIdx.exam]   : "0").replace(/^"|"$/g,"").trim();
      const rawComment = (colIdx.comment>= 0 ? cols[colIdx.comment]: "").replace(/^"|"$/g,"").trim();

      // Skip rows where both reg and name are empty
      if (!rawReg && !rawName) continue;

      const ca   = Math.min(40, Math.max(0, parseFloat(rawCA)   || 0));
      const exam = Math.min(60, Math.max(0, parseFloat(rawExam) || 0));

      // Match student — reg number first (exact), then name (flexible)
      let matched = null;
      if (rawReg) {
        matched = importStudents.find(s =>
          (s.studentId || "").toLowerCase().trim() === rawReg.toLowerCase()
        );
      }
      if (!matched && rawName) {
        const searchName = rawName.toLowerCase();
        matched = importStudents.find(s => {
          const sName = s.name.toLowerCase();
          return sName === searchName ||
                 sName.includes(searchName) ||
                 searchName.includes(sName) ||
                 sName.split(" ")[0] === searchName.split(" ")[0]; // first name match
        });
      }

      rows.push({ rowNum: i + 1, rawReg, rawName, ca, exam, comment: rawComment, student: matched || null, matched: !!matched });
    }

    const unmatched = rows.filter(r => !r.matched).length;
    if (unmatched > 0) errors.push(`${unmatched} row(s) could not be matched to a student in this class — they will be skipped.`);

    return { rows, errors };
  };

  const processFile = (file) => {
    if (!file) return;
    setImportDone(false); setImportRows([]); setImportErrors([]);
    if (!importClass || !importSubject) {
      setImportErrors(["Please select a Class and Subject first before uploading."]);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { rows, errors } = parseCSV(ev.target.result);
      setImportRows(rows);
      setImportErrors(errors);
    };
    reader.onerror = () => setImportErrors(["Could not read the file. Please try again."]);
    reader.readAsText(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    // Reset so same file can be re-selected
    setTimeout(() => { if (fileInputRef.current) fileInputRef.current.value = ""; }, 100);
  };

  const confirmImport = () => {
    const matched = importRows.filter(r => r.matched);
    if (matched.length === 0) { showNotification("No valid rows to import.", "error"); return; }

    const newScores  = [...state.scores];
    const newAudit   = [...state.auditTrail];

    matched.forEach(({ student, ca, exam, comment }) => {
      const existing = newScores.findIndex(s =>
        s.studentId === student.id && s.subjectId === importSubject &&
        s.classId === importClass && s.session === state.currentSession && s.term === importTerm
      );
      const scoreObj = {
        id: existing >= 0 ? newScores[existing].id : generateId(),
        studentId: student.id, subjectId: importSubject, classId: importClass,
        session: state.currentSession, term: importTerm,
        ca, exam, comment, locked: false, enteredBy: currentUser.id,
      };
      if (existing >= 0) newScores[existing] = scoreObj; else newScores.push(scoreObj);
    });

    newAudit.unshift({
      id: generateId(), userId: currentUser.id, userName: currentUser.name,
      action: "CSV Import",
      details: `Imported ${matched.length} scores for ${state.subjects.find(s => s.id === importSubject)?.name} — ${state.classes.find(c => c.id === importClass)?.name} — ${importTerm}`,
      timestamp: new Date().toISOString(),
    });

    updateState({ scores: newScores, auditTrail: newAudit });
    setImportDone(true);
    setImportRows([]);
    showNotification(`✅ ${matched.length} scores imported successfully!`);
  };

  const downloadTemplate = () => {
    const importStudents = state.users.filter(u => u.role === "student" && u.classId === importClass);
    const sub = state.subjects.find(s => s.id === importSubject);
    const cls = state.classes.find(c => c.id === importClass);

    // Header row — must match exactly what parseCSV expects
    const headerRow = "RegNo,Name,CA,Exam,Comment";

    // One row per student — pre-filled reg no and name, scores left blank (0)
    const dataRows = importStudents.length > 0
      ? importStudents.map(s => `${s.studentId || ""},${s.name},0,0,`)
      : ["STD001,Sample Student,0,0,", "STD002,Another Student,0,0,"];

    const csv = [headerRow, ...dataRows].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `scores-${cls?.name || "class"}-${sub?.name || "subject"}-${importTerm}.csv`
                   .replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-_.]/g, "");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("Template downloaded! Open in Excel, fill scores, save as CSV.");
  };

  const isLocked = state.resultPublished;

  const SelectorBar = () => (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="grid-3">
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Class</label>
          <select className="form-input" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={isLocked}>
            <option value="">— Select Class —</option>
            {myClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {activeTab === "scores" && (
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Subject</label>
            <select className="form-input" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={isLocked}>
              <option value="">— Select Subject —</option>
              {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Term</label>
          <select className="form-input" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} disabled={isLocked}>
            {state.terms.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Score Entry</div>
        {isLocked && <span className="badge badge-red"><Icon name="lock" size={12} /> Results Locked</span>}
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === "scores" ? "active" : ""}`} onClick={() => setActiveTab("scores")}>📊 Academic Scores</div>
        <div className={`tab ${activeTab === "import" ? "active" : ""}`} onClick={() => setActiveTab("import")}>📂 Import CSV</div>
        <div className={`tab ${activeTab === "character" ? "active" : ""}`} onClick={() => setActiveTab("character")}>🌟 Character & Moral</div>
      </div>

      {/* ── IMPORT CSV TAB ── */}
      {activeTab === "import" && (
        <div>
          {/* Selectors for import */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 16 }}>
              Import Settings
            </div>
            <div className="grid-3">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Class</label>
                <select className="form-input" value={importClass} onChange={(e) => { setImportClass(e.target.value); setImportRows([]); setImportErrors([]); setImportDone(false); }}>
                  <option value="">— Select Class —</option>
                  {myClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Subject</label>
                <select className="form-input" value={importSubject} onChange={(e) => { setImportSubject(e.target.value); setImportRows([]); setImportErrors([]); setImportDone(false); }}>
                  <option value="">— Select Subject —</option>
                  {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Term</label>
                <select className="form-input" value={importTerm} onChange={(e) => setImportTerm(e.target.value)}>
                  {state.terms.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Step instructions */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 16 }}>
              How to Import Scores
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { step: "1", title: "Download Template", desc: "Click the button below to download a pre-filled CSV with your students' names and reg numbers already in it. Open it in Excel or Google Sheets." },
                { step: "2", title: "Fill in Scores", desc: "Enter each student's CA score (max 40) and Exam score (max 60) in the CA and Exam columns. Optionally add a comment. Save the file as CSV." },
                { step: "3", title: "Upload & Preview", desc: "Upload the filled CSV file. The app will show you a preview of all scores before saving — you can verify everything looks correct." },
                { step: "4", title: "Confirm Import", desc: "Click 'Confirm Import' to save all scores to the database at once." },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,var(--blue),var(--indigo))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 13 }}>
                    {step}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="btn btn-secondary"
                onClick={downloadTemplate}
                disabled={!importClass || !importSubject}
              >
                <Icon name="download" size={16} /> Download Template CSV
              </button>
              {(!importClass || !importSubject) && (
                <div style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", alignItems: "center" }}>
                  ← Select class and subject first
                </div>
              )}
            </div>
          </div>

          {/* Upload area */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 16 }}>
              Upload CSV File
            </div>

            <div
              style={{
                border: `2px dashed ${COLORS.blue}`,
                borderRadius: 12, padding: "32px 24px",
                textAlign: "center", cursor: "pointer",
                background: "rgba(37,99,235,0.05)",
                transition: "all 0.2s",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                Click to upload or drag & drop
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
                Supports CSV files (.csv) — exported from Excel or Google Sheets
              </div>
              <div style={{ marginTop: 12 }}>
                <span className="btn btn-primary btn-sm">Browse File</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {/* CSV Format hint */}
            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Expected CSV Format
              </div>
              <code style={{ fontSize: 12, color: COLORS.blueLight, lineHeight: 1.8 }}>
                RegNo,Name,CA,Exam,Comment<br/>
                STD001,Chioma Eze,35,55,Excellent performance<br/>
                STD002,Emeka Obi,28,48,Keep improving
              </code>
            </div>
          </div>

          {/* Errors / Warnings */}
          {importErrors.length > 0 && (
            <div className="card" style={{ marginBottom: 20, border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)" }}>
              <div style={{ fontWeight: 700, color: COLORS.gold, marginBottom: 8 }}>⚠️ Warnings</div>
              {importErrors.map((e, i) => (
                <div key={i} style={{ fontSize: 13, color: COLORS.gold, marginBottom: 4 }}>• {e}</div>
              ))}
            </div>
          )}

          {/* Preview table */}
          {importRows.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-header" style={{ marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight }}>
                    Preview — {importRows.filter(r => r.matched).length} of {importRows.length} rows matched
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
                    Review before confirming. Only matched rows (✅) will be imported.
                  </div>
                </div>
                <button className="btn btn-primary" onClick={confirmImport} disabled={isLocked || importRows.filter(r => r.matched).length === 0}>
                  <Icon name="check" size={16} /> Confirm Import
                </button>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Reg No</th>
                      <th>Name in File</th>
                      <th>Matched Student</th>
                      <th>CA</th>
                      <th>Exam</th>
                      <th>Total</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((row, i) => (
                      <tr key={i} style={{ opacity: row.matched ? 1 : 0.5 }}>
                        <td>
                          {row.matched
                            ? <span className="badge badge-green" style={{ fontSize: 11 }}>✅ Matched</span>
                            : <span className="badge badge-red" style={{ fontSize: 11 }}>❌ Not Found</span>
                          }
                        </td>
                        <td style={{ fontFamily: "monospace", fontSize: 12 }}>{row.rawReg || "—"}</td>
                        <td>{row.rawName || "—"}</td>
                        <td style={{ fontWeight: row.matched ? 600 : 400 }}>
                          {row.student ? row.student.name : <span style={{ color: COLORS.rose }}>No match</span>}
                        </td>
                        <td>
                          <span style={{ color: row.ca > 40 ? COLORS.rose : COLORS.textPrimary }}>
                            {row.ca}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: row.exam > 60 ? COLORS.rose : COLORS.textPrimary }}>
                            {row.exam}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: row.ca + row.exam >= 70 ? COLORS.emerald : row.ca + row.exam >= 50 ? COLORS.gold : COLORS.rose }}>
                          {row.ca + row.exam}
                        </td>
                        <td style={{ fontSize: 12, color: COLORS.textSecondary, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {row.comment || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success message */}
          {importDone && (
            <div className="card" style={{ textAlign: "center", padding: "32px 24px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: COLORS.emerald, marginBottom: 8 }}>
                Import Successful!
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
                All scores have been saved. You can view them in the Academic Scores tab or the Broadsheet.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn btn-primary btn-sm" onClick={() => { setActiveTab("scores"); setSelectedClass(importClass); setSelectedSubject(importSubject); setSelectedTerm(importTerm); }}>
                  View Scores
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setImportDone(false); setImportRows([]); setImportErrors([]); }}>
                  Import Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab !== "import" && <SelectorBar />}

      {/* ── SCORES TAB ── */}
      {activeTab === "scores" && (
        selectedClass && selectedSubject ? (
          <div className="card">
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div>
                <div className="section-title">{state.classes.find((c) => c.id === selectedClass)?.name} · {state.subjects.find((s) => s.id === selectedSubject)?.name}</div>
                <div className="section-sub">{classStudents.length} students · {selectedTerm}</div>
              </div>
              <button className="btn btn-primary" onClick={saveScores} disabled={isLocked}>
                <Icon name="check" size={16} /> Save All Scores
              </button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Student Name</th>
                    <th>CA (Max 40)</th>
                    <th>Exam (Max 60)</th>
                    <th>Total</th>
                    <th>Grade</th>
                    <th>Teacher's Comment</th>
                    <th>AI ✨</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((st) => {
                    const score = localScores[st.id] || { ca: "", exam: "" };
                    const ca = Number(score.ca) || 0;
                    const exam = Number(score.exam) || 0;
                    const total = ca + exam;
                    const gi = getGrade(total, state.gradingSystem);
                    return (
                      <tr key={st.id} className="score-row">
                        <td>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: st.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                            {st.avatar ? <img src={st.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : st.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                        </td>
                        <td style={{ fontWeight: 500 }}>{st.name}</td>
                        <td>
                          <input type="number" min={0} max={40} className="score-input" value={score.ca} disabled={isLocked}
                            onChange={(e) => setLocalScores((p) => ({ ...p, [st.id]: { ...p[st.id], ca: e.target.value } }))} />
                        </td>
                        <td>
                          <input type="number" min={0} max={60} className="score-input" value={score.exam} disabled={isLocked}
                            onChange={(e) => setLocalScores((p) => ({ ...p, [st.id]: { ...p[st.id], exam: e.target.value } }))} />
                        </td>
                        <td style={{ fontWeight: 700, color: total >= 50 ? COLORS.emerald : COLORS.rose }}>{total}</td>
                        <td>{total > 0 && <span className={`grade-${gi.grade}`}>{gi.grade}</span>}</td>
                        <td>
                          <input className="form-input" style={{ minWidth: 180, padding: "6px 10px" }} value={comments[st.id] || ""}
                            disabled={isLocked} onChange={(e) => setComments((p) => ({ ...p, [st.id]: e.target.value }))}
                            placeholder="Teacher comment..." />
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => getAIComment(st)}
                            disabled={isLocked || aiLoading === st.id || (!score.ca && !score.exam)} title="Generate AI comment">
                            {aiLoading === st.id ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Icon name="ai" size={14} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(37,99,235,0.08)", borderRadius: 8, fontSize: 13, color: COLORS.textSecondary }}>
              💡 CA max = 40 pts · Exam max = 60 pts · Total = 100. Click ✨ for AI-generated teacher comments.
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">Select a class and subject to begin score entry</div>
            </div>
          </div>
        )
      )}

      {/* ── CHARACTER & MORAL TAB ── */}
      {activeTab === "character" && (
        selectedClass ? (
          <div className="card">
            <div className="section-header" style={{ marginBottom: 16 }}>
              <div>
                <div className="section-title">{state.classes.find((c) => c.id === selectedClass)?.name} · Character Report</div>
                <div className="section-sub">{classStudents.length} students · {selectedTerm}</div>
              </div>
              <button className="btn btn-primary" onClick={saveCharacterReports} disabled={isLocked}>
                <Icon name="check" size={16} /> Save Reports
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: 900 }}>
                <thead>
                  <tr>
                    <th style={{ minWidth: 140 }}>Student</th>
                    {TRAITS.map((t) => <th key={t} style={{ minWidth: 110 }}>{t}</th>)}
                    <th style={{ minWidth: 220 }}>Teacher's Remark</th>
                    <th>AI ✨</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((st) => {
                    const data = charLocal[st.id] || {};
                    return (
                      <tr key={st.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: st.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                              {st.avatar ? <img src={st.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : st.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 500, fontSize: 13 }}>{st.name}</span>
                          </div>
                        </td>
                        {TRAITS.map((t) => (
                          <td key={t}>
                            <select
                              className="form-input"
                              style={{ padding: "5px 8px", fontSize: 12, minWidth: 100 }}
                              value={data[t] || ""}
                              disabled={isLocked}
                              onChange={(e) => setCharLocal((p) => ({ ...p, [st.id]: { ...p[st.id], [t]: e.target.value } }))}
                            >
                              <option value="">— Rate —</option>
                              {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                        ))}
                        <td>
                          <input
                            className="form-input"
                            style={{ minWidth: 200, padding: "5px 8px", fontSize: 12 }}
                            value={data._teacherRemark || ""}
                            disabled={isLocked}
                            placeholder="Teacher's character remark..."
                            onChange={(e) => setCharLocal((p) => ({ ...p, [st.id]: { ...p[st.id], _teacherRemark: e.target.value } }))}
                          />
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => getAICharacterRemark(st)}
                            disabled={isLocked || aiLoading === `char_${st.id}`} title="AI-generate character remark">
                            {aiLoading === `char_${st.id}` ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Icon name="ai" size={14} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(245,158,11,0.08)", borderRadius: 8, fontSize: 13, color: COLORS.textSecondary }}>
              🌟 Rate each student on {TRAITS.length} character traits. These ratings appear on the student's result sheet. Click ✨ for AI-generated remarks based on the ratings.
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🌟</div>
              <div className="empty-state-text">Select a class to begin character assessment</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ─── BROADSHEET PAGE ──────────────────────────────────────────────────────────
function BroadsheetPage({ state, currentUser, showNotification }) {
  const [selectedClass, setSelectedClass] = useState(
    currentUser.role === "teacher" ? (currentUser.classes?.[0] || "") : (state.classes[0]?.id || "")
  );
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const [viewMode, setViewMode] = useState("term"); // term | annual

  const availableClasses =
    currentUser.role === "teacher"
      ? state.classes.filter((c) => (currentUser.classes || []).includes(c.id))
      : state.classes;

  const classStudents = state.users.filter(
    (u) => u.role === "student" && u.classId === selectedClass
  );

  const subjectsTaken = [
    ...new Set(
      state.scores
        .filter((s) => s.classId === selectedClass)
        .map((s) => s.subjectId)
    ),
  ];

  const ranked = rankStudents(
    classStudents,
    state.scores.filter((s) => s.term === selectedTerm),
    selectedClass,
    state.currentSession,
    selectedTerm,
    state.gradingSystem
  );

  const TERM_LIST = ["First Term", "Second Term", "Third Term"];
  const isAnnual = selectedTerm === "Annual";

  // For Annual: per subject, sum each term's (ca+exam) then divide by number of terms that have a score
  const getAnnualSubjectScore = (studentId, subjectId) => {
    const termScores = TERM_LIST.map((term) =>
      state.scores.find(
        (s) =>
          s.studentId === studentId &&
          s.subjectId === subjectId &&
          s.classId === selectedClass &&
          s.session === state.currentSession &&
          s.term === term
      )
    ).filter(Boolean);
    if (termScores.length === 0) return { avg: 0, count: 0, termScores: [] };
    const sum = termScores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0);
    return { avg: Math.round((sum / 3) * 10) / 10, count: termScores.length, termScores };
  };

  // For Annual ranking: use the average of all subjects' annual averages
  const annualRanked = isAnnual
    ? (() => {
        const withTotals = classStudents.map((st) => {
          const subAvgs = subjectsTaken.map((sid) => getAnnualSubjectScore(st.id, sid).avg);
          const totalScore = subAvgs.reduce((a, v) => a + v, 0);
          const avg = subjectsTaken.length > 0 ? (totalScore / subjectsTaken.length).toFixed(1) : 0;
          return { ...st, totalScore, avg };
        });
        withTotals.sort((a, b) => b.totalScore - a.totalScore);
        let rank = 1;
        for (let i = 0; i < withTotals.length; i++) {
          if (i > 0 && withTotals[i].totalScore === withTotals[i - 1].totalScore) {
            withTotals[i].position = withTotals[i - 1].position;
          } else {
            withTotals[i].position = rank;
          }
          rank++;
        }
        return withTotals;
      })()
    : ranked;

  const displayRanked = isAnnual ? annualRanked : ranked;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Broadsheet</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary">
            <Icon name="download" size={16} /> Export PDF
          </button>
          <button className="btn btn-secondary">
            <Icon name="download" size={16} /> Export Excel
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select
          className="form-input"
          style={{ width: 160 }}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {availableClasses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="term-selector">
          {["First Term", "Second Term", "Third Term", "Annual"].map((t) => (
            <div
              key={t}
              className={`term-chip ${selectedTerm === t ? "active" : ""}`}
              onClick={() => setSelectedTerm(t)}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {isAnnual && (
        <div className="ai-insight" style={{ marginBottom: 16 }}>
          <div className="ai-insight-icon"><Icon name="chart" size={18} color="white" /></div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
            <strong style={{ color: COLORS.textPrimary }}>Annual Result:</strong> Each subject score = (1st Term + 2nd Term + 3rd Term) ÷ 3. Positions are ranked by cumulative annual average.
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <span className="badge badge-blue">
            {state.classes.find((c) => c.id === selectedClass)?.name}
          </span>
          <span className="badge badge-gold">{selectedTerm}</span>
          <span className="badge badge-gray">{state.currentSession}</span>
          <span className="badge badge-green">{classStudents.length} Students</span>
        </div>

        <div className="table-wrapper">
          <table className="broadsheet-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Photo</th>
                <th>Name</th>
                {subjectsTaken.map((sid) => {
                  const sub = state.subjects.find((s) => s.id === sid);
                  return <th key={sid}>{sub?.code}{isAnnual ? <span style={{ display: "block", fontSize: 9, fontWeight: 400, opacity: 0.7 }}>÷3</span> : ""}</th>;
                })}
                <th>Total</th>
                <th>Avg</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {displayRanked.map((st) => {
                // Per-subject scores for display
                const subDisplayScores = isAnnual
                  ? subjectsTaken.map((sid) => {
                      const { avg, count } = getAnnualSubjectScore(st.id, sid);
                      return { score: avg, hasData: count > 0 };
                    })
                  : subjectsTaken.map((sid) => {
                      const s = state.scores.find(
                        (x) =>
                          x.studentId === st.id &&
                          x.subjectId === sid &&
                          x.classId === selectedClass &&
                          x.session === state.currentSession &&
                          x.term === selectedTerm
                      );
                      const tot = s ? (s.ca || 0) + (s.exam || 0) : 0;
                      return { score: tot, hasData: !!s };
                    });

                const totalScore = isAnnual
                  ? st.totalScore
                  : subDisplayScores.reduce((a, v) => a + v.score, 0);

                const avg = isAnnual
                  ? st.avg
                  : subjectsTaken.length > 0
                  ? (totalScore / subjectsTaken.length).toFixed(1)
                  : 0;

                const overallGrade = getGrade(Number(avg), state.gradingSystem);

                return (
                  <tr key={st.id}>
                    <td>
                      <span className={`position-badge ${st.position === 1 ? "pos-1" : st.position === 2 ? "pos-2" : st.position === 3 ? "pos-3" : "pos-other"}`}>
                        {st.position}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        overflow: "hidden",
                        background: st.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {st.avatar
                          ? <img src={st.avatar} alt={st.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : st.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                        }
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{st.name}</td>
                    {subDisplayScores.map(({ score, hasData }, i) => {
                      const gi = getGrade(score, state.gradingSystem);
                      return (
                        <td key={i} style={{ textAlign: "center" }}>
                          <span style={{ fontWeight: 600 }}>{hasData ? score : "—"}</span>
                          {hasData && <><br /><span className={`grade-${gi.grade}`} style={{ fontSize: 10 }}>{gi.grade}</span></>}
                        </td>
                      );
                    })}
                    <td style={{ fontWeight: 700, color: COLORS.gold }}>{totalScore}</td>
                    <td style={{ fontWeight: 600 }}>{avg}</td>
                    <td>
                      <span className={`grade-${overallGrade.grade}`}>{overallGrade.grade}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayRanked.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-text">No scores recorded for this selection</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MY RESULT PAGE ───────────────────────────────────────────────────────────
function MyResultPage({ state, currentUser, updateState }) {
  const [selectedTerm, setSelectedTerm] = useState(state.currentTerm);
  const [showPrint, setShowPrint] = useState(false);

  const TERM_LIST = ["First Term", "Second Term", "Third Term"];
  const isAnnual = selectedTerm === "Annual";

  const studentUser =
    currentUser.role === "parent"
      ? state.users.find((u) => u.id === currentUser.childId)
      : currentUser;

  const cls = state.classes.find((c) => c.id === studentUser?.classId);

  // Regular term scores
  const termScores = state.scores.filter(
    (s) =>
      s.studentId === studentUser?.id &&
      s.session === state.currentSession &&
      s.term === selectedTerm
  );

  // Annual: get unique subjects this student has scores for, then compute per-subject average across 3 terms
  const allStudentScores = state.scores.filter(
    (s) => s.studentId === studentUser?.id && s.session === state.currentSession
  );
  const uniqueSubjectIds = [...new Set(allStudentScores.map((s) => s.subjectId))];

  const annualSubjectRows = uniqueSubjectIds.map((sid) => {
    const t1 = allStudentScores.find((s) => s.subjectId === sid && s.term === "First Term");
    const t2 = allStudentScores.find((s) => s.subjectId === sid && s.term === "Second Term");
    const t3 = allStudentScores.find((s) => s.subjectId === sid && s.term === "Third Term");
    const scores = [t1, t2, t3].filter(Boolean);
    const sum = scores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0);
    const annualAvg = scores.length > 0 ? Math.round((sum / 3) * 10) / 10 : 0;
    return {
      subjectId: sid,
      t1: t1 ? (t1.ca || 0) + (t1.exam || 0) : null,
      t2: t2 ? (t2.ca || 0) + (t2.exam || 0) : null,
      t3: t3 ? (t3.ca || 0) + (t3.exam || 0) : null,
      annualAvg,
      hasData: scores.length > 0,
    };
  });

  const scores = isAnnual ? [] : termScores;

  // Ranking
  const rankedStudents = cls
    ? (() => {
        const classStudents = state.users.filter(
          (u) => u.role === "student" && u.classId === studentUser?.classId
        );
        if (isAnnual) {
          const withTotals = classStudents.map((st) => {
            const stSubIds = [...new Set(
              state.scores
                .filter((s) => s.studentId === st.id && s.session === state.currentSession)
                .map((s) => s.subjectId)
            )];
            const subAvgs = stSubIds.map((sid) => {
              const stScores = TERM_LIST.map((term) =>
                state.scores.find(
                  (s) => s.studentId === st.id && s.subjectId === sid && s.session === state.currentSession && s.term === term
                )
              ).filter(Boolean);
              const sum = stScores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0);
              return stScores.length > 0 ? sum / 3 : 0;
            });
            const totalScore = subAvgs.reduce((a, v) => a + v, 0);
            return { ...st, totalScore };
          });
          withTotals.sort((a, b) => b.totalScore - a.totalScore);
          let rank = 1;
          for (let i = 0; i < withTotals.length; i++) {
            withTotals[i].position = i > 0 && withTotals[i].totalScore === withTotals[i - 1].totalScore
              ? withTotals[i - 1].position : rank;
            rank++;
          }
          return withTotals;
        }
        return rankStudents(classStudents, state.scores.filter((s) => s.term === selectedTerm), studentUser?.classId, state.currentSession, selectedTerm, state.gradingSystem);
      })()
    : [];

  const myRank = rankedStudents.find((r) => r.id === studentUser?.id);

  // Stats
  const totalScore = isAnnual
    ? annualSubjectRows.reduce((a, r) => a + r.annualAvg, 0)
    : scores.reduce((a, s) => a + (s.ca || 0) + (s.exam || 0), 0);
  const subjectCount = isAnnual ? annualSubjectRows.filter(r => r.hasData).length : scores.length;
  const avg = subjectCount > 0 ? (totalScore / subjectCount).toFixed(1) : 0;

  if (showPrint) {
    const printScores = isAnnual
      ? annualSubjectRows.filter(r => r.hasData).map(r => ({
          id: r.subjectId,
          studentId: studentUser?.id,
          subjectId: r.subjectId,
          ca: "—",
          exam: "—",
          annualAvg: r.annualAvg,
          isAnnual: true,
          comment: `1st: ${r.t1 ?? "—"} | 2nd: ${r.t2 ?? "—"} | 3rd: ${r.t3 ?? "—"}`,
        }))
      : scores;
    return (
      <div>
        <button className="btn btn-secondary" style={{ marginBottom: 16 }} onClick={() => setShowPrint(false)}>← Back to Results</button>
        <ResultSheet
          student={studentUser}
          scores={printScores}
          term={selectedTerm}
          state={state}
          cls={cls}
          isAnnual={isAnnual}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(16,185,129,0.08))",
        border: "1px solid rgba(37,99,235,0.2)",
        marginBottom: 20,
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
          border: "3px solid rgba(37,99,235,0.4)", overflow: "hidden",
          background: studentUser?.avatar ? "transparent" : "linear-gradient(135deg, var(--blue), var(--indigo))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24,
        }}>
          {studentUser?.avatar
            ? <img src={studentUser.avatar} alt={studentUser?.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : (studentUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "?")
          }
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800 }}>
            {currentUser.role === "parent" ? `${studentUser?.name}'s Results` : "My Results"}
          </div>
          <div style={{ color: COLORS.textSecondary, marginTop: 2 }}>
            {cls?.name} · ID: {studentUser?.studentId} · {state.currentSession}
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPrint(true)}>
          <Icon name="download" size={16} /> View / Download PDF
        </button>
      </div>

      <div className="term-selector" style={{ marginBottom: 20 }}>
        {[...state.terms, "Annual"].map((t) => (
          <div key={t} className={`term-chip ${selectedTerm === t ? "active" : ""}`} onClick={() => setSelectedTerm(t)}>
            {t}
          </div>
        ))}
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: isAnnual ? "Annual Total" : "Total Score", value: isAnnual ? totalScore.toFixed(1) : totalScore, color: COLORS.blue },
          { label: "Average", value: avg, color: COLORS.gold },
          { label: "Position", value: myRank ? ordinal(myRank.position) : "—", color: COLORS.emerald },
          { label: "Subjects", value: subjectCount, color: COLORS.rose },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-value" style={{ color: s.color, fontSize: 28 }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {isAnnual && (
        <div className="ai-insight" style={{ marginBottom: 16 }}>
          <div className="ai-insight-icon"><Icon name="chart" size={18} color="white" /></div>
          <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
            <strong style={{ color: COLORS.textPrimary }}>Annual Score Formula:</strong> Each subject's annual score = (1st Term + 2nd Term + 3rd Term) ÷ 3. Missing terms count as 0.
          </div>
        </div>
      )}

      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>
          {isAnnual ? "Annual Subject Scores" : `Subject Scores — ${selectedTerm}`}
        </div>

        {isAnnual ? (
          annualSubjectRows.filter(r => r.hasData).length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <div className="empty-state-text">No annual results available yet</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>1st Term</th>
                    <th>2nd Term</th>
                    <th>3rd Term</th>
                    <th>Annual Avg ÷3</th>
                    <th>Grade</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {annualSubjectRows.filter(r => r.hasData).map((r) => {
                    const sub = state.subjects.find((sb) => sb.id === r.subjectId);
                    const gi = getGrade(r.annualAvg, state.gradingSystem);
                    return (
                      <tr key={r.subjectId}>
                        <td style={{ fontWeight: 500 }}>{sub?.name}</td>
                        <td style={{ textAlign: "center", color: r.t1 !== null ? COLORS.textPrimary : COLORS.textMuted }}>
                          {r.t1 !== null ? r.t1 : <span style={{ color: COLORS.textMuted }}>—</span>}
                        </td>
                        <td style={{ textAlign: "center", color: r.t2 !== null ? COLORS.textPrimary : COLORS.textMuted }}>
                          {r.t2 !== null ? r.t2 : <span style={{ color: COLORS.textMuted }}>—</span>}
                        </td>
                        <td style={{ textAlign: "center", color: r.t3 !== null ? COLORS.textPrimary : COLORS.textMuted }}>
                          {r.t3 !== null ? r.t3 : <span style={{ color: COLORS.textMuted }}>—</span>}
                        </td>
                        <td style={{ fontWeight: 700, fontSize: 16, textAlign: "center", color: COLORS.gold }}>{r.annualAvg}</td>
                        <td><span className={`grade-${gi.grade}`}>{gi.grade}</span></td>
                        <td style={{ color: gi.grade === "A" ? COLORS.emerald : gi.grade === "F" ? COLORS.rose : COLORS.textSecondary }}>{gi.remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          scores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <div className="empty-state-text">No results for this term yet</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Subject</th><th>CA (40)</th><th>Exam (60)</th><th>Total</th><th>Grade</th><th>Remark</th><th>Comment</th></tr>
                </thead>
                <tbody>
                  {scores.map((s) => {
                    const sub = state.subjects.find((sb) => sb.id === s.subjectId);
                    const tot = (s.ca || 0) + (s.exam || 0);
                    const gi = getGrade(tot, state.gradingSystem);
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 500 }}>{sub?.name}</td>
                        <td>{s.ca}</td>
                        <td>{s.exam}</td>
                        <td style={{ fontWeight: 700 }}>{tot}</td>
                        <td><span className={`grade-${gi.grade}`}>{gi.grade}</span></td>
                        <td style={{ color: gi.grade === "A" ? COLORS.emerald : gi.grade === "F" ? COLORS.rose : COLORS.textSecondary }}>{gi.remark}</td>
                        <td style={{ color: COLORS.textSecondary, fontSize: 13 }}>{s.comment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── PIN MANAGER PAGE ─────────────────────────────────────────────────────────
function PINManagerPage({ state, updateState, showNotification }) {
  const [genCount, setGenCount] = useState(10);

  const generatePoolPINs = () => {
    const existing = new Set(state.pinCodes.map((p) => p.code));
    const newPins = [];
    let attempts = 0;
    while (newPins.length < genCount && attempts < 500) {
      const code = generatePinCode();
      if (!existing.has(code)) {
        existing.add(code);
        newPins.push({ code, claimedBy: null, usedCount: 0 });
      }
      attempts++;
    }
    updateState({ pinCodes: [...state.pinCodes, ...newPins] });
    showNotification(`${newPins.length} new PINs added to the pool!`);
  };

  const resetPIN = (code) => {
    updateState({
      pinCodes: state.pinCodes.map((p) =>
        p.code === code ? { ...p, claimedBy: null, usedCount: 0 } : p
      ),
    });
    showNotification("PIN reset.");
  };

  const deletePIN = (code) => {
    updateState({ pinCodes: state.pinCodes.filter((p) => p.code !== code) });
    showNotification("PIN deleted.");
  };

  const downloadPINs = () => {
    const availPins = state.pinCodes.filter((p) => p.usedCount < 3);
    const institutionName = state.institution.name;
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${institutionName} — Result Checker PINs</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Georgia', serif; background: #f0f4ff; padding: 24px; }
  .header { text-align:center; margin-bottom:28px; }
  .school-name { font-size:26px; font-weight:700; color:#1B3A8F; }
  .sub { font-size:13px; color:#555; margin-top:6px; }
  .watermark { font-size:11px; color:#999; margin-top:4px; }
  .grid { display:grid; grid-template-columns: repeat(3,1fr); gap:14px; }
  .pin-card {
    background:white; border:2px solid #1B3A8F; border-radius:12px;
    padding:16px 12px; text-align:center;
    box-shadow: 0 2px 8px rgba(27,58,143,0.12);
  }
  .pin-label { font-size:11px; color:#666; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; }
  .pin-code { font-size:22px; font-weight:800; color:#1B3A8F; letter-spacing:0.12em; font-family:monospace; }
  .pin-school { font-size:10px; color:#999; margin-top:6px; }
  .pin-uses { font-size:11px; color:#10B981; margin-top:4px; font-weight:600; }
  .status-claimed { border-color:#F59E0B; }
  .status-claimed .pin-code { color:#D97706; }
  .status-exhausted { border-color:#F43F5E; opacity:0.6; }
  .footer { text-align:center; margin-top:28px; font-size:11px; color:#999; }
  @media print { body { background:white; padding:0; } }
</style>
</head>
<body>
<div class="header">
  <div class="school-name">🏫 ${institutionName}</div>
  <div class="sub">Result Checker PIN Codes — ${state.currentSession}</div>
  <div class="watermark">Generated: ${new Date().toLocaleDateString()} · Total PINs: ${availPins.length} active</div>
</div>
<div class="grid">
${state.pinCodes.map(p => {
  const cls = p.claimedBy ? state.users.find(u => u.id === p.claimedBy) : null;
  const statusClass = p.usedCount >= 3 ? 'status-exhausted' : p.claimedBy ? 'status-claimed' : '';
  const remaining = 3 - p.usedCount;
  return `  <div class="pin-card ${statusClass}">
    <div class="pin-label">Result Checker PIN</div>
    <div class="pin-code">${p.code}</div>
    <div class="pin-school">${institutionName}</div>
    <div class="pin-uses">${p.usedCount >= 3 ? '❌ Exhausted' : p.claimedBy ? `✅ Claimed · ${remaining} use${remaining !== 1 ? 's' : ''} left` : `🟢 Available · 3 uses`}</div>
    ${cls ? `<div style="font-size:10px;color:#888;margin-top:3px">by ${cls.name}</div>` : ''}
  </div>`;
}).join('\n')}
</div>
<div class="footer">SARMS · ${institutionName} · Confidential — Do not share PIN codes publicly</div>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PIN_Codes_${state.currentSession.replace("/", "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("PINs downloaded! Open the HTML file and print to PDF.");
  };

  const pool = state.pinCodes;
  const available = pool.filter((p) => !p.claimedBy && p.usedCount === 0).length;
  const claimed = pool.filter((p) => p.claimedBy && p.usedCount < 3).length;
  const exhausted = pool.filter((p) => p.usedCount >= 3).length;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">PIN Manager</div>
          <div className="section-sub">Pool-based · PINs are not pre-assigned — first user claims it · Max 3 uses each</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-secondary" onClick={downloadPINs}>
            <Icon name="download" size={16} /> Download PINs
          </button>
          <button className="btn btn-gold" onClick={generatePoolPINs}>
            <Icon name="plus" size={16} /> Generate {genCount} PINs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: "Total PINs", value: pool.length, color: COLORS.blue },
          { label: "Available", value: available, color: COLORS.emerald },
          { label: "Claimed (Active)", value: claimed, color: COLORS.gold },
          { label: "Exhausted", value: exhausted, color: COLORS.rose },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-value" style={{ color: s.color, fontSize: 28 }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Generate control */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 12 }}>Generate New PINs</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: COLORS.textSecondary }}>Quantity:</span>
            {[5, 10, 20, 50, 100].map((n) => (
              <button
                key={n}
                className={`btn btn-sm ${genCount === n ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setGenCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button className="btn btn-gold" onClick={generatePoolPINs}>
            <Icon name="pin" size={16} /> Generate {genCount} PINs
          </button>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10 }}>
          PINs are generated randomly. They are NOT assigned to any student. The first student who uses a PIN claims it — that PIN can then only be used by the same student up to 3 times total.
        </div>
      </div>

      {/* PIN table */}
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>PIN Code</th>
                <th>Status</th>
                <th>Claimed By</th>
                <th>Uses</th>
                <th>Remaining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pool.map((p) => {
                const claimer = p.claimedBy ? state.users.find((u) => u.id === p.claimedBy) : null;
                const remaining = 3 - p.usedCount;
                const isExhausted = p.usedCount >= 3;
                const isClaimed = !!p.claimedBy;
                return (
                  <tr key={p.code}>
                    <td>
                      <code style={{
                        background: isExhausted ? "rgba(244,63,94,0.1)" : isClaimed ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                        color: isExhausted ? COLORS.rose : isClaimed ? COLORS.gold : COLORS.emerald,
                        padding: "3px 10px", borderRadius: 6, fontSize: 14, fontWeight: 800, letterSpacing: "0.1em",
                      }}>
                        {p.code}
                      </code>
                    </td>
                    <td>
                      <span className={isExhausted ? "badge badge-red" : isClaimed ? "badge badge-gold" : "badge badge-green"}>
                        {isExhausted ? "Exhausted" : isClaimed ? "Claimed" : "Available"}
                      </span>
                    </td>
                    <td style={{ color: COLORS.textSecondary }}>
                      {claimer ? claimer.name : <span style={{ color: COLORS.textMuted, fontStyle: "italic" }}>Unclaimed</span>}
                    </td>
                    <td style={{ textAlign: "center" }}>{p.usedCount}/3</td>
                    <td>
                      <div style={{ display: "flex", gap: 3 }}>
                        {[0, 1, 2].map((i) => (
                          <div key={i} style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: i < remaining ? COLORS.emerald : COLORS.border,
                          }} />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => resetPIN(p.code)} title="Reset PIN">
                          Reset
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => deletePIN(p.code)} title="Delete PIN">
                          <Icon name="trash" size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pool.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔑</div>
              <div className="empty-state-text">No PINs in pool yet. Generate some above.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AUDIT TRAIL PAGE ─────────────────────────────────────────────────────────
function AuditTrailPage({ state }) {
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Audit Trail</div>
          <div className="section-sub">{state.auditTrail.length} events recorded</div>
        </div>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Details</th></tr>
            </thead>
            <tbody>
              {state.auditTrail.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: COLORS.textSecondary, fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(a.timestamp).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 500 }}>{a.userName}</td>
                  <td><span className="badge badge-blue">{a.action}</span></td>
                  <td style={{ color: COLORS.textSecondary }}>{a.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {state.auditTrail.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No audit records yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── INSTITUTION PAGE ─────────────────────────────────────────────────────────
function InstitutionPage({ state, updateState, showNotification }) {
  const [form, setForm] = useState({ ...state.institution });
  const [newSession, setNewSession] = useState("");
  const [sessionError, setSessionError] = useState("");
  const sigRef = useRef(null);
  const logoRef = useRef(null);

  const handleImageUpload = (field, file) => {
    const reader = new FileReader();
    reader.onload = (e) => setForm((prev) => ({ ...prev, [field]: e.target.result }));
    reader.readAsDataURL(file);
  };

  // Validate format: YYYY/YYYY where second year = first + 1
  const validateSession = (val) => {
    const trimmed = val.trim();
    const match = trimmed.match(/^(\d{4})\/(\d{4})$/);
    if (!match) return "Format must be YYYY/YYYY (e.g. 2030/2031)";
    const y1 = parseInt(match[1]), y2 = parseInt(match[2]);
    if (y2 !== y1 + 1) return `Second year must be ${y1 + 1}`;
    if (state.sessions.includes(trimmed)) return "Session already exists";
    return "";
  };

  const addSession = () => {
    const err = validateSession(newSession);
    if (err) { setSessionError(err); return; }
    const trimmed = newSession.trim();
    const updated = [...state.sessions, trimmed].sort();
    updateState({ sessions: updated, currentSession: trimmed });
    setNewSession("");
    setSessionError("");
    showNotification(`Session ${trimmed} added and set as active!`);
  };

  const removeSession = (s) => {
    if (state.sessions.length === 1) {
      showNotification("Cannot remove the only session.", "error");
      return;
    }
    const updated = state.sessions.filter((x) => x !== s);
    const newCurrent = s === state.currentSession ? updated[updated.length - 1] : state.currentSession;
    updateState({ sessions: updated, currentSession: newCurrent });
    showNotification(`Session ${s} removed.`);
  };

  const setActiveSession = (s) => {
    updateState({ currentSession: s });
    showNotification(`Active session set to ${s}`);
  };

  return (
    <div>
      <div className="section-title" style={{ marginBottom: 20 }}>Institution Settings</div>

      {/* School Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 16, color: COLORS.blueLight }}>
          School Information
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">School Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Principal / Head Teacher</label>
            <input className="form-input" value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea className="form-input" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Current Term</label>
          <select className="form-input" style={{ maxWidth: 220 }} value={state.currentTerm} onChange={(e) => updateState({ currentTerm: e.target.value })}>
            {state.terms.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Logo & Signature Upload */}
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="form-group">
            <label className="form-label">School Logo</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 10, border: "2px dashed var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", background: "rgba(0,0,0,0.2)", flexShrink: 0,
              }}>
                {form.logo
                  ? <img src={form.logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : <span style={{ fontSize: 28 }}>🏫</span>
                }
              </div>
              <div>
                <input type="file" accept="image/*" ref={logoRef} style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleImageUpload("logo", e.target.files[0])} />
                <button className="btn btn-secondary btn-sm" onClick={() => logoRef.current?.click()}>
                  <Icon name="upload" size={14} /> Upload Logo
                </button>
                {form.logo && <button className="btn btn-danger btn-sm" style={{ marginTop: 6 }} onClick={() => setForm(p => ({ ...p, logo: null }))}>Remove</button>}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Principal's Signature</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 120, height: 56, borderRadius: 8, border: "2px dashed var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", background: "rgba(0,0,0,0.2)", flexShrink: 0,
              }}>
                {form.signature
                  ? <img src={form.signature} alt="Signature" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  : <span style={{ fontSize: 12, color: COLORS.textMuted, padding: "0 8px", textAlign: "center" }}>No signature yet</span>
                }
              </div>
              <div>
                <input type="file" accept="image/*" ref={sigRef} style={{ display: "none" }} onChange={(e) => e.target.files[0] && handleImageUpload("signature", e.target.files[0])} />
                <button className="btn btn-secondary btn-sm" onClick={() => sigRef.current?.click()}>
                  <Icon name="upload" size={14} /> Upload Signature
                </button>
                {form.signature && <button className="btn btn-danger btn-sm" style={{ marginTop: 6 }} onClick={() => setForm(p => ({ ...p, signature: null }))}>Remove</button>}
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Principal's Standard Comment (appears on result sheets)</label>
          <textarea className="form-input" rows={3} placeholder="e.g. Diligence and hard work are keys to success. Keep striving for excellence!" value={form.principalComment || ""} onChange={(e) => setForm({ ...form, principalComment: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={() => { updateState({ institution: form }); showNotification("Institution settings saved!"); }}
          >
            <Icon name="check" size={16} /> Save Changes
          </button>
          <button
            className="btn btn-danger"
            onClick={async () => {
              if (window.confirm("⚠️ This will erase ALL data (students, scores, settings) and reset to factory defaults. This cannot be undone.\n\nAre you sure?")) {
                try {
                  // Delete all rows from sarms_data table
                  await fetch("api/db.php?action=reset_all", { method: "POST" });
                } catch(e) {}
                window.location.reload();
              }
            }}
          >
            <Icon name="trash" size={16} /> Reset All Data
          </button>
        </div>
      </div>

      {/* Session Manager */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 4, color: COLORS.blueLight }}>
          Academic Sessions
        </div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
          Add, remove, or switch the active academic session. The active session controls all score entries and result views.
        </div>

        {/* Add new session */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input
              className="form-input"
              placeholder="e.g. 2030/2031"
              value={newSession}
              onChange={(e) => { setNewSession(e.target.value); setSessionError(""); }}
              onKeyDown={(e) => e.key === "Enter" && addSession()}
              style={{ borderColor: sessionError ? COLORS.rose : undefined }}
            />
            {sessionError && (
              <div style={{ color: COLORS.rose, fontSize: 12, marginTop: 5 }}>{sessionError}</div>
            )}
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
              Format: YYYY/YYYY — e.g. 2030/2031
            </div>
          </div>
          <button className="btn btn-primary" onClick={addSession}>
            <Icon name="plus" size={16} /> Add Session
          </button>
        </div>

        {/* Sessions list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...state.sessions].sort().map((s) => {
            const isActive = s === state.currentSession;
            return (
              <div
                key={s}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 10,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(27,58,143,0.12))"
                    : "rgba(0,0,0,0.2)",
                  border: isActive ? "1px solid rgba(37,99,235,0.35)" : "1px solid var(--border)",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? COLORS.emerald : COLORS.border,
                    boxShadow: isActive ? `0 0 8px ${COLORS.emerald}` : "none",
                  }} />
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: 15,
                    color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
                  }}>
                    {s}
                  </span>
                  {isActive && (
                    <span className="badge badge-green" style={{ fontSize: 11 }}>
                      <Icon name="check" size={11} /> Active
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!isActive && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => setActiveSession(s)}
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm btn-icon"
                    onClick={() => removeSession(s)}
                    disabled={isActive}
                    title={isActive ? "Cannot delete the active session" : `Delete ${s}`}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promotion */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>Promotion Management</div>
        <div className="ai-insight">
          <div className="ai-insight-icon"><Icon name="promote" size={18} color="white" /></div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Auto-Promote Students</div>
            <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
              Move all students to their next class level at the end of the academic session.
            </div>
            <button className="btn btn-gold" style={{ marginTop: 10 }}>
              <Icon name="promote" size={16} /> Run Auto-Promotion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GRADING PAGE ─────────────────────────────────────────────────────────────
function GradingPage({ state, updateState, showNotification }) {
  const [grading, setGrading] = useState([...state.gradingSystem]);

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Grading System</div>
        <button
          className="btn btn-primary"
          onClick={() => { updateState({ gradingSystem: grading }); showNotification("Grading system updated!"); }}
        >
          <Icon name="check" size={16} /> Save
        </button>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr><th>Grade</th><th>Min Score</th><th>Max Score</th><th>Remark</th></tr>
          </thead>
          <tbody>
            {grading.map((g, i) => (
              <tr key={i}>
                <td><span className={`grade-${g.grade}`}>{g.grade}</span></td>
                <td>
                  <input type="number" className="score-input" value={g.min}
                    onChange={(e) => setGrading(grading.map((x, j) => j === i ? { ...x, min: Number(e.target.value) } : x))} />
                </td>
                <td>
                  <input type="number" className="score-input" value={g.max}
                    onChange={(e) => setGrading(grading.map((x, j) => j === i ? { ...x, max: Number(e.target.value) } : x))} />
                </td>
                <td>
                  <input className="form-input" style={{ width: 150 }} value={g.remark}
                    onChange={(e) => setGrading(grading.map((x, j) => j === i ? { ...x, remark: e.target.value } : x))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ASSIGNMENTS PAGE ──────────────────────────────────────────────────────────
function AssignmentsPage({ state, updateState, currentUser, showNotification }) {
  const [tab, setTab] = useState(currentUser.role === "teacher" ? "post" : "mine");
  const [form, setForm] = useState({ title: "", description: "", classId: "", subjectId: "", dueDate: "", file: null, fileName: "" });
  const [submissionText, setSubmissionText] = useState({});
  const [submissionFile, setSubmissionFile] = useState({});
  const fileRef = useRef(null);
  const subFileRef = useRef(null);

  const isTeacher = currentUser.role === "teacher";
  const isStudent = currentUser.role === "student";
  const isParent = currentUser.role === "parent";

  const studentUser = isParent ? state.users.find((u) => u.id === currentUser.childId) : currentUser;
  const assignments = state.assignments || [];

  // Teacher: classes/subjects they teach
  const myClasses = isTeacher ? state.classes.filter((c) => (currentUser.classes || []).includes(c.id)) : state.classes;
  const mySubjects = isTeacher ? state.subjects.filter((s) => (currentUser.subjects || []).includes(s.id)) : state.subjects;

  // Student/Parent: assignments for their class
  const myAssignments = assignments.filter((a) => a.classId === studentUser?.classId);

  // Teacher: assignments they posted
  const postedAssignments = assignments.filter((a) => a.teacherId === currentUser.id);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, file: ev.target.result, fileName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleSubFileChange = (e, assignmentId) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSubmissionFile((p) => ({ ...p, [assignmentId]: { data: ev.target.result, name: file.name } }));
    reader.readAsDataURL(file);
  };

  const postAssignment = () => {
    if (!form.title || !form.classId || !form.subjectId || !form.dueDate) {
      showNotification("Please fill all required fields", "error"); return;
    }
    const newA = {
      id: generateId(),
      title: form.title,
      description: form.description,
      classId: form.classId,
      subjectId: form.subjectId,
      dueDate: form.dueDate,
      file: form.file,
      fileName: form.fileName,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      postedAt: new Date().toISOString(),
      submissions: [],
    };
    updateState({ assignments: [newA, ...(state.assignments || [])] });
    setForm({ title: "", description: "", classId: "", subjectId: "", dueDate: "", file: null, fileName: "" });
    showNotification("Assignment posted successfully!");
    setTab("posted");
  };

  const submitAssignment = (assignmentId) => {
    const text = submissionText[assignmentId] || "";
    const fileSub = submissionFile[assignmentId];
    if (!text && !fileSub) { showNotification("Add a response or upload a file", "error"); return; }
    const submission = {
      studentId: studentUser.id,
      studentName: studentUser.name,
      text,
      file: fileSub?.data || null,
      fileName: fileSub?.name || null,
      submittedAt: new Date().toISOString(),
    };
    const updated = (state.assignments || []).map((a) =>
      a.id === assignmentId
        ? { ...a, submissions: [...(a.submissions || []).filter(s => s.studentId !== studentUser.id), submission] }
        : a
    );
    updateState({ assignments: updated });
    setSubmissionText((p) => ({ ...p, [assignmentId]: "" }));
    setSubmissionFile((p) => { const n = { ...p }; delete n[assignmentId]; return n; });
    showNotification("Assignment submitted!");
  };

  const deleteAssignment = (id) => {
    updateState({ assignments: (state.assignments || []).filter((a) => a.id !== id) });
    showNotification("Assignment deleted.");
  };

  const AssignmentCard = ({ a, showSubmissions }) => {
    const cls = state.classes.find((c) => c.id === a.classId);
    const sub = state.subjects.find((s) => s.id === a.subjectId);
    const mySubmission = (a.submissions || []).find((s) => s.studentId === studentUser?.id);
    const isOverdue = new Date(a.dueDate) < new Date();
    const subFileInputId = `subfile-${a.id}`;

    return (
      <div className="card" style={{ marginBottom: 16, borderLeft: `4px solid ${isOverdue ? COLORS.rose : COLORS.blue}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>{a.title}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <span className="badge badge-blue">{cls?.name}</span>
              <span className="badge badge-gold">{sub?.name}</span>
              <span className={`badge ${isOverdue ? "badge-red" : "badge-green"}`}>
                Due: {new Date(a.dueDate).toLocaleDateString()}
              </span>
              <span className="badge badge-gray">By {a.teacherName}</span>
            </div>
          </div>
          {isTeacher && a.teacherId === currentUser.id && (
            <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteAssignment(a.id)}>
              <Icon name="trash" size={14} />
            </button>
          )}
        </div>

        {a.description && (
          <div style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{a.description}</div>
        )}

        {a.file && (
          <a href={a.file} download={a.fileName}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.blueLight, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            <Icon name="download" size={14} /> {a.fileName || "Download Attachment"}
          </a>
        )}

        {/* Teacher: see submissions */}
        {showSubmissions && (
          <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>
              Submissions ({(a.submissions || []).length})
            </div>
            {(a.submissions || []).length === 0 ? (
              <div style={{ color: COLORS.textMuted, fontSize: 13 }}>No submissions yet.</div>
            ) : (
              (a.submissions || []).map((s) => (
                <div key={s.studentId} style={{ padding: "8px 12px", background: "rgba(16,185,129,0.08)", borderRadius: 8, marginBottom: 6, border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{s.studentName}</div>
                  {s.text && <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>{s.text}</div>}
                  {s.file && (
                    <a href={s.file} download={s.fileName}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.blueLight, fontSize: 12, marginTop: 4 }}>
                      <Icon name="download" size={12} /> {s.fileName}
                    </a>
                  )}
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
                    Submitted: {new Date(s.submittedAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Student: submit */}
        {(isStudent || isParent) && !mySubmission && (
          <div style={{ marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Submit Your Work</div>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Type your answer or response here..."
              value={submissionText[a.id] || ""}
              onChange={(e) => setSubmissionText((p) => ({ ...p, [a.id]: e.target.value }))}
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <input type="file" id={subFileInputId} style={{ display: "none" }}
                onChange={(e) => handleSubFileChange(e, a.id)} />
              <button className="btn btn-secondary btn-sm" onClick={() => document.getElementById(subFileInputId)?.click()}>
                <Icon name="upload" size={14} /> Attach File
              </button>
              {submissionFile[a.id] && (
                <span style={{ fontSize: 12, color: COLORS.emerald }}>📎 {submissionFile[a.id].name}</span>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => submitAssignment(a.id)}>
                <Icon name="check" size={14} /> Submit
              </button>
            </div>
          </div>
        )}

        {(isStudent || isParent) && mySubmission && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(16,185,129,0.1)", borderRadius: 8, border: "1px solid rgba(16,185,129,0.25)" }}>
            <div style={{ fontWeight: 600, color: COLORS.emerald, fontSize: 13 }}>✅ Submitted</div>
            {mySubmission.text && <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>{mySubmission.text.slice(0, 100)}…</div>}
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
              {new Date(mySubmission.submittedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Assignments</div>
        <div style={{ fontSize: 13, color: COLORS.textSecondary }}>
          {isTeacher ? "Post take-home assignments for your classes" : "View and submit your assignments"}
        </div>
      </div>

      {isTeacher && (
        <div className="tabs">
          <div className={`tab ${tab === "post" ? "active" : ""}`} onClick={() => setTab("post")}>Post Assignment</div>
          <div className={`tab ${tab === "posted" ? "active" : ""}`} onClick={() => setTab("posted")}>My Posted ({postedAssignments.length})</div>
        </div>
      )}

      {/* Teacher: post assignment */}
      {isTeacher && tab === "post" && (
        <div className="card">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>New Assignment</div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Mathematics Take-Home Exercise 3" />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Class *</label>
              <select className="form-input" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
                <option value="">— Select Class —</option>
                {myClasses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select className="form-input" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">— Select Subject —</option>
                {mySubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Instructions / Description</label>
            <textarea className="form-input" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the assignment, questions, or instructions for students..." />
          </div>
          <div className="form-group">
            <label className="form-label">Attachment (optional — PDF, Word, image)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="file" ref={fileRef} style={{ display: "none" }} onChange={handleFileChange} />
              <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
                <Icon name="upload" size={16} /> Upload File
              </button>
              {form.fileName && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: COLORS.emerald }}>📎 {form.fileName}</span>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => setForm((p) => ({ ...p, file: null, fileName: "" }))}>
                    <Icon name="close" size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <button className="btn btn-primary" onClick={postAssignment}>
            <Icon name="check" size={16} /> Post Assignment
          </button>
        </div>
      )}

      {/* Teacher: posted assignments with submissions */}
      {isTeacher && tab === "posted" && (
        <div>
          {postedAssignments.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <div className="empty-state-text">No assignments posted yet</div>
              </div>
            </div>
          ) : (
            postedAssignments.map((a) => <AssignmentCard key={a.id} a={a} showSubmissions={true} />)
          )}
        </div>
      )}

      {/* Student / Parent view */}
      {(isStudent || isParent) && (
        <div>
          {myAssignments.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <div className="empty-state-text">No assignments posted for your class yet</div>
              </div>
            </div>
          ) : (
            myAssignments.map((a) => <AssignmentCard key={a.id} a={a} showSubmissions={false} />)
          )}
        </div>
      )}
    </div>
  );
}
// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ state, updateState, updateCurrentUser, currentUser, showNotification }) {
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar || null,
  });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const avatarRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (!form.name || !form.email) {
      showNotification("Name and email are required.", "error"); return;
    }
    updateCurrentUser({ name: form.name, email: form.email, avatar: form.avatar });
    showNotification("Profile updated successfully!");
  };

  const changePassword = () => {
    setPwError(""); setPwSuccess("");
    if (!pwForm.current) { setPwError("Enter your current password."); return; }
    if (currentUser.password !== pwForm.current) { setPwError("Current password is incorrect."); return; }
    if (pwForm.newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    updateCurrentUser({ password: pwForm.newPw });
    setPwForm({ current: "", newPw: "", confirm: "" });
    setPwSuccess("Password changed successfully!");
    showNotification("Password updated!");
  };

  return (
    <div>
      <div className="section-title" style={{ marginBottom: 20 }}>My Profile</div>

      {/* Profile info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 20 }}>
          Account Information
        </div>

        {/* Avatar section */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, padding: 20, background: "rgba(0,0,0,0.2)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
            border: "3px solid rgba(37,99,235,0.4)", overflow: "hidden",
            background: form.avatar ? "transparent" : "linear-gradient(135deg,var(--blue),var(--indigo))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28,
            boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
          }}>
            {form.avatar
              ? <img src={form.avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : form.name.split(" ").map(n => n[0]).join("").slice(0, 2)
            }
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{currentUser.name}</div>
            <div style={{ marginBottom: 12 }}>
              <span className={`badge ${currentUser.role === "admin" ? "badge-gold" : "badge-blue"}`} style={{ fontSize: 12, padding: "4px 12px" }}>
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="file" accept="image/*" ref={avatarRef} style={{ display: "none" }} onChange={handleAvatarChange} />
              <button className="btn btn-primary btn-sm" onClick={() => avatarRef.current?.click()}>
                <Icon name="upload" size={14} /> Change Photo
              </button>
              {form.avatar && (
                <button className="btn btn-danger btn-sm" onClick={() => setForm(p => ({ ...p, avatar: null }))}>
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <input className="form-input" value={currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} disabled style={{ opacity: 0.5 }} />
        </div>
        <button className="btn btn-primary" onClick={saveProfile}>
          <Icon name="check" size={16} /> Save Profile
        </button>
      </div>

      {/* Change Password */}
      <div className="card">
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 20 }}>
          Change Password
        </div>
        <div style={{ maxWidth: 420 }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={pwForm.current}
              onChange={(e) => { setPwForm({ ...pwForm, current: e.target.value }); setPwError(""); setPwSuccess(""); }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Minimum 6 characters"
              value={pwForm.newPw}
              onChange={(e) => { setPwForm({ ...pwForm, newPw: e.target.value }); setPwError(""); setPwSuccess(""); }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Re-enter new password"
              value={pwForm.confirm}
              onChange={(e) => { setPwForm({ ...pwForm, confirm: e.target.value }); setPwError(""); setPwSuccess(""); }}
            />
          </div>

          {/* Strength indicator */}
          {pwForm.newPw && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Password strength</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4].map((lvl) => {
                  const strength = pwForm.newPw.length >= 12 && /[A-Z]/.test(pwForm.newPw) && /[0-9]/.test(pwForm.newPw) && /[^a-zA-Z0-9]/.test(pwForm.newPw) ? 4
                    : pwForm.newPw.length >= 8 && (/[A-Z]/.test(pwForm.newPw) || /[0-9]/.test(pwForm.newPw)) ? 3
                    : pwForm.newPw.length >= 6 ? 2 : 1;
                  return (
                    <div key={lvl} style={{
                      flex: 1, height: 5, borderRadius: 3,
                      background: lvl <= strength
                        ? strength >= 4 ? COLORS.emerald : strength >= 3 ? COLORS.blueLight : strength >= 2 ? COLORS.gold : COLORS.rose
                        : "var(--border)",
                      transition: "background 0.3s",
                    }} />
                  );
                })}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3 }}>
                {pwForm.newPw.length < 6 ? "Too short" : pwForm.newPw.length < 8 ? "Weak" : /[A-Z]/.test(pwForm.newPw) && /[0-9]/.test(pwForm.newPw) ? "Strong" : "Medium"}
              </div>
            </div>
          )}

          {pwError && (
            <div style={{ color: COLORS.rose, fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(244,63,94,0.1)", borderRadius: 8 }}>
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div style={{ color: COLORS.emerald, fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(16,185,129,0.1)", borderRadius: 8, fontWeight: 600 }}>
              ✅ {pwSuccess}
            </div>
          )}
          <button className="btn btn-primary" onClick={changePassword}>
            <Icon name="lock" size={16} /> Update Password
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
function PaymentsPage({ state, updateState, currentUser, showNotification }) {
  const [tab, setTab]               = useState("payments");
  const [search, setSearch]         = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal]           = useState(null); // "add" | "confirm" | "receipt"
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState({
    studentId: "", amount: "", paymentType: "School Fees",
    description: "", session: state.currentSession,
    term: state.currentTerm, method: "Cash",
  });
  const [newType, setNewType]       = useState("");

  const payments    = state.payments     || [];
  const paymentTypes= state.paymentTypes || ["School Fees","Exam Fees","Development Levy","Uniform","Books","PTA Levy","Others"];
  const students    = state.users.filter(u => u.role === "student");

  const filtered = payments.filter(p => {
    const st = state.users.find(u => u.id === p.studentId);
    const matchSearch = !search ||
      (st?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (st?.studentId || "").toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNo?.toLowerCase().includes(search.toLowerCase());
    const matchClass  = !filterClass  || st?.classId === filterClass;
    const matchType   = !filterType   || p.paymentType === filterType;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchClass && matchType && matchStatus;
  });

  // Summary stats
  const totalCollected = payments.filter(p => p.status === "Confirmed").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending   = payments.filter(p => p.status === "Pending").reduce((s, p) => s + Number(p.amount), 0);
  const totalCount     = payments.length;
  const confirmedCount = payments.filter(p => p.status === "Confirmed").length;

  const formatMoney = (n) => "₦" + Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2 });

  const generateReceiptNo = () => {
    const d = new Date();
    return `RCT-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
  };

  const addPayment = () => {
    if (!form.studentId || !form.amount || !form.paymentType) {
      showNotification("Please fill Student, Amount and Payment Type.", "error"); return;
    }
    const payment = {
      id:          generateId(),
      receiptNo:   generateReceiptNo(),
      studentId:   form.studentId,
      amount:      Number(form.amount),
      paymentType: form.paymentType,
      description: form.description,
      session:     form.session,
      term:        form.term,
      method:      form.method,
      status:      "Pending",
      recordedBy:  currentUser.id,
      recordedByName: currentUser.name,
      createdAt:   new Date().toISOString(),
      confirmedAt: null,
      confirmedBy: null,
      confirmedByName: null,
    };
    const newAudit = [{ id: generateId(), userId: currentUser.id, userName: currentUser.name,
      action: "Payment Recorded", details: `Recorded ${formatMoney(form.amount)} ${form.paymentType} for student`,
      timestamp: new Date().toISOString() }, ...(state.auditTrail || [])];
    updateState({ payments: [...payments, payment], auditTrail: newAudit });
    setModal(null);
    setForm({ studentId:"", amount:"", paymentType:"School Fees", description:"", session:state.currentSession, term:state.currentTerm, method:"Cash" });
    showNotification("Payment recorded! Awaiting confirmation.");
  };

  const confirmPayment = (payment) => {
    const updated = payments.map(p => p.id === payment.id ? {
      ...p, status: "Confirmed",
      confirmedAt: new Date().toISOString(),
      confirmedBy: currentUser.id,
      confirmedByName: currentUser.name,
    } : p);
    const newAudit = [{ id: generateId(), userId: currentUser.id, userName: currentUser.name,
      action: "Payment Confirmed", details: `Confirmed ${formatMoney(payment.amount)} ${payment.paymentType} — ${payment.receiptNo}`,
      timestamp: new Date().toISOString() }, ...(state.auditTrail || [])];
    updateState({ payments: updated, auditTrail: newAudit });
    showNotification("Payment confirmed! Receipt is ready to print.");
    setModal(null);
  };

  const voidPayment = (payment) => {
    if (!window.confirm("Void this payment? This cannot be undone.")) return;
    const updated = payments.map(p => p.id === payment.id ? { ...p, status: "Voided" } : p);
    updateState({ payments: updated });
    showNotification("Payment voided.");
  };

  const printReceipt = (payment) => {
    const student = state.users.find(u => u.id === payment.studentId);
    const cls     = state.classes.find(c => c.id === student?.classId);
    const inst    = state.institution;

    const win = window.open("", "_blank", "width=800,height=600");
    win.document.write(`
<!DOCTYPE html><html><head>
<title>Payment Receipt — ${payment.receiptNo}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:0}
  .receipt{max-width:600px;margin:0 auto;padding:32px;border:1px solid #ddd}
  .header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px double #1a1a2e}
  .logo-row{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:8px}
  .logo-img{width:70px;height:70px;object-fit:contain}
  .school-name{font-size:22px;font-weight:800;color:#1a1a2e}
  .school-addr{font-size:12px;color:#666;margin-top:2px}
  .receipt-title{font-size:13px;font-weight:700;color:#2563EB;text-transform:uppercase;letter-spacing:2px;margin-top:8px}
  .receipt-no{font-size:11px;color:#666;margin-top:4px}
  .status-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;
    background:${payment.status==="Confirmed"?"#d1fae5":"#fef3c7"};
    color:${payment.status==="Confirmed"?"#065f46":"#92400e"};
    border:1px solid ${payment.status==="Confirmed"?"#6ee7b7":"#fcd34d"};
    margin-top:6px}
  .section{margin-bottom:18px}
  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;
    color:#2563EB;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb}
  .row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px dotted #f0f0f0}
  .row:last-child{border-bottom:none}
  .label{color:#666;flex:1}
  .value{font-weight:600;text-align:right;flex:1}
  .amount-box{background:linear-gradient(135deg,#1e3a8a,#2563EB);color:white;border-radius:10px;
    padding:16px 20px;text-align:center;margin:16px 0}
  .amount-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;opacity:0.8}
  .amount-value{font-size:28px;font-weight:900;margin-top:4px}
  .amount-words{font-size:11px;opacity:0.8;margin-top:4px;font-style:italic}
  .footer{margin-top:24px;padding-top:16px;border-top:2px solid #1a1a2e;display:flex;justify-content:space-between;align-items:flex-end}
  .sig-box{text-align:center;min-width:180px}
  .sig-line{border-top:1px solid #1a1a2e;margin-top:40px;padding-top:4px;font-size:11px;color:#666}
  .watermark{text-align:center;font-size:11px;color:#9ca3af;margin-top:16px}
  @media print{body{padding:0}button{display:none!important}.receipt{border:none}}
</style>
</head><body>
<div class="receipt">
  <div class="header">
    <div class="logo-row">
      ${inst.logo ? `<img class="logo-img" src="${inst.logo}" alt="Logo"/>` : `<div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#2563EB);display:flex;align-items:center;justify-content:center;font-size:32px">🏫</div>`}
      <div>
        <div class="school-name">${inst.name}</div>
        <div class="school-addr">${inst.address || ""}</div>
      </div>
    </div>
    <div class="receipt-title">Official Payment Receipt</div>
    <div class="receipt-no">Receipt No: <strong>${payment.receiptNo}</strong></div>
    <div><span class="status-badge">${payment.status === "Confirmed" ? "✅ CONFIRMED & PAID" : "⏳ PENDING CONFIRMATION"}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Student Information</div>
    <div class="row"><span class="label">Full Name</span><span class="value">${student?.name || "—"}</span></div>
    <div class="row"><span class="label">Registration No.</span><span class="value">${student?.studentId || "—"}</span></div>
    <div class="row"><span class="label">Class</span><span class="value">${cls?.name || "—"}</span></div>
    <div class="row"><span class="label">Session</span><span class="value">${payment.session}</span></div>
    <div class="row"><span class="label">Term</span><span class="value">${payment.term}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Payment Details</div>
    <div class="row"><span class="label">Payment Type</span><span class="value">${payment.paymentType}</span></div>
    <div class="row"><span class="label">Payment Method</span><span class="value">${payment.method}</span></div>
    <div class="row"><span class="label">Description</span><span class="value">${payment.description || "—"}</span></div>
    <div class="row"><span class="label">Date Recorded</span><span class="value">${new Date(payment.createdAt).toLocaleDateString("en-NG", {day:"numeric",month:"long",year:"numeric"})}</span></div>
    ${payment.confirmedAt ? `<div class="row"><span class="label">Date Confirmed</span><span class="value">${new Date(payment.confirmedAt).toLocaleDateString("en-NG",{day:"numeric",month:"long",year:"numeric"})}</span></div>` : ""}
    <div class="row"><span class="label">Recorded By</span><span class="value">${payment.recordedByName}</span></div>
    ${payment.confirmedByName ? `<div class="row"><span class="label">Confirmed By</span><span class="value">${payment.confirmedByName}</span></div>` : ""}
  </div>

  <div class="amount-box">
    <div class="amount-label">Amount Paid</div>
    <div class="amount-value">${formatMoney(payment.amount)}</div>
  </div>

  <div class="footer">
    <div class="sig-box">
      ${inst.signature ? `<img src="${inst.signature}" style="height:50px;object-fit:contain"/>` : "<div style='height:50px'></div>"}
      <div class="sig-line">Bursar / Cashier Signature</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:11px;color:#666">Confirmed by:</div>
      <div style="font-weight:700;font-size:13px">${payment.confirmedByName || "Pending"}</div>
      <div style="font-size:11px;color:#666;margin-top:12px">School Stamp</div>
      <div style="width:80px;height:80px;border:2px dashed #ccc;border-radius:50%;margin:4px 0 0 auto;display:flex;align-items:center;justify-content:center;font-size:10px;color:#ccc">STAMP</div>
    </div>
  </div>

  <div class="watermark">
    This receipt was generated by SARMS — ${inst.name} · ${new Date().toLocaleString("en-NG")}
    <br/>This is an official payment receipt. Keep it safe for your records.
  </div>
</div>
<script>window.print(); window.onafterprint = function(){ window.close(); };</script>
</body></html>`);
    win.document.close();
  };

  const totalByType = paymentTypes.map(type => ({
    type,
    total: payments.filter(p => p.paymentType === type && p.status === "Confirmed").reduce((s, p) => s + Number(p.amount), 0),
    count: payments.filter(p => p.paymentType === type).length,
  })).filter(t => t.count > 0);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Payment Management</div>
          <div className="section-sub">Track, confirm and print receipts</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("add")}>
          <Icon name="plus" size={16} /> Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Collected", value: formatMoney(totalCollected), color: COLORS.emerald, sub: `${confirmedCount} confirmed` },
          { label: "Pending Amount", value: formatMoney(totalPending), color: COLORS.gold, sub: `${totalCount - confirmedCount} pending` },
          { label: "Total Payments", value: totalCount, color: COLORS.blue, sub: "all records" },
          { label: "Confirmed", value: confirmedCount, color: COLORS.emerald, sub: `${totalCount > 0 ? Math.round(confirmedCount/totalCount*100) : 0}% confirmed` },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${tab === "payments" ? "active" : ""}`} onClick={() => setTab("payments")}>
          💳 All Payments
        </div>
        <div className={`tab ${tab === "summary" ? "active" : ""}`} onClick={() => setTab("summary")}>
          📊 Summary by Type
        </div>
        <div className={`tab ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
          ⚙️ Payment Types
        </div>
      </div>

      {/* PAYMENTS TAB */}
      {tab === "payments" && (
        <div>
          {/* Filters */}
          <div className="card" style={{ marginBottom: 16, padding: "14px 18px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                <Icon name="search" size={15} color={COLORS.textMuted} />
                <input placeholder="Search by name, reg no, receipt..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-input" style={{ width: "auto", minWidth: 140 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                <option value="">All Classes</option>
                {state.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="form-input" style={{ width: "auto", minWidth: 140 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                {paymentTypes.map(t => <option key={t}>{t}</option>)}
              </select>
              <select className="form-input" style={{ width: "auto", minWidth: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Voided">Voided</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">💳</div>
                <div className="empty-state-text">No payments found</div>
                <button className="btn btn-primary btn-sm" onClick={() => setModal("add")}>Record First Payment</button>
              </div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Payment Type</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Session/Term</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => {
                    const st  = state.users.find(u => u.id === p.studentId);
                    const cls = state.classes.find(c => c.id === st?.classId);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.blueLight, fontWeight: 700 }}>{p.receiptNo}</div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted }}>{new Date(p.createdAt).toLocaleDateString("en-NG")}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{st?.name || "Unknown"}</div>
                          <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{st?.studentId}</div>
                        </td>
                        <td><span className="badge badge-blue" style={{ fontSize: 11 }}>{cls?.name || "—"}</span></td>
                        <td style={{ fontSize: 13 }}>{p.paymentType}</td>
                        <td style={{ fontWeight: 700, color: COLORS.emerald, fontSize: 14 }}>{formatMoney(p.amount)}</td>
                        <td style={{ fontSize: 12, color: COLORS.textSecondary }}>{p.method}</td>
                        <td style={{ fontSize: 11, color: COLORS.textMuted }}>{p.session}<br/>{p.term}</td>
                        <td>
                          <span className={`badge ${p.status === "Confirmed" ? "badge-green" : p.status === "Voided" ? "badge-red" : "badge-gold"}`} style={{ fontSize: 11 }}>
                            {p.status === "Confirmed" ? "✅ Confirmed" : p.status === "Voided" ? "❌ Voided" : "⏳ Pending"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {p.status === "Confirmed" && (
                              <button className="btn btn-primary btn-sm" onClick={() => printReceipt(p)} title="Print Receipt">
                                🖨️ Print
                              </button>
                            )}
                            {p.status === "Pending" && (
                              <>
                                <button className="btn btn-primary btn-sm" onClick={() => { setSelected(p); setModal("confirm"); }} title="Confirm Payment">
                                  ✅ Confirm
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => voidPayment(p)} title="Void Payment">
                                  ❌
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUMMARY TAB */}
      {tab === "summary" && (
        <div className="card">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 16 }}>
            Collection Summary by Payment Type
          </div>
          {totalByType.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-text">No payments recorded yet</div></div>
          ) : (
            <div>
              {totalByType.map(({ type, total, count }) => {
                const pct = totalCollected > 0 ? Math.round(total / totalCollected * 100) : 0;
                return (
                  <div key={type} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{type}</div>
                      <div style={{ fontWeight: 700, color: COLORS.emerald }}>{formatMoney(total)}</div>
                    </div>
                    <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,var(--blue),var(--indigo))", borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{count} payment{count !== 1 ? "s" : ""} · {pct}% of total</div>
                  </div>
                );
              })}
              <div style={{ borderTop: "2px solid var(--border)", paddingTop: 16, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 700 }}>Total Collected</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.emerald }}>{formatMoney(totalCollected)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div className="card">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: COLORS.blueLight, marginBottom: 16 }}>
            Payment Types
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input className="form-input" placeholder="New payment type name..." value={newType} onChange={e => setNewType(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newType.trim()) {
                  if (!paymentTypes.includes(newType.trim())) {
                    updateState({ paymentTypes: [...paymentTypes, newType.trim()] });
                    showNotification("Payment type added!");
                  }
                  setNewType("");
                }
              }}
            />
            <button className="btn btn-primary" onClick={() => {
              if (!newType.trim()) return;
              if (!paymentTypes.includes(newType.trim())) {
                updateState({ paymentTypes: [...paymentTypes, newType.trim()] });
                showNotification("Payment type added!");
              }
              setNewType("");
            }}>
              <Icon name="plus" size={16} /> Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {paymentTypes.map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t}</span>
                <button onClick={() => {
                  if (window.confirm(`Remove "${t}" payment type?`)) {
                    updateState({ paymentTypes: paymentTypes.filter(x => x !== t) });
                  }
                }} style={{ background: "none", border: "none", color: COLORS.rose, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PAYMENT MODAL */}
      {modal === "add" && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Record New Payment</div>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Student *</label>
                <select className="form-input" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})}>
                  <option value="">— Select Student —</option>
                  {state.classes.map(cls => (
                    <optgroup key={cls.id} label={cls.name}>
                      {students.filter(s => s.classId === cls.id).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Payment Type *</label>
                  <select className="form-input" value={form.paymentType} onChange={e => setForm({...form, paymentType: e.target.value})}>
                    {paymentTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₦) *</label>
                  <input className="form-input" type="number" placeholder="e.g. 50000" value={form.amount}
                    onChange={e => setForm({...form, amount: e.target.value})} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-input" value={form.method} onChange={e => setForm({...form, method: e.target.value})}>
                    {["Cash","Bank Transfer","POS","Cheque","Online"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Term</label>
                  <select className="form-input" value={form.term} onChange={e => setForm({...form, term: e.target.value})}>
                    {state.terms.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description / Note</label>
                <input className="form-input" placeholder="Optional note..." value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, fontSize: 12, color: COLORS.gold }}>
                ⚠️ Payment will be recorded as <strong>Pending</strong> until the bursar confirms the actual cash/transfer receipt.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={addPayment}>
                <Icon name="check" size={16} /> Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM PAYMENT MODAL */}
      {modal === "confirm" && selected && (() => {
        const st  = state.users.find(u => u.id === selected.studentId);
        const cls = state.classes.find(c => c.id === st?.classId);
        return (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">Confirm Payment</div>
                <button className="modal-close" onClick={() => setModal(null)}>×</button>
              </div>
              <div className="modal-body">
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>💳</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
                    {formatMoney(selected.amount)}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textSecondary }}>{selected.paymentType}</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
                  {[
                    ["Student",     st?.name || "—"],
                    ["Reg No.",     st?.studentId || "—"],
                    ["Class",       cls?.name || "—"],
                    ["Method",      selected.method],
                    ["Receipt No.", selected.receiptNo],
                    ["Session",     selected.session],
                    ["Term",        selected.term],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dotted rgba(255,255,255,0.05)", fontSize: 13 }}>
                      <span style={{ color: COLORS.textSecondary }}>{l}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, fontSize: 13, color: COLORS.emerald }}>
                  ✅ By confirming, you certify that this payment has been physically received by the school.
                  A receipt will be generated and ready to print immediately.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  confirmPayment(selected);
                  setTimeout(() => printReceipt({ ...selected, status: "Confirmed", confirmedAt: new Date().toISOString(), confirmedByName: currentUser.name }), 500);
                }}>
                  ✅ Confirm & Print Receipt
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}


// ─── ATTENDANCE PAGE ──────────────────────────────────────────────────────────
function AttendancePage({ state, updateState, currentUser, showNotification }) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate]           = useState(today);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [tab, setTab]             = useState("mark");
  const [editTimes, setEditTimes] = useState({}); // {teacherId: {timeIn, timeOut, note}}

  const teachers    = state.users.filter(u => u.role === "teacher");
  const isPrincipal = ["principal","admin"].includes(currentUser.role);
  const isTeacher   = currentUser.role === "teacher";

  const visibleTeachers = isTeacher
    ? teachers.filter(t => t.id === currentUser.id)
    : teachers.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const dateRecords = (state.attendance || []).filter(a => a.date === date);
  const getRecord   = (teacherId) => dateRecords.find(a => a.teacherId === teacherId);

  const markAttendance = (teacherId, status, overrides = {}) => {
    const teacher  = state.users.find(u => u.id === teacherId);
    const existing = (state.attendance || []).findIndex(a => a.teacherId === teacherId && a.date === date);
    const prev     = existing >= 0 ? state.attendance[existing] : {};
    const localEdit= editTimes[teacherId] || {};
    const record   = {
      id:             prev.id || generateId(),
      teacherId,
      date,
      status,
      timeIn:         overrides.timeIn  !== undefined ? overrides.timeIn  : localEdit.timeIn  || prev.timeIn  || (status !== "Absent" ? new Date().toTimeString().slice(0,5) : ""),
      timeOut:        overrides.timeOut !== undefined ? overrides.timeOut : localEdit.timeOut || prev.timeOut || "",
      note:           overrides.note    !== undefined ? overrides.note    : localEdit.note    || prev.note    || "",
      recordedBy:     currentUser.id,
      recordedByName: currentUser.name,
      updatedAt:      new Date().toISOString(),
    };
    const newAtt = [...(state.attendance || [])];
    if (existing >= 0) newAtt[existing] = record; else newAtt.push(record);
    const newAudit = [{
      id: generateId(), userId: currentUser.id, userName: currentUser.name,
      action: "Attendance Marked",
      details: `${teacher?.name} marked ${status} for ${date}`,
      timestamp: new Date().toISOString()
    }, ...(state.auditTrail || [])];
    updateState({ attendance: newAtt, auditTrail: newAudit });
    showNotification(`${teacher?.name} marked as ${status}`);
  };

  const updateLocalEdit = (teacherId, field, value) => {
    setEditTimes(prev => ({
      ...prev,
      [teacherId]: { ...(prev[teacherId] || {}), [field]: value }
    }));
  };

  const saveTimeEdit = (teacherId) => {
    const rec = getRecord(teacherId);
    if (!rec) return;
    const local = editTimes[teacherId] || {};
    markAttendance(teacherId, rec.status, {
      timeIn:  local.timeIn  !== undefined ? local.timeIn  : rec.timeIn,
      timeOut: local.timeOut !== undefined ? local.timeOut : rec.timeOut,
      note:    local.note    !== undefined ? local.note    : rec.note,
    });
  };

  const markAllPresent = () => {
    const newAtt  = [...(state.attendance || [])];
    const now     = new Date().toTimeString().slice(0,5);
    const newAuditItems = [];
    teachers.forEach(t => {
      const existing = newAtt.findIndex(a => a.teacherId === t.id && a.date === date);
      const record = {
        id: existing >= 0 ? newAtt[existing].id : generateId(),
        teacherId: t.id, date, status: "Present",
        timeIn: now, timeOut: "", note: "",
        recordedBy: currentUser.id, recordedByName: currentUser.name,
        updatedAt: new Date().toISOString(),
      };
      if (existing >= 0) newAtt[existing] = record; else newAtt.push(record);
      newAuditItems.push({ id: generateId(), userId: currentUser.id, userName: currentUser.name,
        action: "Attendance Marked", details: `${t.name} marked Present for ${date}`,
        timestamp: new Date().toISOString() });
    });
    updateState({ attendance: newAtt, auditTrail: [...newAuditItems, ...(state.auditTrail||[])] });
    showNotification(`All ${teachers.length} teachers marked Present!`);
  };

  const history = (state.attendance || [])
    .filter(a => isTeacher ? a.teacherId === currentUser.id : true)
    .filter(a => !filterStatus || a.status === filterStatus)
    .sort((a,b) => b.date.localeCompare(a.date))
    .slice(0, 100);

  const report = teachers.map(t => {
    const recs = (state.attendance || []).filter(a => a.teacherId === t.id);
    return {
      teacher: t,
      total:   recs.length,
      present: recs.filter(a => a.status === "Present").length,
      absent:  recs.filter(a => a.status === "Absent").length,
      late:    recs.filter(a => a.status === "Late").length,
      rate:    recs.length > 0 ? Math.round(recs.filter(a => a.status !== "Absent").length / recs.length * 100) : 0,
    };
  });

  const last7 = Array.from({length:7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const dayAtt = (state.attendance||[]).filter(a => a.date === ds);
    return {
      date: ds,
      label: d.toLocaleDateString("en-NG",{weekday:"short"}),
      present: dayAtt.filter(a => a.status === "Present").length,
      absent:  dayAtt.filter(a => a.status === "Absent").length,
      late:    dayAtt.filter(a => a.status === "Late").length,
      total:   teachers.length,
    };
  });

  const StatusBtn = ({ teacherId, status, current, color, icon }) => (
    <button
      onClick={() => markAttendance(teacherId, status)}
      style={{
        padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer",
        border:`2px solid ${current === status ? color : "var(--border)"}`,
        background: current === status ? `${color}33` : "transparent",
        color: current === status ? color : COLORS.textMuted,
        transition:"all 0.15s",
      }}
    >
      {icon} {status}
    </button>
  );

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">{isTeacher ? "My Attendance" : "Staff Attendance"}</div>
          <div className="section-sub">{isTeacher ? "Your attendance history" : `${teachers.length} teachers · Daily tracking`}</div>
        </div>
        {isPrincipal && tab === "mark" && (
          <button className="btn btn-primary" onClick={markAllPresent}>
            ✅ Mark All Present
          </button>
        )}
      </div>

      <div className="tabs">
        <div className={`tab ${tab==="mark"?"active":""}`}    onClick={()=>setTab("mark")}>📋 Mark Attendance</div>
        <div className={`tab ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>📅 History</div>
        {isPrincipal && <div className={`tab ${tab==="report"?"active":""}`} onClick={()=>setTab("report")}>📊 Report</div>}
      </div>

      {/* ── MARK TAB ── */}
      {tab === "mark" && (
        <div>
          <div className="card" style={{marginBottom:16,padding:"14px 18px"}}>
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              <div>
                <label className="form-label" style={{marginBottom:4}}>Date</label>
                <input type="date" className="form-input" value={date}
                  max={today} onChange={e => { setDate(e.target.value); setEditTimes({}); }}
                  style={{maxWidth:200}} />
              </div>
              {isPrincipal && (
                <div className="search-bar" style={{flex:1,minWidth:200}}>
                  <Icon name="search" size={15} color={COLORS.textMuted}/>
                  <input placeholder="Search teacher..." value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
              )}
              <div style={{display:"flex",gap:14,fontSize:12,flexWrap:"wrap"}}>
                <span style={{color:COLORS.emerald,fontWeight:600}}>✅ {dateRecords.filter(a=>a.status==="Present").length} Present</span>
                <span style={{color:COLORS.rose,fontWeight:600}}>❌ {dateRecords.filter(a=>a.status==="Absent").length} Absent</span>
                <span style={{color:COLORS.gold,fontWeight:600}}>⏰ {dateRecords.filter(a=>a.status==="Late").length} Late</span>
                <span style={{color:COLORS.textMuted}}>❓ {Math.max(0, teachers.length - dateRecords.length)} Unmarked</span>
              </div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {visibleTeachers.map(t => {
              const rec       = getRecord(t.id);
              const localEdit = editTimes[t.id] || {};
              const timeIn    = localEdit.timeIn  !== undefined ? localEdit.timeIn  : rec?.timeIn  || "";
              const timeOut   = localEdit.timeOut !== undefined ? localEdit.timeOut : rec?.timeOut || "";
              const note      = localEdit.note    !== undefined ? localEdit.note    : rec?.note    || "";
              const borderColor = !rec ? "var(--border)"
                : rec.status==="Present" ? "rgba(16,185,129,0.35)"
                : rec.status==="Late"    ? "rgba(245,158,11,0.35)"
                : "rgba(244,63,94,0.35)";

              return (
                <div key={t.id} className="card" style={{border:`1px solid ${borderColor}`,padding:"16px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                    <div style={{width:44,height:44,borderRadius:"50%",flexShrink:0,
                      background:t.avatar?"transparent":"linear-gradient(135deg,var(--blue),var(--indigo))",
                      overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:15,fontWeight:700}}>
                      {t.avatar
                        ? <img src={t.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                        : t.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:15}}>{t.name}</div>
                      <div style={{fontSize:12,color:COLORS.textSecondary,marginTop:2}}>
                        {(t.subjects||[]).map(sid=>state.subjects.find(s=>s.id===sid)?.code).filter(Boolean).join(" · ") || "No subjects assigned"}
                      </div>
                    </div>
                    {isPrincipal ? (
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <StatusBtn teacherId={t.id} status="Present" current={rec?.status} color={COLORS.emerald} icon="✅"/>
                        <StatusBtn teacherId={t.id} status="Late"    current={rec?.status} color={COLORS.gold}   icon="⏰"/>
                        <StatusBtn teacherId={t.id} status="Absent"  current={rec?.status} color={COLORS.rose}   icon="❌"/>
                      </div>
                    ) : (
                      <div style={{padding:"6px 16px",borderRadius:20,fontSize:13,fontWeight:700,
                        color:!rec?COLORS.textMuted:rec.status==="Present"?COLORS.emerald:rec.status==="Late"?COLORS.gold:COLORS.rose,
                        background:!rec?"rgba(0,0,0,0.1)":rec.status==="Present"?"rgba(16,185,129,0.1)":rec.status==="Late"?"rgba(245,158,11,0.1)":"rgba(244,63,94,0.1)"}}>
                        {!rec?"❓ Not Marked":rec.status==="Present"?"✅ Present":rec.status==="Late"?"⏰ Late":"❌ Absent"}
                      </div>
                    )}
                  </div>

                  {rec && isPrincipal && (
                    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)",
                                 display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                      <div className="form-group" style={{margin:0,minWidth:120}}>
                        <label className="form-label" style={{fontSize:11}}>Time In</label>
                        <input type="time" className="form-input" value={timeIn}
                          onChange={e => updateLocalEdit(t.id, "timeIn", e.target.value)}
                          onBlur={() => saveTimeEdit(t.id)}
                          style={{padding:"4px 8px",fontSize:12}} />
                      </div>
                      <div className="form-group" style={{margin:0,minWidth:120}}>
                        <label className="form-label" style={{fontSize:11}}>Time Out</label>
                        <input type="time" className="form-input" value={timeOut}
                          onChange={e => updateLocalEdit(t.id, "timeOut", e.target.value)}
                          onBlur={() => saveTimeEdit(t.id)}
                          style={{padding:"4px 8px",fontSize:12}} />
                      </div>
                      <div className="form-group" style={{margin:0,flex:2,minWidth:160}}>
                        <label className="form-label" style={{fontSize:11}}>Note</label>
                        <input className="form-input" placeholder="Optional note..."
                          value={note}
                          onChange={e => updateLocalEdit(t.id, "note", e.target.value)}
                          onBlur={() => saveTimeEdit(t.id)}
                          style={{padding:"4px 8px",fontSize:12}} />
                      </div>
                    </div>
                  )}

                  {rec && isTeacher && (
                    <div style={{marginTop:10,fontSize:13,color:COLORS.textSecondary,
                                 paddingTop:10,borderTop:"1px solid var(--border)"}}>
                      {rec.timeIn  && <span>Time In: <strong>{rec.timeIn}</strong></span>}
                      {rec.timeOut && <span style={{marginLeft:16}}>Time Out: <strong>{rec.timeOut}</strong></span>}
                      {rec.note    && <span style={{marginLeft:16}}>Note: {rec.note}</span>}
                      <span style={{marginLeft:16,fontSize:11,color:COLORS.textMuted}}>
                        Recorded by {rec.recordedByName}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {visibleTeachers.length === 0 && (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-text">No teachers found</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div>
          <div className="card" style={{marginBottom:16,padding:"12px 16px"}}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <select className="form-input" style={{width:"auto",minWidth:140}}
                value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="Present">✅ Present</option>
                <option value="Late">⏰ Late</option>
                <option value="Absent">❌ Absent</option>
              </select>
              <div style={{fontSize:12,color:COLORS.textMuted}}>{history.length} records</div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-text">No attendance records yet</div>
                <div style={{fontSize:13,color:COLORS.textMuted}}>Start by marking attendance in the Mark tab</div>
              </div>
            </div>
          ) : (
            <div style={{background:"var(--card)",borderRadius:14,border:"1px solid var(--border)",overflow:"hidden"}}>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {isPrincipal && <th>Teacher</th>}
                      <th>Date</th>
                      <th>Status</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Note</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(a => {
                      const t = state.users.find(u => u.id === a.teacherId);
                      return (
                        <tr key={a.id}>
                          {isPrincipal && <td style={{fontWeight:600}}>{t?.name||"—"}</td>}
                          <td style={{fontSize:12,fontFamily:"monospace"}}>{a.date}</td>
                          <td>
                            <span className={`badge ${a.status==="Present"?"badge-green":a.status==="Late"?"badge-gold":"badge-red"}`}
                              style={{fontSize:11}}>
                              {a.status==="Present"?"✅ Present":a.status==="Late"?"⏰ Late":"❌ Absent"}
                            </span>
                          </td>
                          <td style={{fontSize:12,color:COLORS.textSecondary}}>{a.timeIn||"—"}</td>
                          <td style={{fontSize:12,color:COLORS.textSecondary}}>{a.timeOut||"—"}</td>
                          <td style={{fontSize:12,color:COLORS.textMuted,maxWidth:160}}>{a.note||"—"}</td>
                          <td style={{fontSize:11,color:COLORS.textMuted}}>{a.recordedByName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REPORT TAB (Principal/Admin only) ── */}
      {tab === "report" && isPrincipal && (
        <div>
          {/* 7-day trend */}
          <div className="card" style={{marginBottom:20}}>
            <div className="section-title" style={{marginBottom:16}}>📊 7-Day Attendance Trend</div>
            {last7.map(day => {
              const pct = day.total > 0 ? Math.round(day.present / day.total * 100) : 0;
              const barColor = pct>=80?COLORS.emerald:pct>=60?COLORS.gold:COLORS.rose;
              return (
                <div key={day.date} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13}}>
                    <span style={{fontWeight:600}}>
                      {day.label} <span style={{fontSize:11,color:COLORS.textMuted}}>{day.date}</span>
                    </span>
                    <span style={{display:"flex",gap:12,fontSize:12}}>
                      <span style={{color:COLORS.emerald}}>✅ {day.present}</span>
                      <span style={{color:COLORS.rose}}>❌ {day.absent}</span>
                      <span style={{color:COLORS.gold}}>⏰ {day.late}</span>
                      <span style={{fontWeight:800,color:barColor}}>{pct}%</span>
                    </span>
                  </div>
                  <div style={{height:10,background:"var(--border)",borderRadius:5,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:5,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Per-teacher summary */}
          <div className="card">
            <div className="section-title" style={{marginBottom:16}}>👨‍🏫 Teacher Attendance Summary</div>
            {report.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-text">No data yet — start marking attendance</div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Days Recorded</th>
                      <th>Present</th>
                      <th>Late</th>
                      <th>Absent</th>
                      <th>Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.sort((a,b)=>b.rate-a.rate).map(r => (
                      <tr key={r.teacher.id}>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
                              background:r.teacher.avatar?"transparent":"linear-gradient(135deg,var(--blue),var(--indigo))",
                              overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:11,fontWeight:700}}>
                              {r.teacher.avatar
                                ?<img src={r.teacher.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                                :r.teacher.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                            </div>
                            <span style={{fontWeight:600}}>{r.teacher.name}</span>
                          </div>
                        </td>
                        <td style={{textAlign:"center",color:COLORS.textSecondary}}>{r.total}</td>
                        <td style={{textAlign:"center",color:COLORS.emerald,fontWeight:700}}>{r.present}</td>
                        <td style={{textAlign:"center",color:COLORS.gold,fontWeight:700}}>{r.late}</td>
                        <td style={{textAlign:"center",color:COLORS.rose,fontWeight:700}}>{r.absent}</td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1,height:8,background:"var(--border)",borderRadius:4,overflow:"hidden"}}>
                              <div style={{height:"100%",width:`${r.rate}%`,borderRadius:4,
                                background:r.rate>=80?COLORS.emerald:r.rate>=60?COLORS.gold:COLORS.rose}}/>
                            </div>
                            <span style={{fontWeight:700,fontSize:13,minWidth:36,
                              color:r.rate>=80?COLORS.emerald:r.rate>=60?COLORS.gold:COLORS.rose}}>
                              {r.rate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MOUNT ────────────────────────────────────────────────────
const _root = ReactDOM.createRoot(document.getElementById('root'));
_root.render(React.createElement(SARMS));
