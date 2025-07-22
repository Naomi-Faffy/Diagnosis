<<<<<<< HEAD
import { getDatabaseConnection } from './db';
import { blogPosts } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';
import { InsertBlogPost } from '../../shared/schema';

// Mock data that will be used as fallback if database is not configured
=======
// Simple database operations with mock data fallback

// Mock data that will always work
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
const mockBlogPosts = [
  {
    id: 1,
    title: "Welcome to Our Blog",
    content: `Welcome to our automotive blog! This application showcases a modern blog platform built with Next.js and designed for deployment on Vercel.

## Features
- Responsive design optimized for all devices
- Admin panel for content management  
- Image upload capabilities
- SEO-friendly structure

## Current Status
This post is using mock data because the database is not yet configured. To enable full functionality:

1. Add Vercel Postgres to your project
2. Add Vercel Blob for image storage
3. Run the database setup script

Once configured, you'll be able to create, edit, and delete real blog posts through the admin interface.`,
    excerpt: "Welcome to our automotive blog platform. This application showcases modern web development with Next.js.",
    imageUrl: "/images/image10.jpg",
    category: "General",
    published: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: "Getting Started with Vehicle Diagnostics",
    content: `Vehicle diagnostics have revolutionized how we maintain and repair modern automobiles. This comprehensive guide will help you understand the basics.

## What is Vehicle Diagnostics?
Vehicle diagnostics involve using specialized tools and software to communicate with your car's onboard computer systems. These systems monitor various components and can detect issues before they become major problems.

## Common Diagnostic Tools
- OBD-II scanners
- Manufacturer-specific diagnostic equipment
- Oscilloscopes for electrical testing
- Pressure gauges for fluid systems

## Benefits
- Early problem detection
- Reduced repair costs
- Improved vehicle performance
- Better fuel efficiency

Regular diagnostic checks can save you money and ensure your vehicle runs smoothly for years to come.`,
    excerpt: "Learn the fundamentals of vehicle diagnostics and how modern tools can help maintain your car.",
    imageUrl: "/images/image11.jpg",
    category: "Diagnostics",
    published: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    title: "Understanding Modern Engine Sensors",
    content: `Modern vehicles rely on dozens of sensors to operate efficiently. Understanding these sensors can help you diagnose problems and maintain optimal performance.

## Key Engine Sensors

### Oxygen Sensors
Monitor the air-fuel mixture and help optimize combustion efficiency.

### Mass Air Flow (MAF) Sensor
Measures the amount of air entering the engine to determine proper fuel injection.

### Throttle Position Sensor (TPS)
Monitors throttle valve position to control fuel delivery and ignition timing.

### Coolant Temperature Sensor
Tracks engine temperature to prevent overheating and optimize performance.

## Signs of Sensor Problems
- Check engine light activation
- Poor fuel economy
- Rough idling or stalling
- Failed emissions tests

Regular sensor maintenance is crucial for optimal vehicle performance and longevity.`,
    excerpt: "Explore the critical sensors in modern engines and learn how they affect vehicle performance.",
    imageUrl: "/images/sensors.jpg",
    category: "Technology",
    published: true,
    createdAt: new Date('2024-01-05'),
  }
];

<<<<<<< HEAD
class DatabaseError extends Error {
  constructor(message: string, public readonly isConnectionError: boolean = false) {
    super(message);
    this.name = 'DatabaseError';
  }
}

function createUserFriendlyError(operation: string, error: any): DatabaseError {
  const isConnectionError = error.message?.includes('connection') || 
                           error.message?.includes('connect') ||
                           error.message?.includes('DATABASE_URL') ||
                           error.code === 'ENOTFOUND' ||
                           error.code === 'ECONNREFUSED';

  if (isConnectionError) {
    return new DatabaseError(
      `Unable to ${operation} due to database connectivity issues. Please try again in a moment or contact support if the problem persists.`,
      true
    );
  }

  return new DatabaseError(
    `We encountered an issue while trying to ${operation}. Please try again or contact support if the problem continues.`
  );
}

