import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (token && token.length > 10) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
} 