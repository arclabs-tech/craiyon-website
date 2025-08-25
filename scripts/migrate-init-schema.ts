import { sql } from 'kysely';
import { db } from '../src/lib/database';

/**
 * Migration script to initialize the PostgreSQL database schema.
 * Mirrors the logic in initializeDatabase().
 */
export async function up() {
  // Create users table
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('username', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('total_score', 'real', (col) => col.notNull().defaultTo(0))
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

  // Create submission_counts table
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

  // Create image_votes table
  await db.schema
    .createTable('image_votes')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('image_id', 'integer', (col) => col.notNull().references('generated_images.id'))
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id'))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  // Ensure uniqueness on (user_id, challenge_id) in submission_counts
  await db.schema
    .createIndex('uniq_submission_counts_user_challenge')
    .on('submission_counts')
    .columns(['user_id', 'challenge_id'])
    .unique()
    .ifNotExists()
    .execute();

  // Ensure uniqueness on (image_id, user_id) for image_votes
  await db.schema
    .createIndex('uniq_image_votes_image_user')
    .on('image_votes')
    .columns(['image_id', 'user_id'])
    .unique()
    .ifNotExists()
    .execute();

  // Seed users if not present
  await createUsers();
  // Seed challenges if not present
  await createChallenges();
}
// Create users: 3 variants per seat (SEAT001_1..SEAT200_3) with matching passwords
async function createUsers() {
  const existing = await db.selectFrom('users').select('id').limit(1).execute();
  if (existing.length > 0) {
    console.log('Users already exist, skipping creation');
    return;
  }
  const groups = [1, 2, 3];
  const users = [];
  for (let i = 1; i <= 200; i++) {
    const pad = i.toString().padStart(3, '0');
    for (const g of groups) {
      const username = `SEAT${pad}_${g}`;
      const password = `S${pad}_${g}`;
      users.push({ username, password, total_score: 0 });
    }
  }
  await db.insertInto('users').values(users).execute();
  console.log('Users created successfully (3 variants per seat)');
}

// Pre-generated challenge images and prompts
const challengesSeed = [
  { image_url: '/images/1.png', prompt: 'Happy Dog' },
  { image_url: '/images/2.png', prompt: 'Space' },
  { image_url: '/images/3.png', prompt: 'Food' },
  { image_url: '/images/4.png', prompt: 'The Throne' },
  { image_url: '/images/5.png', prompt: 'Vibes' },
  { image_url: '/images/6.png', prompt: 'Red Aura' },
];

// Create challenges
async function createChallenges() {
  const existing = await db.selectFrom('challenges').select('id').limit(1).execute();
  if (existing.length > 0) {
    console.log('Challenges already exist, skipping creation');
    return;
  }
  await db.insertInto('challenges').values(challengesSeed).execute();
  console.log('Challenges created successfully');
}

export async function down() {
  // Drop tables in reverse order to handle dependencies
  await db.schema.dropIndex('uniq_submission_counts_user_challenge').ifExists().execute();
  await db.schema.dropIndex('uniq_image_votes_image_user').ifExists().execute();
  await db.schema.dropTable('image_votes').ifExists().execute();
  await db.schema.dropTable('generated_images').ifExists().execute();
  await db.schema.dropTable('submission_counts').ifExists().execute();
  await db.schema.dropTable('submissions').ifExists().execute();
  await db.schema.dropTable('challenges').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}

// To run: import and call up() for migration, down() for rollback.
if (require.main === module) {
  up().then(() => {
    console.log('Migration completed');
    process.exit(0);
  }).catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
}