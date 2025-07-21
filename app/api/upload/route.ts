import { NextRequest, NextResponse } from 'next/server';

// Check if Vercel Blob is available
const isBlobAvailable = () => {
  try {
    return !!process.env.BLOB_READ_WRITE_TOKEN;
  } catch {
    return false;
  }
};

export async function POST(req: NextRequest) {
  // Check if blob storage is configured
  if (!isBlobAvailable()) {
    return NextResponse.json({ 
      error: 'Image upload service not configured. Please set up Vercel Blob storage or use direct image URLs.' 
    }, { status: 503 });
  }

  const data = await req.formData();
  const file = data.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ 
      error: 'Invalid file type. Please upload JPG, PNG, or WEBP images only.' 
    }, { status: 400 });
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return NextResponse.json({ 
      error: 'File too large. Please upload images smaller than 10MB.' 
    }, { status: 400 });
  }

  try {
    // Dynamic import of Vercel Blob to handle cases where it's not installed
    const { put } = await import('@vercel/blob');

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `blog-images/${timestamp}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Return the same format as Cloudinary for compatibility
    return NextResponse.json({
      secure_url: blob.url,
      public_id: filename,
      url: blob.url,
      bytes: file.size,
      format: file.type.split('/')[1],
      resource_type: 'image'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Check if it's a missing dependency error
    if (error.code === 'MODULE_NOT_FOUND' || error.message.includes('@vercel/blob')) {
      return NextResponse.json({ 
        error: 'Upload service not available. Please configure Vercel Blob storage.' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to upload image. Please try again or use a direct image URL.' 
    }, { status: 500 });
  }
}
