const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'devtrack.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create necessary tables
    db.serialize(() => {
      // Developers / Roles table (to extend Gitea user data)
      db.run(`CREATE TABLE IF NOT EXISTS developers (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        role TEXT,
        department TEXT,
        status TEXT
      )`);

      // Attendance logs table
      db.run(`CREATE TABLE IF NOT EXISTS attendance_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        type TEXT NOT NULL, -- 'check-in' or 'check-out'
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }
});

module.exports = db;
