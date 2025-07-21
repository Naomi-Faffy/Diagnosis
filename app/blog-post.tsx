import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useParams } from "wouter";
import { Calendar, Clock, ArrowLeft, Share2, MessageSquare, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const params = useParams();
  const postId = params?.id ? parseInt(params.id) : null;

   const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", postId],
    queryFn: async () => {
      if (!postId) throw new Error("No post ID provided");
      const response = await fetch(`/api/blog/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
    enabled: !!postId,
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Blog Post Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <article className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary" className="bg-orange-500 text-white border-0">
                {post.category}
              </Badge>
              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-900 dark:text-blue-100 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light mb-8">
              {post.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="relative w-full overflow-hidden rounded-xl mb-8 shadow-2xl">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto max-h-[600px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80';
                }}
                loading="lazy"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-xl dark:prose-invert max-w-none">
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {post.content && post.content.split('\n').map((paragraph, index) => {
                // Skip empty paragraphs
                if (paragraph.trim() === '') {
                  return <div key={index} className="h-6"></div>;
                }

                return (
                  <p key={index} className="mb-8 text-lg leading-9 text-justify font-light tracking-wide">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Simple Share and Contact Section */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              {/* Share */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">
                  Share This Article
                </h3>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const shareText = `Check out: "${post.title}" - ${window.location.href}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      const toast = document.createElement('div');
                      toast.textContent = '✅ Link copied!';
                      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
                      document.body.appendChild(toast);
                      setTimeout(() => document.body.removeChild(toast), 2000);
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* Contact */}
              <div className="text-right">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">
                  Need Help?
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>Harare: +263 242 770 389</p>
                  <p>Bulawayo: +263 292 883 884</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}