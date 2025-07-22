import { NextRequest, NextResponse } from 'next/server';
import { simpleDb } from '../../lib/db-simple';
import { insertBlogPostSchema } from '../../../shared/schema';

function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({
    error: message,
    timestamp: new Date().toISOString()
  }, { status });
}

export async function GET() {
  try {
    const posts = await simpleDb.getBlogPosts();
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Failed to fetch blog posts:', error);
    return createErrorResponse(
      'We are currently experiencing issues loading blog posts. Please try again in a moment.',
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = insertBlogPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: 'The blog post data provided is invalid. Please check all required fields and try again.',
        details: result.error.errors,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const post = await simpleDb.createBlogPost(result.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create blog post:', error);

    const isUserFriendly = error.name === 'DatabaseError';
    const message = isUserFriendly
      ? error.message
      : 'We encountered an issue while creating your blog post. Please try again or contact support if the problem persists.';

    return createErrorResponse(message, 500);
  }
}
