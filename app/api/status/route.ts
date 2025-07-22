import { NextResponse } from 'next/server';

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    services: {
      database: {
        configured: !!(process.env.POSTGRES_URL || process.env.DATABASE_URL),
        type: process.env.POSTGRES_URL ? 'vercel-postgres' : 'unknown'
      },
      blob: {
        configured: !!process.env.BLOB_READ_WRITE_TOKEN,
        type: 'vercel-blob'
      },
      admin: {
        configured: !!process.env.ADMIN_PASSWORD,
        defaultPassword: process.env.ADMIN_PASSWORD === 'admin123'
      }
    },
    deployment: {
      vercel: !!process.env.VERCEL,
      region: process.env.VERCEL_REGION || 'unknown'
    }
  };

  return NextResponse.json(status);
}
