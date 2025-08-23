const { initializeApp } = require('../src/lib/init-db.cjs');

console.log('🚀 Initializing Craiyon Challenge Database...');

try {
  initializeApp();
  
  console.log('✅ Database initialized successfully!');
  console.log('');
  console.log('📝 Database is ready!');
  console.log('👥 200 users created (SEAT001-SEAT200)');
  console.log('🖼️  6 challenges created');
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('- Username: SEAT001, SEAT002, ..., SEAT200');
  console.log('- Password: S1, S2, ..., S200');
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