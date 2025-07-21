import { NextRequest, NextResponse } from 'next/server';
import { simpleDb } from '../../../lib/db-simple';
import { insertBlogPostSchema } from '../../../../shared/schema';

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    const post = await simpleDb.getBlogPost(id);
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    const body = await req.json();
    const result = insertBlogPostSchema.partial().safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Invalid blog post data', 
        details: result.error.errors 
      }, { status: 400 });
    }
    
    const post = await simpleDb.updateBlogPost(id, result.data);
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to update blog post' 
    }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid blog post ID' }, { status: 400 });
    }
    
    const deleted = await simpleDb.deleteBlogPost(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete blog post' 
    }, { status: 500 });
  }
}
