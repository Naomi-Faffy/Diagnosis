// Safe database operations with fallbacks
import * as schema from '../../shared/schema';

// Check if database is available
const isDatabaseAvailable = () => {
  try {
    return !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
  } catch {
    return false;
  }
};

// Create database instance with error handling
let db: any = null;

// Only import and setup database if environment variables are available
if (isDatabaseAvailable()) {
  try {
    // Dynamic import to avoid build errors when Vercel services aren't available
    import('drizzle-orm/vercel-postgres').then(({ drizzle }) => {
      import('@vercel/postgres').then(({ sql }) => {
        db = drizzle(sql, { schema });
      }).catch(err => {
        console.warn('Failed to import @vercel/postgres:', err);
        db = null;
      });
    }).catch(err => {
      console.warn('Failed to import drizzle-orm/vercel-postgres:', err);
      db = null;
    });
  } catch (error) {
    console.warn('Database connection setup failed:', error);
    db = null;
  }
}

// Mock data for when database is unavailable
const mockBlogPosts = [
  {
    id: 1,
    title: "Welcome to Our Blog",
    content: "This is a sample blog post. The database is not configured yet, so this is mock data. To enable full functionality, please configure Vercel Postgres in your deployment settings.",
    excerpt: "Sample blog post with mock data while database is being set up.",
    imageUrl: "/images/image10.jpg",
    category: "General",
    published: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Getting Started Guide",
    content: "Learn how to configure your database and start creating real blog posts. This application uses Vercel Postgres for data storage and Vercel Blob for image uploads.",
    excerpt: "A guide to help you set up your blog with proper database configuration.",
    imageUrl: "/images/image11.jpg",
    category: "Tutorial",
    published: true,
    createdAt: new Date(),
  }
];

// Safe database operations
export const safeDb = {
  // Check if database is connected
  isConnected: () => db !== null,

  // Get blog posts with fallback
  getBlogPosts: async () => {
    if (!db) {
      console.warn('Database not available, returning mock data');
      return mockBlogPosts;
    }
    
    try {
      const posts = await db.select().from(schema.blogPosts).orderBy(schema.blogPosts.createdAt);
      return posts;
    } catch (error) {
      console.error('Database query failed:', error);
      return mockBlogPosts;
    }
  },

  // Get single blog post with fallback
  getBlogPost: async (id: number) => {
    if (!db) {
      const mockPost = mockBlogPosts.find(post => post.id === id);
      return mockPost || null;
    }
    
    try {
      // Use proper drizzle syntax
      const posts = await db.select().from(schema.blogPosts).where(schema.blogPosts.id.eq ? schema.blogPosts.id.eq(id) : schema.blogPosts.id === id);
      return posts[0] || null;
    } catch (error) {
      console.error('Database query failed:', error);
      const mockPost = mockBlogPosts.find(post => post.id === id);
      return mockPost || null;
    }
  },

  // Create blog post with fallback
  createBlogPost: async (postData: any) => {
    if (!db) {
      throw new Error('Database not available. Please configure Vercel Postgres to create blog posts.');
    }
    
    try {
      const inserted = await db.insert(schema.blogPosts).values(postData).returning();
      return inserted[0];
    } catch (error) {
      console.error('Database insert failed:', error);
      throw new Error('Failed to create blog post. Database error.');
    }
  },

  // Update blog post with fallback
  updateBlogPost: async (id: number, postData: any) => {
    if (!db) {
      throw new Error('Database not available. Please configure Vercel Postgres to update blog posts.');
    }
    
    try {
      const whereClause = schema.blogPosts.id.eq ? schema.blogPosts.id.eq(id) : schema.blogPosts.id === id;
      const updated = await db.update(schema.blogPosts).set(postData).where(whereClause).returning();
      return updated[0];
    } catch (error) {
      console.error('Database update failed:', error);
      throw new Error('Failed to update blog post. Database error.');
    }
  },

  // Delete blog post with fallback
  deleteBlogPost: async (id: number) => {
    if (!db) {
      throw new Error('Database not available. Please configure Vercel Postgres to delete blog posts.');
    }
    
    try {
      const whereClause = schema.blogPosts.id.eq ? schema.blogPosts.id.eq(id) : schema.blogPosts.id === id;
      const deleted = await db.delete(schema.blogPosts).where(whereClause).returning();
      return deleted[0];
    } catch (error) {
      console.error('Database delete failed:', error);
      throw new Error('Failed to delete blog post. Database error.');
    }
  }
};

export { db };
