import { simpleDb } from '../app/lib/db-simple';

async function verifyDeployment() {
  console.log('🔍 Verifying deployment configuration...\n');
  
  try {
    // Check database status
    console.log('1. Checking database connection...');
    const status = await simpleDb.getStatus();
    console.log(`   Status: ${status.database}`);
    console.log(`   Message: ${status.message}\n`);
    
    // Test reading blog posts
    console.log('2. Testing blog post retrieval...');
    const posts = await simpleDb.getBlogPosts();
    console.log(`   ✅ Successfully retrieved ${posts.length} blog posts\n`);
    
    // Test if database is connected for write operations
    const isConnected = await simpleDb.isConnected();
    if (isConnected) {
      console.log('3. Database write operations: ✅ Available');
      console.log('   - Blog creation: Enabled');
      console.log('   - Blog editing: Enabled');
      console.log('   - Blog deletion: Enabled');
    } else {
      console.log('3. Database write operations: ⚠️  Limited');
      console.log('   - Blog creation: Disabled (fallback mode)');
      console.log('   - Blog editing: Disabled (fallback mode)');
      console.log('   - Blog deletion: Disabled (fallback mode)');
      console.log('   - Blog reading: ✅ Available (using mock data)');
    }
    
    console.log('\n✅ Deployment verification completed!');
    
    if (!isConnected) {
      console.log('\n⚠️  Note: Database connection not available.');
      console.log('   Please ensure your environment variables are properly configured:');
      console.log('   - DATABASE_URL (preferred) or');
      console.log('   - Individual POSTGRES_* variables');
    }
    
  } catch (error) {
    console.error('❌ Deployment verification failed:', error);
    process.exit(1);
  }
}

verifyDeployment();
