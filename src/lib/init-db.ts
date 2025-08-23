import { db, initializeDatabase } from './database';

// Pre-generated challenge images and prompts
const challenges = [
  {
    image_url: '/images/1.png',
    prompt: 'A majestic dragon flying over a medieval castle at sunset',
  },
  {
    image_url: '/images/2.png',
    prompt: 'A futuristic cityscape with flying cars and neon lights',
  },
  {
    image_url: '/images/3.png',
    prompt: 'A serene forest with a magical glowing tree in the center',
  },
  {
    image_url: '/images/4.png',
    prompt: 'A steampunk robot playing chess in a Victorian library',
  },
  {
    image_url: '/images/5.png',
    prompt: 'A beautiful underwater palace with mermaids and coral gardens',
  },
  {
    image_url: '/images/6.png',
    prompt: 'A space station orbiting Earth with astronauts floating outside',
  },
];

async function createUsers() {
  // Check if users already exist
  const existing = await db.selectFrom('users').select('id').limit(1).execute();
  if (existing.length > 0) return;

  // Insert 200 users SEAT001..SEAT200 with passwords S1..S200
  const values = Array.from({ length: 200 }, (_, i) => {
    const n = i + 1;
    const username = `SEAT${String(n).padStart(3, '0')}`;
    const password = `S${n}`;
    return { username, password, total_score: 0 } as const;
  });

  // Kysely doesn't have bulk insert for sqlite; perform batched inserts
  for (const v of values) {
    await db
      .insertInto('users')
      .values({ username: v.username, password: v.password, total_score: v.total_score })
      .execute();
  }
}

async function createChallenges() {
  const existing = await db.selectFrom('challenges').select('id').limit(1).execute();
  if (existing.length > 0) return;

  for (const c of challenges) {
    await db.insertInto('challenges').values({ image_url: c.image_url, prompt: c.prompt }).execute();
  }
}

export async function initializeApp() {
  try {
    await initializeDatabase();
    await createUsers();
    await createChallenges();
  } catch (err) {
    console.error('Initialization error:', err);
    throw err;
  }
}
