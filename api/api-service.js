// api-service.js — DB.PHP VERSION (SIMPLIFIED)

const API = "http://localhost/sarms/api/db.php";

// ─── Core fetch ───────────────────────────────────────────────
async function request(action, data = null) {
  const url = `${API}?action=${action}`;

const API_URL = "http://localhost/sarms-react/api";

  const res = await fetch(url, {
    method: data ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify({ data }) : null,
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("❌ Not JSON:", text);
    throw new Error("Invalid JSON response");
  }
}

// ─── Global state cache ───────────────────────────────────────
let STATE = null;

// ─── Load everything ──────────────────────────────────────────
export async function loadAll() {
  STATE = await request("load_all");
  return STATE;
}

// ─── Save helpers ─────────────────────────────────────────────
export async function saveUsers(users) {
  return request("save_users", users);
}

export async function saveClasses(classes) {
  return request("save_classes", classes);
}

export async function saveSubjects(subjects) {
  return request("save_subjects", subjects);
}

export async function saveScores(scores) {
  return request("save_scores", scores);
}

export async function saveSettings(settings) {
  return request("save_settings", settings);
}

export async function saveInstitution(data) {
  return request("save_institution", data);
}

export async function saveAnnouncements(data) {
  return request("save_announcements", data);
}

export async function saveAssignments(data) {
  return request("save_assignments", data);
}

export async function resetAll() {
  return request("reset_all");
}

// ─── Auth (simple local version) ──────────────────────────────
export function login(email, password) {
  const user = STATE.users.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) throw new Error("Invalid login");
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem("user");
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}