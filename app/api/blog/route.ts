import { NextRequest, NextResponse } from 'next/server';
import { simpleDb } from '../../lib/db-simple';
import { insertBlogPostSchema } from '../../../shared/schema';

export async function GET() {
  try {
    const posts = await simpleDb.getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = insertBlogPostSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid blog post data', 
        details: result.error.errors 
      }, { status: 400 });
    }

    const post = await simpleDb.createBlogPost(result.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create blog post:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create blog post' 
    }, { status: 500 });
  }
}
