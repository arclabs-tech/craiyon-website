const { initializeApp } = require('../src/lib/init-db.cjs');

console.log('🚀 Initializing Craiyon Challenge Database...');

try {
  initializeApp();
  
  console.log('✅ Database initialized successfully!');
  console.log('');
  console.log('📝 Database is ready!');
    console.log('👥 600 users created (SEAT001_1-SEAT200_3)');
  console.log('🖼️  6 challenges created');
  console.log('');
  console.log('🔑 Login credentials:');
    console.log('- Usernames: SEAT001_1, SEAT002_1, ..., SEAT200_1 and same for _2 and _3');
    console.log('- Passwords: S1_1 .. S1_200 for _1, S2_1 .. S2_200 for _2, S3_1 .. S3_200 for _3');
  console.log('');
  console.log('🚀 Start the server with: npm run dev');
  console.log('🌐 Visit: http://localhost:3000');
  
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
  console.log('');
  console.log('💡 Make sure:');
  console.log('1. All dependencies are installed (npm install)');
  console.log('2. You have write permissions in the project directory');
} 