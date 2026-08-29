// ============================================================
// SARMS — Express API Server (Node.js replacement for db.php)
// ============================================================

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ── Config ──────────────────────────────────────────────────
const DB_CONFIG = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'sarms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Initialize DB pool ──────────────────────────────────────
async function initDb() {
  try {
    pool = await mysql.createPool(DB_CONFIG);
    const connection = await pool.getConnection();
    
    // Auto-create the storage table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sarms_data (
        slice_key   VARCHAR(60)  PRIMARY KEY,
        slice_value LONGTEXT     NOT NULL,
        updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    connection.release();
    console.log('✓ Database connected and initialized');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

// ── Helper functions ───────────────────────────────────────
async function readSlice(key, defaultValue = null) {
  try {
    const [rows] = await pool.execute(
      'SELECT slice_value FROM sarms_data WHERE slice_key = ?',
      [key]
    );
    if (rows.length > 0) {
      return JSON.parse(rows[0].slice_value);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading slice "${key}":`, error.message);
    return defaultValue;
  }
}

async function writeSlice(key, value) {
  try {
    await pool.execute(
      `INSERT INTO sarms_data (slice_key, slice_value)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE slice_value = VALUES(slice_value)`,
      [key, JSON.stringify(value)]
    );
  } catch (error) {
    console.error(`Error writing slice "${key}":`, error.message);
    throw error;
  }
}

function getDefaultState() {
  return {
    institution: {
      name: 'My School',
      address: '',
      principal: '',
      principalComment: '',
      logo: null,
      signature: null,
    },
    sessions: ['2024/2025'],
    currentSession: '2024/2025',
    currentTerm: 'First Term',
    resultPublished: false,
    gradingSystem: [
      { min: 70, max: 100, grade: 'A', remark: 'Excellent' },
      { min: 60, max: 69, grade: 'B', remark: 'Very Good' },
      { min: 50, max: 59, grade: 'C', remark: 'Good' },
      { min: 40, max: 49, grade: 'D', remark: 'Fair' },
      { min: 0, max: 39, grade: 'F', remark: 'Fail' },
    ],
    characterTraits: [
      'Punctuality', 'Neatness', 'Attentiveness',
      'Cooperation', 'Honesty', 'Respect', 'Diligence'
    ],
    classes: [],
    subjects: [],
    users: [{
      id: 'admin_1',
      role: 'admin',
      name: 'Administrator',
      email: 'admin@school.com',
      password: 'admin@2024',
      avatar: null,
    }],
    scores: [],
    announcements: [],
    assignments: [],
    pinCodes: [],
    auditTrail: [],
    characterReports: {},
    payments: [],
    paymentTypes: ['School Fees', 'Exam Fees', 'Development Levy', 'Uniform', 'Books', 'PTA Levy', 'Others'],
    attendance: [],
  };
}

// ── Routes ──────────────────────────────────────────────────

// PING — Test that everything works
app.get('/api/db.php', async (req, res) => {
  if (req.query.action === 'ping') {
    try {
      const connection = await pool.getConnection();
      connection.release();
      return res.json({
        ok: true,
        node: process.version,
        db: DB_CONFIG.database,
        host: DB_CONFIG.host,
        message: 'SARMS database connection is working!',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: error.message,
      });
    }
  }

  // LOAD ALL — Called once when React app starts
  if (req.query.action === 'load_all') {
    try {
      const defaults = getDefaultState();
      const result = {};
      for (const key of Object.keys(defaults)) {
        const saved = await readSlice(key);
        result[key] = saved !== null ? saved : defaults[key];
      }
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Unknown action on GET
  return res.status(400).json({ error: 'Invalid action or use POST for data operations' });
});

// POST endpoint for save operations
app.post('/api/db.php', async (req, res) => {
  const { action, data } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'No action provided' });
  }

  // Save single slices
  const saveMap = {
    'save_institution': 'institution',
    'save_users': 'users',
    'save_classes': 'classes',
    'save_subjects': 'subjects',
    'save_scores': 'scores',
    'save_announcements': 'announcements',
    'save_assignments': 'assignments',
    'save_pins': 'pinCodes',
    'save_audit': 'auditTrail',
    'save_grading': 'gradingSystem',
    'save_character': 'characterReports',
    'save_payments': 'payments',
    'save_payment_types': 'paymentTypes',
    'save_attendance': 'attendance',
  };

  if (saveMap[action]) {
    if (data === undefined) {
      return res.status(400).json({ error: `No data provided for ${action}` });
    }
    try {
      await writeSlice(saveMap[action], data);
      return res.json({ ok: true, saved: saveMap[action] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Save multiple settings at once
  if (action === 'save_settings') {
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'No settings data provided' });
    }
    try {
      for (const k of ['sessions', 'currentSession', 'currentTerm', 'resultPublished']) {
        if (k in data) {
          await writeSlice(k, data[k]);
        }
      }
      return res.json({ ok: true, saved: 'settings' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Reset all data
  if (action === 'reset_all') {
    try {
      await pool.execute('DELETE FROM sarms_data');
      return res.json({ ok: true, message: 'All data cleared' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Unknown action
  return res.status(404).json({ error: `Unknown action: ${action}` });
});

// Serve static frontend from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ── Error handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 8080;

(async () => {
  await initDb();
  app.listen(PORT, () => {
    console.log(`✓ SARMS API server running on port ${PORT}`);
  });
})();

