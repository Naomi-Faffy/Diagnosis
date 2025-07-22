"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2, MessageSquare, Phone, Clipboard as ClipboardIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";

// Function to render content with basic markdown-like formatting
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '') {
      elements.push(<div key={i} className="h-4"></div>);
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mb-4 mt-8">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      // Look ahead to collect all list items
      const listItems = [line];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
        i++;
        listItems.push(lines[i].trim());
      }
      elements.push(
        <ul key={i} className="list-disc list-inside mb-6 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-gray-700 leading-relaxed">
              {item.replace('- ', '')}
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <p key={i} className="mb-6 text-gray-700 leading-relaxed text-lg">
          {line}
        </p>
      );
    }
  }
  
  return elements;
}

export default function BlogPostPage() {
  const params = useParams();
  const postId = params?.id ? parseInt(params.id as string) : null;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", postId],
    queryFn: async () => {
      if (!postId) throw new Error("No post ID provided");
      const response = await fetch(`/api/blog/${postId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch post: ${response.status} ${errorText}`);
      }
      return response.json();
    },
    enabled: !!postId,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error ? `Error: ${error.message}` : "The blog post you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/blog">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-orange)] px-8 py-6">
            <Link href="/blog" className="inline-flex items-center space-x-2 text-white hover:text-gray-100 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
            
            <div className="mb-4">
              <Badge className="bg-white/20 text-white border-0 px-4 py-1">
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-orbitron font-black text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed font-light mb-6">
              {post.excerpt}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              {post.content ? renderContent(post.content) : (
                <p className="text-gray-700 leading-relaxed">
                  No content available for this post.
                </p>
              )}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Share This Article
                  </h3>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        const shareUrl = window.location.href;
                        const shareText = `${post.title}\n\n${post.excerpt}\n\nRead more: ${shareUrl}`;
                        
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: post.title,
                              text: post.excerpt,
                              url: shareUrl,
                            });
                          } catch (err) {
                            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                          }
                        } else {
                          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href);
                          showToast('Link copied to clipboard!');
                        } catch (err) {
                          showToast('Failed to copy link');
                        }
                      }}
                    >
                      <ClipboardIcon className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Need Help?
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-end space-x-2">
                      <Phone className="w-4 h-4 text-[var(--brand-orange)]" />
                      <a href="tel:+263242770389" className="text-gray-600 hover:text-[var(--brand-orange)] transition-colors">
                        +263 242 770 389
                      </a>
                    </div>
                    <div className="flex items-center justify-center md:justify-end space-x-2">
                      <MessageSquare className="w-4 h-4 text-[var(--brand-blue)]" />
                      <a href="https://wa.me/+263719974846" className="text-gray-600 hover:text-[var(--brand-blue)] transition-colors">
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts or Back to Blog */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <Link href="/blog">
            <Button size="lg" className="bg-gradient-to-r from-[var(--brand-orange)] to-red-500 hover:from-red-500 hover:to-[var(--brand-orange)] text-white font-orbitron font-bold px-8 py-4">
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to All Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
