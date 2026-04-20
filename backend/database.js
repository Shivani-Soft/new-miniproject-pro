const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Transcriptions table
        db.run(`CREATE TABLE IF NOT EXISTS transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            filename TEXT,
            transcript TEXT,
            input_language TEXT,
            output_language TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating transcriptions table ' + err.message);
            } else {
                // Try to add these columns if they don't exist
                db.run('ALTER TABLE transcriptions ADD COLUMN user_id INTEGER', () => {});
                db.run('ALTER TABLE transcriptions ADD COLUMN input_language TEXT', () => {});
                db.run('ALTER TABLE transcriptions ADD COLUMN output_language TEXT', () => {});
            }
        });

        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating users table ' + err.message);
            }
        });
    }
});

module.exports = db;
