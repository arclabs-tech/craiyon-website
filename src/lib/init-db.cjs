const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'craiyon.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Pre-generated challenge images and prompts
const challenges = [
  {
    image_url: '/images/1.png',
    prompt: 'Happy Dog'
  },
  {
    image_url: '/images/2.png', 
    prompt: 'Space'
  },
  {
    image_url: '/images/3.png',
    prompt: 'Food'
  },
  {
    image_url: '/images/4.png',
    prompt: 'The Throne'
  },
  {
    image_url: '/images/5.png',
    prompt: 'Vibes'
  },
  {
    image_url: '/images/6.png',
    prompt: 'Red Aura'
  }
];

// Initialize database tables
function initializeDatabase() {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        total_score INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create challenges table
    db.exec(`
      CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        prompt TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create submissions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id INTEGER NOT NULL,
        generated_image_url TEXT NOT NULL,
        user_prompt TEXT NOT NULL,
        score REAL NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Create submission counts table to track attempts per user per challenge
    db.exec(`
      CREATE TABLE IF NOT EXISTS submission_counts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id INTEGER NOT NULL,
        attempts_used INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, challenge_id)
      )
    `);

    // Create generated_images table
    db.exec(`
      CREATE TABLE IF NOT EXISTS generated_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        prompt TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Create users from SEAT 1 to 200
function createUsers() {
  try {
    // Check if users already exist
    const existingUsers = db.prepare('SELECT id FROM users LIMIT 1').all();
    if (existingUsers.length > 0) {
      console.log('Users already exist, skipping creation');
      return;
    }

    const insertUser = db.prepare(`
      INSERT INTO users (username, password, total_score) 
      VALUES (?, ?, ?)
    `);

    // Create 3 groups of users: suffixes _1, _2, _3
    // Username pattern: SEAT{NNN}_{group} where NNN = 001..200
    // Password pattern: S{group}_{index} e.g. S1_1 for SEAT001_1
    for (let group = 1; group <= 3; group++) {
      for (let i = 1; i <= 200; i++) {
        const username = `SEAT${i.toString().padStart(3, '0')}_${group}`;
        const password = `S${group}_${i}`;
        insertUser.run(username, password, 0);
      }
    }
    
    console.log('Users created successfully');
  } catch (error) {
    console.log('Error creating users:', error);
  }
}

// Create challenges
function createChallenges() {
  try {
    // Check if challenges already exist
    const existingChallenges = db.prepare('SELECT id FROM challenges LIMIT 1').all();
    if (existingChallenges.length > 0) {
      console.log('Challenges already exist, skipping creation');
      return;
    }

    const insertChallenge = db.prepare(`
      INSERT INTO challenges (image_url, prompt) 
      VALUES (?, ?)
    `);

    challenges.forEach(challenge => {
      insertChallenge.run(challenge.image_url, challenge.prompt);
    });

    console.log('Challenges created successfully');
  } catch (error) {
    console.log('Error creating challenges:', error);
  }
}

function initializeApp() {
  initializeDatabase();
  createUsers();
  createChallenges();
  db.close();
}

module.exports = { initializeApp }; 