import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '../../shared/schema';

let db: ReturnType<typeof drizzle> | null = null;
let connectionAttempted = false;

function createDatabaseConnection() {
  // Don't attempt connection during build time
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL && !process.env.POSTGRES_HOST) {
    console.log('Skipping database connection during build');
    return null;
  }

  if (connectionAttempted && !db) {
    // If we already tried and failed, don't keep trying
    return null;
  }

  if (db) {
    return db;
  }

  connectionAttempted = true;

  // Try to get database URL from various possible environment variable names
  let databaseUrl = process.env.DATABASE_URL || 
                    process.env.NEON_DATABASE_URL || 
                    process.env.POSTGRES_URL ||
                    process.env.POSTGRES_CONNECTION_STRING;
  
  // If no full connection string, try to build one from individual components
  // This handles the case where Neon provides individual environment variables
  if (!databaseUrl) {
    // Try various possible environment variable names that Neon might use
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
    
    // Only build connection string if we have the essential components
    if (host && user && password) {
      databaseUrl = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
      console.log('Built database URL from individual environment variables');
    }
  } else {
    console.log('Using provided database URL');
  }
  
  if (!databaseUrl) {
    const errorMsg = 'Database configuration missing. Please ensure DATABASE_URL or individual Postgres environment variables are set.';
    console.warn(errorMsg);
    // Don't throw in build environment, just return null
    return null;
  }

  try {
    const pool = new Pool({ connectionString: databaseUrl });
    db = drizzle(pool, { schema });
    console.log('Database connection established successfully');
    return db;
  } catch (error) {
    const errorMsg = `Failed to initialize database connection: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMsg);
    // Don't throw in build environment, just return null
    return null;
  }
}

// Export a function that creates connection on demand
export function getDatabaseConnection() {
  return createDatabaseConnection();
}

// Export function to check if database is connected
export function isDatabaseConnected() {
  const connection = getDatabaseConnection();
  return connection !== null;
}

// Lazy export for backwards compatibility
export const neonDb = null; // Remove immediate connection attempt
