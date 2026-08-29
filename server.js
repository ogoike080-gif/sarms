// ============================================================
// SARMS — server.js (Extended with Calendar and LMS APIs)
// Node.js/Express replacement for all PHP endpoints
// ============================================================

import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ───────────────────────────────────────────────────
const DB_HOST = process.env.MYSQLHOST || "localhost";
const DB_USER = process.env.MYSQLUSER || "root";
const DB_PASS = process.env.MYSQLPASSWORD || "";
const DB_NAME = process.env.MYSQLDATABASE || "sarms_db";
const DB_PORT = process.env.MYSQLPORT || 3306;
const PORT = process.env.PORT || 8080;

// ── Connection pool ──────────────────────────────────────────
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ── Initialize tables ────────────────────────────────────────
async function initializeTables() {
  try {
    // Core sarms_data table
    await pool.query(`CREATE TABLE IF NOT EXISTS sarms_data (
      slice_key   VARCHAR(60)  PRIMARY KEY,
      slice_value LONGTEXT     NOT NULL,
      updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    // Calendar events table
    await pool.query(`CREATE TABLE IF NOT EXISTS academic_calendar_events (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      session_name VARCHAR(20)  NOT NULL,
      term_name    VARCHAR(30)  NOT NULL,
      event_name   VARCHAR(150) NOT NULL,
      start_date   DATE         NOT NULL,
      end_date     DATE         NOT NULL,
      description  TEXT         NULL,
      status       ENUM('scheduled','completed','cancelled') DEFAULT 'scheduled',
      created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_event (session_name, term_name, event_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    // LMS tables
    await pool.query(`CREATE TABLE IF NOT EXISTS courses (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      class_id     INT,
      subject_id   INT,
      session_name VARCHAR(20),
      term_name    VARCHAR(30),
      teacher_id   INT,
      title        VARCHAR(200) NOT NULL,
      description  TEXT,
      is_published TINYINT DEFAULT 0,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await pool.query(`CREATE TABLE IF NOT EXISTS modules (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      course_id   INT NOT NULL,
      title       VARCHAR(200) NOT NULL,
      order_index INT DEFAULT 0,
      is_published TINYINT DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    await pool.query(`CREATE TABLE IF NOT EXISTS lessons (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      module_id   INT NOT NULL,
      title       VARCHAR(200) NOT NULL,
      order_index INT DEFAULT 0,
      is_published TINYINT DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

    console.log("✓ Database tables initialized");
  } catch (err) {
    console.error("❌ Failed to initialize tables:", err.message);
  }
}

await initializeTables();

// ── Helper functions ────────────────────────────────────────
async function readSlice(key, fallback = null) {
  try {
    const [rows] = await pool.query(
      "SELECT slice_value FROM sarms_data WHERE slice_key = ?",
      [key]
    );
    if (rows.length === 0) return fallback;
    return JSON.parse(rows[0].slice_value);
  } catch (e) {
    return fallback;
  }
}

async function writeSlice(key, value) {
  await pool.query(
    `INSERT INTO sarms_data (slice_key, slice_value)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)`,
    [key, JSON.stringify(value)]
  );
}

async function appendAudit(action, oldValue, newValue, userName) {
  try {
    const [rows] = await pool.query(
      "SELECT slice_value FROM sarms_data WHERE slice_key = 'auditTrail'"
    );
    let trail = [];
    if (rows.length > 0) {
      try {
        trail = JSON.parse(rows[0].slice_value);
      } catch (e) {
        trail = [];
      }
    }
    if (!Array.isArray(trail)) trail = [];

    trail.push({
      id: `audit_${Date.now()}`,
      userId: null,
      userName: userName || "Unknown",
      action,
      details: action,
      timestamp: new Date().toISOString(),
    });

    await writeSlice("auditTrail", trail);
  } catch (err) {
    console.error("Audit trail error:", err.message);
  }
}

function defaultState() {
  return {
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
    currentTerm: "First Term",
    resultPublished: false,
    gradingSystem: [
      { min: 70, max: 100, grade: "A", remark: "Excellent" },
      { min: 60, max: 69, grade: "B", remark: "Very Good" },
      { min: 50, max: 59, grade: "C", remark: "Good" },
      { min: 40, max: 49, grade: "D", remark: "Fair" },
      { min: 0, max: 39, grade: "F", remark: "Fail" },
    ],
    characterTraits: [
      "Punctuality",
      "Neatness",
      "Attentiveness",
      "Cooperation",
      "Honesty",
      "Respect",
      "Diligence",
    ],
    classes: [],
    subjects: [],
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
    scores: [],
    announcements: [],
    assignments: [],
    pinCodes: [],
    auditTrail: [],
    characterReports: {},
    payments: [],
    paymentTypes: [
      "School Fees",
      "Exam Fees",
      "Development Levy",
      "Uniform",
      "Books",
      "PTA Levy",
      "Others",
    ],
    attendance: [],
  };
}

// ── App setup ────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// ── /api/db.php ──────────────────────────────────────────────
app.get("/api/db.php", async (req, res) => {
  const action = req.query.action || "";
  try {
    if (action === "ping") {
      await pool.query("SELECT 1");
      return res.json({
        ok: true,
        node: process.version,
        db: DB_NAME,
        message: "SARMS database connection is working!",
      });
    }
    if (action === "load_all") {
      const defaults = defaultState();
      const result = {};
      for (const key of Object.keys(defaults)) {
        const saved = await readSlice(key);
        result[key] = saved !== null ? saved : defaults[key];
      }
      return res.json(result);
    }
    return res.status(404).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("DB Error:", err.message);
    return res.status(500).json({ error: "DB Error: " + err.message });
  }
});

app.post("/api/db.php", async (req, res) => {
  const action = req.query.action || "";
  const data = req.body?.data ?? null;
  const SAVE_MAP = {
    save_institution: "institution",
    save_users: "users",
    save_classes: "classes",
    save_subjects: "subjects",
    save_scores: "scores",
    save_announcements: "announcements",
    save_assignments: "assignments",
    save_pins: "pinCodes",
    save_audit: "auditTrail",
    save_grading: "gradingSystem",
    save_character: "characterReports",
    save_payments: "payments",
    save_payment_types: "paymentTypes",
    save_attendance: "attendance",
  };

  try {
    if (SAVE_MAP[action]) {
      if (data === null) {
        return res.status(400).json({ error: `No data provided for ${action}` });
      }
      await writeSlice(SAVE_MAP[action], data);
      return res.json({ ok: true, saved: SAVE_MAP[action] });
    }

    if (action === "save_settings") {
      if (typeof data !== "object" || data === null) {
        return res.status(400).json({ error: "No settings data provided" });
      }
      for (const k of ["sessions", "currentSession", "currentTerm", "resultPublished"]) {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
          await writeSlice(k, data[k]);
        }
      }
      return res.json({ ok: true, saved: "settings" });
    }

    if (action === "reset_all") {
      await pool.query("DELETE FROM sarms_data");
      return res.json({ ok: true, message: "All data cleared" });
    }

    return res.status(404).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("DB Error:", err.message);
    return res.status(500).json({ error: "DB Error: " + err.message });
  }
});

// ── /api/calendar.php ────────────────────────────────────────
app.get("/api/calendar.php", async (req, res) => {
  const action = req.query.action || "";
  try {
    if (action === "list") {
      const [events] = await pool.query(
        `SELECT id, session_name AS \`session\`, term_name AS term, event_name AS event,
                start_date AS start, end_date AS end, description, status
         FROM academic_calendar_events
         ORDER BY start_date ASC`
      );
      return res.json({ events });
    }

    if (action === "current") {
      const today = new Date().toISOString().split("T")[0];
      
      // Current event spanning today
      const [current] = await pool.query(
        `SELECT session_name AS \`session\`, term_name AS term, event_name AS event,
                start_date AS start, end_date AS end, description
         FROM academic_calendar_events
         WHERE status = 'scheduled' AND start_date <= ? AND end_date >= ?
         ORDER BY start_date ASC LIMIT 1`,
        [today, today]
      );

      // Next upcoming event
      const [next] = await pool.query(
        `SELECT session_name AS \`session\`, term_name AS term, event_name AS event,
                start_date AS start, end_date AS end
         FROM academic_calendar_events
         WHERE status = 'scheduled' AND start_date > ?
         ORDER BY start_date ASC LIMIT 1`,
        [today]
      );

      const daysRemaining = next[0]
        ? Math.floor(
            (new Date(next[0].start) - new Date(today)) / (1000 * 86400)
          )
        : null;

      return res.json({
        academicSession: current[0]?.session || null,
        currentTerm: current[0]?.term || null,
        currentEvent: current[0] || null,
        nextEvent: next[0] || null,
        daysRemaining,
        today,
      });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("Calendar Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/calendar.php", async (req, res) => {
  const action = req.query.action || "";
  const { id, session, term, event, start, end, description, status } = req.body || {};

  try {
    if (action === "create") {
      if (!session || !term || !event || !start || !end) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const [result] = await pool.query(
        `INSERT INTO academic_calendar_events
         (session_name, term_name, event_name, start_date, end_date, description, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [session, term, event, start, end, description || "", status || "scheduled"]
      );
      await appendAudit("Calendar event created", null, { event, session, term }, "System");
      return res.json({ ok: true, id: result.insertId });
    }

    if (action === "update") {
      if (!id) return res.status(400).json({ error: "Missing event id" });
      await pool.query(
        `UPDATE academic_calendar_events
         SET session_name = ?, term_name = ?, event_name = ?, start_date = ?, end_date = ?, description = ?, status = ?
         WHERE id = ?`,
        [session, term, event, start, end, description || "", status || "scheduled", id]
      );
      await appendAudit("Calendar event updated", null, { event, session, term }, "System");
      return res.json({ ok: true });
    }

    if (action === "delete") {
      if (!id) return res.status(400).json({ error: "Missing event id" });
      await pool.query("DELETE FROM academic_calendar_events WHERE id = ?", [id]);
      await appendAudit("Calendar event deleted", null, null, "System");
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("Calendar Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── /api/lms.php (Minimal stubs for now) ────────────────────
app.get("/api/lms.php", async (req, res) => {
  const action = req.query.action || "";
  try {
    // Return empty results for LMS endpoints to prevent 404 errors
    if (action === "list_courses") {
      return res.json({ courses: [] });
    }
    if (action === "get_course") {
      return res.json({ course: null });
    }
    if (action === "list_modules") {
      return res.json({ modules: [] });
    }
    if (action === "list_lessons") {
      return res.json({ lessons: [] });
    }
    if (action === "list_enrollments") {
      return res.json({ enrollments: [] });
    }
    if (action === "get_student_progress") {
      return res.json({ progress: null });
    }
    if (action === "list_upcoming_lessons") {
      return res.json({ lessons: [] });
    }
    if (action === "list_pending_assignments") {
      return res.json({ assignments: [] });
    }
    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("LMS Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/lms.php", async (req, res) => {
  const action = req.query.action || "";
  try {
    if (action === "create_course") {
      return res.json({ ok: true, id: 1 });
    }
    if (action === "enroll_student") {
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (err) {
    console.error("LMS Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── Static frontend ──────────────────────────────────────────
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 SARMS server running on port ${PORT}`);
});
