import { NextRequest, NextResponse } from 'next/server';
import { simpleDb } from '../../lib/db-simple';
import { insertBlogPostSchema } from '../../../shared/schema';

<<<<<<< HEAD
function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({
    error: message,
    timestamp: new Date().toISOString()
  }, { status });
}

=======
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
export async function GET() {
  try {
    const posts = await simpleDb.getBlogPosts();
    return NextResponse.json(posts);
<<<<<<< HEAD
  } catch (error: any) {
    console.error('Failed to fetch blog posts:', error);
    return createErrorResponse(
      'We are currently experiencing issues loading blog posts. Please try again in a moment.',
      500
    );
=======
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = insertBlogPostSchema.safeParse(body);
<<<<<<< HEAD

    if (!result.success) {
      return NextResponse.json({
        error: 'The blog post data provided is invalid. Please check all required fields and try again.',
        details: result.error.errors,
        timestamp: new Date().toISOString()
=======
    
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid blog post data', 
        details: result.error.errors 
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
      }, { status: 400 });
    }

    const post = await simpleDb.createBlogPost(result.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create blog post:', error);
<<<<<<< HEAD

    const isUserFriendly = error.name === 'DatabaseError';
    const message = isUserFriendly
      ? error.message
      : 'We encountered an issue while creating your blog post. Please try again or contact support if the problem persists.';

    return createErrorResponse(message, 500);
=======
    return NextResponse.json({ 
      error: error.message || 'Failed to create blog post' 
    }, { status: 500 });
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
  }
}
