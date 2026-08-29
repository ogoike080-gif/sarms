// ============================================================
// SARMS — server.js
// Node.js/Express replacement for api/db.php
// Serves the built React frontend and exposes the /api/db.php
// endpoints backed by Railway MySQL.
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

// ── Auto-create storage table ────────────────────────────────
async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS sarms_data (
    slice_key   VARCHAR(60)  PRIMARY KEY,
    slice_value LONGTEXT     NOT NULL,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

ensureTable().catch((err) => {
  console.error("❌ Failed to ensure sarms_data table exists:", err.message);
});

// ── Helpers ──────────────────────────────────────────────────
async function readSlice(key, fallback = null) {
  const [rows] = await pool.query(
    "SELECT slice_value FROM sarms_data WHERE slice_key = ?",
    [key]
  );
  if (rows.length === 0) return fallback;
  try {
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
    gradingComments: {},
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

// ── App setup ────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// ── GET /api/db.php ──────────────────────────────────────────
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

// ── POST /api/db.php ─────────────────────────────────────────
app.post("/api/db.php", async (req, res) => {
  const action = req.query.action || "";
  const data = req.body?.data ?? null;

  try {
    if (SAVE_MAP[action]) {
      if (data === null) {
        return res
          .status(400)
          .json({ error: "No data provided for " + action });
      }
      await writeSlice(SAVE_MAP[action], data);
      return res.json({ ok: true, saved: SAVE_MAP[action] });
    }

    if (action === "save_settings") {
      if (typeof data !== "object" || data === null) {
        return res.status(400).json({ error: "No settings data provided" });
      }
      const keys = [
        "sessions",
        "currentSession",
        "currentTerm",
        "resultPublished",
      ];
      for (const k of keys) {
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
