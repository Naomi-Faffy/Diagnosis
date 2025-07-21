import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // Validate password input
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Add a small delay to prevent brute force attacks
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password === adminPassword) {
      // Generate a more secure session token
      const sessionToken = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2)}-${Math.random().toString(36).substr(2)}`;
      
      return NextResponse.json({ 
        success: true, 
        token: sessionToken 
      });
    } else {
      // Log failed attempts (in production, use proper logging)
      console.warn(`Failed admin login attempt at ${new Date().toISOString()}`);
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
