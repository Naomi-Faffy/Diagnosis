// Simple database operations with mock data fallback

// Mock data that will always work
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
};
