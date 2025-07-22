<<<<<<< HEAD
import { Pool } from '@neondatabase/serverless';
=======
import { sql } from '@vercel/postgres';
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
<<<<<<< HEAD
    // Get database URL from various possible environment variable names
    let databaseUrl = process.env.DATABASE_URL || 
                      process.env.NEON_DATABASE_URL || 
                      process.env.POSTGRES_URL ||
                      process.env.POSTGRES_CONNECTION_STRING;
    
    // If no full connection string, try to build one from individual components
    if (!databaseUrl) {
      const host = process.env.POSTGRES_HOST || 
                   process.env.PGHOST || 
                   process.env.NEON_HOST;
      
      const database = process.env.POSTGRES_DATABASE || 
                       process.env.PGDATABASE || 
                       process.env.NEON_DATABASE || 
                       'neondb';
      
      const user = process.env.POSTGRES_USER || 
                   process.env.PGUSER || 
                   process.env.NEON_USER || 
                   'neondb_owner';
      
      const password = process.env.POSTGRES_PASSWORD || 
                       process.env.PGPASSWORD || 
                       process.env.NEON_PASSWORD;
      
      const port = process.env.POSTGRES_PORT || 
                   process.env.PGPORT || 
                   process.env.NEON_PORT || 
                   '5432';
      
      if (host && user && password) {
        databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
        console.log('Built database URL from individual environment variables');
      }
    } else {
      console.log('Using provided database URL');
    }
    
    if (!databaseUrl) {
      throw new Error('Database configuration missing. Please ensure DATABASE_URL or individual Postgres environment variables are set.');
    }
    
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Test connection first
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    // Create users table
    console.log('Creating users table...');
    await pool.query(`
=======
    // Create users table
    await sql`
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
<<<<<<< HEAD
    `);
    
    // Create blog_posts table
    console.log('Creating blog_posts table...');
    await pool.query(`
=======
    `;
    
    // Create blog_posts table
    await sql`
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        image_url TEXT,
        category TEXT NOT NULL,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
<<<<<<< HEAD
    `);

    // Insert a default admin user (password: admin123)
    // In production, change this password!
    console.log('Creating default admin user...');
    await pool.query(`
      INSERT INTO users (username, password) 
      VALUES ('admin', '$2b$10$8K1p/1DwTJ6GdgqUB3LJO.rGwUgr4Vm5TLh7v5kUYOX2o8xH1jX2a')
      ON CONFLICT (username) DO NOTHING;
    `);

    await pool.end();
    console.log('✅ Database setup completed successfully!');
    console.log('📝 Default admin credentials: username="admin", password="admin123"');
    console.log('⚠️  Please change the default password in production!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check your database environment variables in Vercel');
    console.error('   2. Ensure your Neon database is accessible');
    console.error('   3. Verify your connection string format');
=======
    `;

    // Insert a default admin user (password: admin123)
    // In production, change this password!
    await sql`
      INSERT INTO users (username, password) 
      VALUES ('admin', '$2b$10$8K1p/1DwTJ6GdgqUB3LJO.rGwUgr4Vm5TLh7v5kUYOX2o8xH1jX2a')
      ON CONFLICT (username) DO NOTHING;
    `;

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
    process.exit(1);
  }
}

setupDatabase();
