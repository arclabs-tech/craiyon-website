const { execSync } = require('child_process');

console.log('🚀 Setting up Craiyon Challenge...');

try {
  // Initialize database
  console.log('📊 Initializing database...');
  execSync('curl -X POST http://localhost:3000/api/init', { stdio: 'inherit' });
  
  console.log('✅ Setup completed successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Make sure your database is running');
  console.log('2. Set up your environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
  console.log('3. Start the development server: npm run dev');
  console.log('4. Visit http://localhost:3000 to access the application');
  console.log('');
  console.log('👥 Login credentials:');
  console.log('- Username: SEAT001, SEAT002, ..., SEAT200');
  console.log('- Password: S1, S2, ..., S200');
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('');
  console.log('💡 Make sure:');
  console.log('1. The development server is running (npm run dev)');
  console.log('2. Your database is properly configured');
  console.log('3. All environment variables are set');
} 