import { defineConfig } from "drizzle-kit";

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
  }
}

if (!databaseUrl) {
  throw new Error("Database configuration missing. Please ensure DATABASE_URL or individual Postgres environment variables are set.");
=======
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
<<<<<<< HEAD
    url: databaseUrl,
=======
    url: process.env.DATABASE_URL,
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
  },
});
