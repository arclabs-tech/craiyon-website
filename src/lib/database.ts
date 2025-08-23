import { Kysely, SqliteDialect, sql } from 'kysely';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

interface Database {
  users: {
    id: number;
    username: string;
    password: string;
    total_score: number;
    created_at: string;
  };
  challenges: {
    id: number;
    image_url: string;
    prompt: string;
    created_at: string;
  };
  submissions: {
    id: number;
    user_id: number;
    challenge_id: number;
    generated_image_url: string;
    user_prompt: string;
    score: number;
    created_at: string;
  };
  submission_counts: {
    id: number;
    user_id: number;
    challenge_id: number;
    attempts_used: number;
    created_at: string;
    updated_at: string;
  };
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'craiyon.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(dbPath);
// Improve concurrency for multiple users: enable WAL and set a busy timeout
try {
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('busy_timeout = 5000');
  sqlite.pragma('synchronous = NORMAL');
} catch (_e) {
  // ignore pragma errors in environments that don't support them
}

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: sqlite,
  }),
});

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table
    await db.schema
      .createTable('users')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('username', 'text', (col) => col.notNull().unique())
      .addColumn('password', 'text', (col) => col.notNull())
      .addColumn('total_score', 'integer', (col) => col.notNull().defaultTo(0))
  .addColumn('created_at', 'text', (col) => col.notNull().defaultTo(sql`(CURRENT_TIMESTAMP)`))
      .execute();

    // Create challenges table
    await db.schema
      .createTable('challenges')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('image_url', 'text', (col) => col.notNull())
      .addColumn('prompt', 'text', (col) => col.notNull())
  .addColumn('created_at', 'text', (col) => col.notNull().defaultTo(sql`(CURRENT_TIMESTAMP)`))
      .execute();

    // Create submissions table
    await db.schema
      .createTable('submissions')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('user_id', 'integer', (col) => col.notNull())
      .addColumn('challenge_id', 'integer', (col) => col.notNull())
      .addColumn('generated_image_url', 'text', (col) => col.notNull())
      .addColumn('user_prompt', 'text', (col) => col.notNull())
      .addColumn('score', 'real', (col) => col.notNull())
  .addColumn('created_at', 'text', (col) => col.notNull().defaultTo(sql`(CURRENT_TIMESTAMP)`))
      .execute();

    // Create submission counts table
    await db.schema
      .createTable('submission_counts')
      .ifNotExists()
      .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
      .addColumn('user_id', 'integer', (col) => col.notNull())
      .addColumn('challenge_id', 'integer', (col) => col.notNull())
      .addColumn('attempts_used', 'integer', (col) => col.notNull().defaultTo(0))
  .addColumn('created_at', 'text', (col) => col.notNull().defaultTo(sql`(CURRENT_TIMESTAMP)`))
  .addColumn('updated_at', 'text', (col) => col.notNull().defaultTo(sql`(CURRENT_TIMESTAMP)`))
      .execute();

    // Ensure uniqueness on (user_id, challenge_id) to prevent duplicate rows
    await db.schema
      .createIndex('uniq_submission_counts_user_challenge')
      .on('submission_counts')
      .columns(['user_id', 'challenge_id'])
      .unique()
      .ifNotExists()
      .execute();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
} 