import { db, initializeDatabase } from './database';

// Pre-generated challenge images and prompts
const challenges = [
  {
    image_url: '/images/1.png',
    prompt: 'A majestic dragon flying over a medieval castle at sunset'
  },
  {
    image_url: '/images/2.png', 
    prompt: 'A futuristic cityscape with flying cars and neon lights'
  },
  {
    image_url: '/images/3.png',
    prompt: 'A serene forest with a magical glowing tree in the center'
  },
  {
    image_url: '/images/4.png',
    prompt: 'A steampunk robot playing chess in a Victorian library'
  },
  {
    image_url: '/images/5.png',
    prompt: 'A beautiful underwater palace with mermaids and coral gardens'
  },
  {
    image_url: '/images/6.png',
    prompt: 'A space station orbiting Earth with astronauts floating outside'
  }
];

// Create users from SEAT 1 to 200
async function createUsers() {
  try {
    // Check if users already exist
    const existingUsers = await db.selectFrom('users').select(['id']).limit(1).execute();
    if (existingUsers.length > 0) {
      console.log('Users already exist, skipping creation');
      return;
    }

    const users = [];
    for (let i = 1; i <= 200; i++) {
      users.push({
        username: `SEAT${i.toString().padStart(3, '0')}`,
        password: `S${i}`,
        total_score: 0
      });
    }
    
    // Insert users in batches to avoid SQLite limitations
    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await db.insertInto('users').values(batch).execute();
    }
    
    console.log('Users created successfully');
  } catch (error) {
    console.log('Error creating users:', error);
  }
}

// Create challenges
async function createChallenges() {
  try {
    // Check if challenges already exist
    const existingChallenges = await db.selectFrom('challenges').select(['id']).limit(1).execute();
    if (existingChallenges.length > 0) {
      console.log('Challenges already exist, skipping creation');
      return;
    }

    await db.insertInto('challenges').values(challenges).execute();
    console.log('Challenges created successfully');
  } catch (error) {
    console.log('Error creating challenges:', error);
  }
}

export async function initializeApp() {
  await initializeDatabase();
  await createUsers();
  await createChallenges();
} 