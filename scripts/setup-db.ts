import { Client } from 'pg';

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Neon requires SSL
  });

  try {
    await client.connect();
    console.log('Setting up database tables...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    // Create blog_posts table
    await client.query(`
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
    `);

    // Insert default admin user (password: admin123)
    // Make sure to hash your password properly in production!
    await client.query(`
      INSERT INTO users (username, password)
      VALUES ('admin', '$2b$10$8K1p/1DwTJ6GdgqUB3LJO.rGwUgr4Vm5TLh7v5kUYOX2o8xH1jX2a')
      ON CONFLICT (username) DO NOTHING;
    `);

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
