import { Kysely, sql, Generated } from 'kysely';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';

interface Database {
  users: {
    id: Generated<number>;
    username: string;
    password: string;
    total_score: number;
    created_at: Generated<string>;
  };
  challenges: {
    id: Generated<number>;
    image_url: string;
    prompt: string;
    created_at: Generated<string>;
  };
  submissions: {
    id: Generated<number>;
    user_id: number;
    challenge_id: number;
    generated_image_url: string;
    user_prompt: string;
    score: number;
    created_at: Generated<string>;
  };
  submission_counts: {
    id: Generated<number>;
    user_id: number;
    challenge_id: number;
    attempts_used: number;
    created_at: Generated<string>;
    updated_at: Generated<string>;
  };
  generated_images: {
    id: Generated<number>;
    user: string;
    prompt: string;
    url: string;
    created_at: Generated<string>;
  };
  image_votes: {
    id: Generated<number>;
    image_id: number; // references generated_images.id
    user_id: number; // references users.id
    created_at: Generated<string>;
  };
  pg_tables: {
    schemaname: string;
    tablename: string;
    tableowner: string;
    tablespace: string | null;
    hasindexes: boolean;
    hasrules: boolean;
    hastriggers: boolean;
    rowsecurity: boolean;
  };
}

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
});

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool
  }),
});

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table
    await db.schema
      .createTable('users')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('username', 'text', (col) => col.notNull().unique())
      .addColumn('password', 'text', (col) => col.notNull())
      .addColumn('total_score', 'integer', (col) => col.notNull().defaultTo(0))
      .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // Create challenges table
    await db.schema
      .createTable('challenges')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('image_url', 'text', (col) => col.notNull())
      .addColumn('prompt', 'text', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // Create submissions table
    await db.schema
      .createTable('submissions')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id'))
      .addColumn('challenge_id', 'integer', (col) => col.notNull().references('challenges.id'))
      .addColumn('generated_image_url', 'text', (col) => col.notNull())
      .addColumn('user_prompt', 'text', (col) => col.notNull())
      .addColumn('score', 'real', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // Create submission counts table
    await db.schema
      .createTable('submission_counts')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id'))
      .addColumn('challenge_id', 'integer', (col) => col.notNull().references('challenges.id'))
      .addColumn('attempts_used', 'integer', (col) => col.notNull().defaultTo(0))
      .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // Create generated_images table
    await db.schema
      .createTable('generated_images')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('user', 'text', (col) => col.notNull())
      .addColumn('prompt', 'text', (col) => col.notNull())
      .addColumn('url', 'text', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // Create image_votes table (simple upvote system with toggle per user per image)
    await db.schema
      .createTable('image_votes')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('image_id', 'integer', (col) => col.notNull().references('generated_images.id'))
      .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id'))
      .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
      .execute();

    // Uniqueness constraint so a user can only vote once per image
    await db.schema
      .createIndex('uniq_image_votes_image_user')
      .on('image_votes')
      .columns(['image_id', 'user_id'])
      .unique()
      .ifNotExists()
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

// Insert a generated image record
export async function saveGeneratedImage({ user, prompt, url }: { user: string; prompt: string; url: string }) {
  const [id] = await db.insertInto('generated_images')
    .values({ user, prompt, url })
    .returning('id')
    .execute();

  return id;
}