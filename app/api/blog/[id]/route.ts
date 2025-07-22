import { NextRequest, NextResponse } from 'next/server';
import { simpleDb } from '../../../lib/db-simple';
import { insertBlogPostSchema } from '../../../../shared/schema';

function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({
    error: message,
    timestamp: new Date().toISOString()
  }, { status });
}

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return createErrorResponse('The blog post ID provided is not valid. Please check the URL and try again.', 400);
    }

    const post = await simpleDb.getBlogPost(id);
    if (!post) {
      return createErrorResponse('The requested blog post could not be found.', 404);
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Failed to fetch blog post:', error);
    return createErrorResponse(
      'We are currently experiencing issues loading this blog post. Please try again in a moment.',
      500
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return createErrorResponse('The blog post ID provided is not valid. Please check the URL and try again.', 400);
    }

    const body = await req.json();
    const result = insertBlogPostSchema.partial().safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: 'The blog post data provided is invalid. Please check all fields and try again.',
        details: result.error.errors,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const post = await simpleDb.updateBlogPost(id, result.data);
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Failed to update blog post:', error);

    const isUserFriendly = error.name === 'DatabaseError';
    const message = isUserFriendly
      ? error.message
      : 'We encountered an issue while updating your blog post. Please try again or contact support if the problem persists.';

    return createErrorResponse(message, 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return createErrorResponse('The blog post ID provided is not valid. Please check the URL and try again.', 400);
    }

    const deleted = await simpleDb.deleteBlogPost(id);
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Failed to delete blog post:', error);

    const isUserFriendly = error.name === 'DatabaseError';
    const message = isUserFriendly
      ? error.message
      : 'We encountered an issue while deleting the blog post. Please try again or contact support if the problem persists.';

    return createErrorResponse(message, 500);
  }
}