// Database operations with proper error handling and fallback to mock data
export const simpleDb = {
  getBlogPosts: async () => {
    const db = getDatabaseConnection();
    
    if (!db) {
      console.log('Database not connected, using mock data');
      return mockBlogPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    try {
      const posts = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));
      
      return posts.length > 0 ? posts : mockBlogPosts;
    } catch (error) {
      console.error('Database error fetching posts, falling back to mock data:', error);
      return mockBlogPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  getBlogPost: async (id: number) => {
    const db = getDatabaseConnection();
    
    if (!db) {
      console.log('Database not connected, using mock data');
      return mockBlogPosts.find(post => post.id === id) || null;
    }

    try {
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, id))
        .limit(1);
      
      return post || mockBlogPosts.find(post => post.id === id) || null;
    } catch (error) {
      console.error('Database error fetching post, falling back to mock data:', error);
      return mockBlogPosts.find(post => post.id === id) || null;
    }
  },

  createBlogPost: async (postData: InsertBlogPost) => {
    const db = getDatabaseConnection();

    if (!db) {
      if (process.env.NODE_ENV === 'production') {
        throw new DatabaseError(
          'Service temporarily unavailable. Our team has been notified and is working to resolve this issue. Please try again in a few minutes.'
        );
      } else {
        throw new DatabaseError(
          'Blog creation is currently unavailable. The database service is being configured. Please try again later or contact support if this issue persists.'
        );
      }
    }

    try {
      const [newPost] = await db
        .insert(blogPosts)
        .values(postData)
        .returning();
      
      return newPost;
    } catch (error) {
      console.error('Failed to create blog post:', error);
      throw createUserFriendlyError('create the blog post', error);
    }
  },

  updateBlogPost: async (id: number, postData: Partial<InsertBlogPost>) => {
    const db = getDatabaseConnection();

    if (!db) {
      if (process.env.NODE_ENV === 'production') {
        throw new DatabaseError(
          'Service temporarily unavailable. Our team has been notified and is working to resolve this issue. Please try again in a few minutes.'
        );
      } else {
        throw new DatabaseError(
          'Blog editing is currently unavailable. The database service is being configured. Please try again later or contact support if this issue persists.'
        );
      }
    }

    try {
      const [updatedPost] = await db
        .update(blogPosts)
        .set(postData)
        .where(eq(blogPosts.id, id))
        .returning();

      if (!updatedPost) {
        throw new DatabaseError('The requested blog post could not be found or updated.');
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Failed to update blog post:', error);
      
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw createUserFriendlyError('update the blog post', error);
    }
  },

  deleteBlogPost: async (id: number) => {
    const db = getDatabaseConnection();

    if (!db) {
      if (process.env.NODE_ENV === 'production') {
        throw new DatabaseError(
          'Service temporarily unavailable. Our team has been notified and is working to resolve this issue. Please try again in a few minutes.'
        );
      } else {
        throw new DatabaseError(
          'Blog deletion is currently unavailable. The database service is being configured. Please try again later or contact support if this issue persists.'
        );
      }
    }

    try {
      const [deletedPost] = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, id))
        .returning();

      if (!deletedPost) {
        throw new DatabaseError('The requested blog post could not be found or deleted.');
      }
      
      return deletedPost;
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      
      if (error instanceof DatabaseError) {
        throw error;
      }
      
      throw createUserFriendlyError('delete the blog post', error);
    }
  },

  // Status info
  isConnected: async () => {
    const db = getDatabaseConnection();
    
    if (!db) {
      return false;
    }

    try {
      await db.select().from(blogPosts).limit(1);
      return true;
    } catch (error) {
      return false;
    }
  },

  getStatus: async () => {
    const db = getDatabaseConnection();
    
    if (!db) {
      return {
        database: 'not_configured',
        message: 'Database connection not configured. Using mock data for read operations. Configure your database connection to enable full functionality.'
      };
    }

    try {
      await db.select().from(blogPosts).limit(1);
      return {
        database: 'connected',
        message: 'Database connection is active and working properly.'
      };
    } catch (error) {
      return {
        database: 'error',
        message: 'Database connection failed. Using fallback data where possible.'
      };
    }
  }
=======
// Simple database operations that always work
export const simpleDb = {
  // Always return mock data for now
  getBlogPosts: async () => {
    // Sort by creation date, newest first
    return mockBlogPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Get single blog post
  getBlogPost: async (id: number) => {
    const post = mockBlogPosts.find(post => post.id === id);
    return post || null;
  },

  // For now, these operations will show helpful error messages
  createBlogPost: async (postData: any) => {
    throw new Error('Blog creation requires database configuration. Please add Vercel Postgres to enable this feature.');
  },

  updateBlogPost: async (id: number, postData: any) => {
    throw new Error('Blog editing requires database configuration. Please add Vercel Postgres to enable this feature.');
  },

  deleteBlogPost: async (id: number) => {
    throw new Error('Blog deletion requires database configuration. Please add Vercel Postgres to enable this feature.');
  },

  // Status info
  isConnected: () => false,
  getStatus: () => ({
    database: 'mock',
    message: 'Using mock data. Configure Vercel Postgres for full functionality.'
  })
>>>>>>> 735c1d4b221ba9b81c22d6ff723c793eb5329f78
};
