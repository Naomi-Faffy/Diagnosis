import { NextResponse } from 'next/server';

export async function GET() {
  const isDatabaseConfigured = !!process.env.DATABASE_URL;

  const status = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    services: {
      database: {
        configured: isDatabaseConfigured,
        type: isDatabaseConfigured ? 'neon-postgres' : 'none',
      },
      blob: {
        configured: !!process.env.BLOB_READ_WRITE_TOKEN,
        type: 'vercel-blob',
      },
      admin: {
        configured: !!process.env.ADMIN_PASSWORD,
        defaultPassword: process.env.ADMIN_PASSWORD === 'admin123',
      },
    },
    deployment: {
      vercel: !!process.env.VERCEL,
      region: process.env.VERCEL_REGION || 'unknown',
    },
  };

  return NextResponse.json(status);
}
