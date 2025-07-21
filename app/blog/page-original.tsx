"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Phone, MapPin, Wrench, Battery, Zap, Home, Settings, User, MessageSquare, Plus, Edit3, Trash2, Eye, EyeOff, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Logo from "@/components/logo";
import FloatingNavigation from "@/components/floating-navigation";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

// Image declarations

export default function BlogPage() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<Partial<InsertBlogPost>>({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    category: "",
    published: true,
  });

  const queryClient = useQueryClient();

  // Check admin session on component mount
  useEffect(() => {
    const checkAdminSession = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          const response = await fetch("/api/admin/verify", {
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (response.ok) {
            setIsAdminMode(true);
          } else {
            localStorage.removeItem("admin_token");
          }
        } catch (error) {
          localStorage.removeItem("admin_token");
        }
      }
    };
    checkAdminSession();
  }, []);

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (post: InsertBlogPost) => {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      // Close dialog and reset form
      setIsCreateDialogOpen(false);
      setEditingPost(null);
      resetForm();
      // Show success message
      const toast = document.createElement('div');
      toast.textContent = '✅ Blog post created successfully!';
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    },
    onError: (error: Error) => {
      console.error('Create post error:', error);
      // Show detailed error message
      const toast = document.createElement('div');
      toast.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-red-600 text-sm">✕</span>
          </div>
          <div>
            <div class="font-semibold text-red-800">Failed to create blog post</div>
            <div class="text-red-700 text-sm mt-1">${error.message}</div>
          </div>
        </div>
      `;
      toast.className = 'fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-md';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 5000);
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...post }: Partial<BlogPost>) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      setEditingPost(null);
      resetForm();
      setIsCreateDialogOpen(false);
      // Show success message
      const toast = document.createElement('div');
      toast.textContent = '✅ Blog post updated successfully!';
      toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    },
    onError: (error: Error) => {
      console.error('Update post error:', error);
      // Show detailed error message
      const toast = document.createElement('div');
      toast.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-red-600 text-sm">✕</span>
          </div>
          <div>
            <div class="font-semibold text-red-800">Failed to update blog post</div>
            <div class="text-red-700 text-sm mt-1">${error.message}</div>
          </div>
        </div>
      `;
      toast.className = 'fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-md';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 5000);
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      category: "",
      published: true,
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("admin_token", token);
        setIsAdminMode(true);
        setShowPasswordDialog(false);
        setAdminPassword("");

        // Show success message
        const toast = document.createElement('div');
        toast.textContent = '🔓 Admin access granted';
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
      } else {
        alert("Incorrect password. Please contact administrator.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPG, PNG, or WEBP images.');
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('Image size should be less than 5MB.');
        e.target.value = '';
        return;
      }

      setImageFile(file);
      setImagePreview('');
      setFormData({ ...formData, imageUrl: '' });

      // Upload to Cloudinary
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataObj,
        });
        const data = await res.json();
        if (res.ok && data.secure_url) {
          setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
          setImagePreview(data.secure_url);
        } else {
          // Professional toast for upload error
          const toast = document.createElement('div');
          toast.textContent = data.error || 'Image upload failed.';
          toast.setAttribute('role', 'status');
          toast.setAttribute('aria-live', 'polite');
          toast.className = 'fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold text-base transition-all duration-300 opacity-0 pointer-events-none';
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.pointerEvents = 'auto';
          }, 10);
          setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.pointerEvents = 'none';
            setTimeout(() => document.body.removeChild(toast), 300);
          }, 2500);
        }
      } catch (err) {
        // Professional toast for upload error
        const toast = document.createElement('div');
        toast.textContent = 'Image upload failed.';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.className = 'fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold text-base transition-all duration-300 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '1';
          toast.style.pointerEvents = 'auto';
        }, 10);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.pointerEvents = 'none';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 2500);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation only
    if (!formData.title?.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!formData.content?.trim()) {
      alert("Please enter content.");
      return;
    }

    if (!formData.excerpt?.trim()) {
      alert("Please enter an excerpt.");
      return;
    }

    // Prepare final data
    const finalData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim(),
      category: formData.category?.trim() || "General",
      imageUrl: formData.imageUrl?.trim() || "",
      published: formData.published ?? true
    };

    if (editingPost) {
      updatePostMutation.mutate({ ...finalData, id: editingPost.id });
    } else {
      createPostMutation.mutate(finalData as InsertBlogPost);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl || "",
      category: post.category,
      published: post.published,
    });
    setImagePreview(post.imageUrl || "");
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--brand-orange)]"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 via-white to-gray-300">
      {/* Navigation */}
      <FloatingNavigation />

      <div className="container mx-auto px-9 py-20">

        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-full px-8 py-4 mb-8 shadow-md border border-[var(--brand-blue)]/20">
            <div className="w-3 h-3 bg-[var(--brand-orange)] rounded-full"></div>
            <span className="text-gray-700 font-orbitron font-bold text-sm tracking-widest uppercase">
              Latest Blog Posts & Updates
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-orbitron font-black text-gray-900 mb-4">
            Blog & Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights, tips and news.
          </p>
        </div>

        {/* Admin Controls */}
        {isAdminMode && (
          <div className="mb-8 bg-gradient-to-r from-[var(--brand-blue)]/10 via-white to-[var(--brand-orange)]/10 rounded-3xl p-8 border-2 border-gray-200 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 space-y-4 lg:space-y-0">
              <div>
                <h3 className="font-orbitron font-bold text-2xl text-gray-900 flex items-center">
                  ⚡ Content Management Dashboard
                </h3>
                <p className="text-gray-600 mt-2">Create, edit, and manage your blog posts with ease</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-[var(--brand-orange)] to-red-500 hover:from-red-500 hover:to-[var(--brand-orange)] text-white font-orbitron font-bold px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => {
                      setEditingPost(null);
                      resetForm();
                    }}
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    ✨ Create New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white">
                  <DialogHeader className="pb-6 border-b border-gray-200">
                    <DialogTitle className="font-orbitron text-2xl text-center bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-orange)] bg-clip-text text-transparent">
                      {editingPost ? "✏️ Edit Blog Post" : "✨ Create New Blog Post"}
                    </DialogTitle>
                    <p className="text-center text-gray-600 mt-2">
                      {editingPost ? "Update your existing blog post" : "Add a new blog post to share with your audience"}
                    </p>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-8 pt-6">
                    {/* Basic Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-orbitron font-bold text-lg mb-4 text-gray-800 flex items-center">
                        📝 Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                            Post Title *
                          </Label>
                          <Input
                            id="title"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Enter a compelling and descriptive title"
                            className="h-12 text-base border-2 border-gray-200 focus:border-[var(--brand-orange)] transition-colors"
                          />
                          <p className="text-xs text-gray-500">This will be the main headline of your blog post</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                            Category *
                          </Label>
                          <Input
                            id="category"
                            value={formData.category || ""}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            placeholder="e.g., Hybrid Technology, Diesel Systems"
                            className="h-12 text-base border-2 border-gray-200 focus:border-[var(--brand-orange)] transition-colors"
                          />
                          <p className="text-xs text-gray-500">Choose a relevant category for better organization</p>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-orbitron font-bold text-lg mb-4 text-gray-800 flex items-center">
                        📄 Content
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">
                            Short Description (Excerpt) *
                          </Label>
                          <Textarea
                            id="excerpt"
                            value={formData.excerpt || ""}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            required
                            rows={4}
                            placeholder="Write a brief, engaging summary (2-3 sentences) that will appear on the blog listing page"
                            className="text-base border-2 border-gray-200 focus:border-[var(--brand-orange)] transition-colors resize-none"
                          />
                          <p className="text-xs text-gray-500">This summary helps readers decide if they want to read the full post</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
                            Full Article Content *
                          </Label>
                          <Textarea
                            id="content"
                            value={formData.content || ""}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            rows={12}
                            placeholder="Write your complete blog post content here. Include detailed information, tips, and insights that will be valuable to your readers..."
                            className="text-base border-2 border-gray-200 focus:border-[var(--brand-orange)] transition-colors resize-none"
                          />
                          <p className="text-xs text-gray-500">Write detailed, informative content that provides value to your readers</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Section */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-orbitron font-bold text-lg mb-4 text-gray-800 flex items-center">
                        🖼️ Featured Image
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-gray-700">
                                Upload Image File
                              </Label>
                              <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="cursor-pointer h-12 border-2 border-dashed border-gray-300 hover:border-[var(--brand-orange)] transition-colors"
                              />
                              <p className="text-xs text-gray-500">Upload JPG, PNG, or WEBP images (recommended size: 800x600px)</p>
                            </div>

                            <div className="text-center text-gray-400 font-semibold">OR</div>

                            <div className="space-y-2">
                              <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-700">
                                Image URL
                              </Label>
                              <Input
                                id="imageUrl"
                                value={formData.imageUrl || ""}
                                onChange={(e) => {
                                  setFormData({ ...formData, imageUrl: e.target.value });
                                  setImagePreview(e.target.value);
                                }}
                                placeholder="https://images.unsplash.com/photo-..."
                                className="h-12 text-base border-2 border-gray-200 focus:border-[var(--brand-orange)] transition-colors"
                              />
                              <p className="text-xs text-gray-500">Paste a direct link to an image from the web</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">
                              Image Preview
                            </Label>
                            <div className="border-2 border-gray-200 rounded-lg h-48 flex items-center justify-center bg-gray-50">
                              {imagePreview ? (
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800";
                                  }}
                                />
                              ) : (
                                <div className="text-center text-gray-400">
                                  <div className="text-4xl mb-2">🖼️</div>
                                  <p className="text-sm">No image selected</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Publishing Options */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-gray-200">
                      <h3 className="font-orbitron font-bold text-lg mb-4 text-gray-800 flex items-center">
                        🚀 Publishing Options
                      </h3>
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                        <Switch
                          id="published"
                          checked={formData.published ?? true}
                          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                          className="data-[state=checked]:bg-[var(--brand-orange)]"
                        />
                        <div className="flex-1">
                          <Label htmlFor="published" className="text-base font-semibold text-gray-700 cursor-pointer">
                            {formData.published ? "✅ Published (Visible to visitors)" : "📝 Draft (Hidden from visitors)"}
                          </Label>
                          <p className="text-sm text-gray-500 mt-1">
                            {formData.published 
                              ? "This post will be visible on your blog page" 
                              : "This post will be saved as a draft and won't be visible to visitors"
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsCreateDialogOpen(false);
                          setEditingPost(null);
                          resetForm();
                        }}
                        className="px-8 py-3 text-base border-2 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="px-8 py-3 text-base bg-gradient-to-r from-[var(--brand-orange)] to-red-500 hover:from-red-500 hover:to-[var(--brand-orange)] text-white font-orbitron font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                        disabled={createPostMutation.isPending || updatePostMutation.isPending}
                      >
                        {createPostMutation.isPending || updatePostMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>{editingPost ? "Updating..." : "Creating..."}</span>
                          </div>
                        ) : (
                          <>
                            {editingPost ? "💾 Update Post" : "✨ Create Post"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Create Posts</h4>
                </div>
                <p className="text-sm text-gray-600">Add new blog posts with rich content and images</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Edit Existing</h4>
                </div>
                <p className="text-sm text-gray-600">Click the edit button on any post to modify it</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Delete Posts</h4>
                </div>
                <p className="text-sm text-gray-600">Remove unwanted posts with confirmation dialog</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-800">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">Important Note</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">All changes are saved immediately. There's no undo function, so please review carefully before saving.</p>
            </div>
          </div>
        )}

        {/* Admin Toggle */}
        <div className="fixed top-24 right-8 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
                localStorage.removeItem("admin_token");

                // Show logout message
                const toast = document.createElement('div');
                toast.textContent = '🔒 Admin mode disabled';
                toast.className = 'fixed top-4 right-4 bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                document.body.appendChild(toast);
                setTimeout(() => {
                  toast.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(toast), 300);
                }, 2000);
              } else {
                setShowPasswordDialog(true);
              }
            }}
            className="bg-white/90 backdrop-blur-sm border-[var(--brand-blue)]/20 hover:bg-[var(--brand-orange)]/10"
          >
            {isAdminMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Exit Admin
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </>
            )}
          </Button>
        </div>

        {/* Admin Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-gray-50 border-2 border-[var(--brand-blue)]/20">
            <DialogHeader className="text-center pb-6">
              <DialogTitle className="font-orbitron text-2xl bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-orange)] bg-clip-text text-transparent">
                🔐 Admin Access Required
              </DialogTitle>
              <p className="text-gray-600 mt-2">Enter your administrator credentials to manage blog content</p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Administrative privileges required</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">You need admin access to create, edit, or delete blog posts</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="admin-password" className="text-sm font-semibold text-gray-700">
                  Admin Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="h-12 text-base text-center border-2 border-gray-200 focus:border-[var(--brand-orange)] transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAdminLogin();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 text-center">
                  Contact the system administrator if you've forgotten your password
                </p>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setAdminPassword("");
                  }}
                  className="px-8 py-3 border-2 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdminLogin}
                  className="px-8 py-3 bg-gradient-to-r from-[var(--brand-blue)] to-blue-600 hover:from-blue-600 hover:to-[var(--brand-blue)] text-white font-orbitron font-bold transform hover:scale-105 transition-all duration-200"
                >
                  🚀 Login
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card  
              key={post.id}
              className="group bg-white backdrop-blur-sm border border-gray-200 shadow-lg overflow-hidden transition-all duration-300 transform"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-card overflow-hidden">
                  <img
                    src={post.imageUrl || "/images/image10.jpg"}
                    alt={post.title}
                    className="responsive-image group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60"></div>

                  {/* Admin Controls */}
                  {isAdminMode && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 backdrop-blur-sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50/90 backdrop-blur-sm border-red-200 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-2 border-red-200 shadow-2xl">
                          <AlertDialogHeader className="text-center pb-4">
                            <AlertDialogTitle className="font-orbitron text-xl text-gray-900 flex items-center justify-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </div>
                              <span>Delete Blog Post</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 text-base mt-3">
                              Are you sure you want to permanently delete <strong>"{post.title}"</strong>? 
                              <br />
                              <span className="text-red-600 font-medium">This action cannot be undone.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-2 text-red-800">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm font-medium">Warning</span>
                            </div>
                            <p className="text-xs text-red-700 mt-1">
                              This blog post will be permanently removed from your website and cannot be recovered.
                            </p>
                          </div>
                          <AlertDialogFooter className="space-x-4">
                            <AlertDialogCancel className="px-6 py-3 border-2 border-gray-200 hover:bg-gray-50 font-orbitron">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deletePostMutation.mutate(post.id)}
                              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-orbitron font-bold transform hover:scale-105 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Post
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-[var(--brand-orange)] to-orange-500 text-white border-0">
                      {post.category}
                    </Badge>
                  </div>

                  {/* Service Icon */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-[var(--brand-orange)] to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Wrench size={20} className="text-white" />
                    </div>
                  </div>


                </div>
              </CardHeader>
              <CardContent className="p-6 relative">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-blue)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Title */}
                <h2 className="font-orbitron text-xl font-bold mb-4 transition-all duration-300 text-gray-900 group-hover:text-[var(--brand-orange)] line-clamp-2">
                  {post.title}
                </h2>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed font-light transition-colors duration-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-500 hover:text-[var(--brand-orange)] transition-colors duration-300">
                    <div className="w-1 h-1 bg-[var(--brand-orange)] rounded-full mr-2"></div>
                    <span className="font-medium">Full article with detailed guide available</span>
                    <div className="flex-1 mx-3 border-t border-dotted border-gray-300"></div>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[var(--brand-orange)]" />
                    <span>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recently posted"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-2 hover:text-[var(--brand-orange)] transition-all duration-300 cursor-pointer">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">5 min read</span>
                    </div>
                    <div className="flex items-center space-x-2 hover:text-[var(--brand-blue)] transition-all duration-300 cursor-pointer">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold">Expert Content</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link href={`/blog/${post.id}`}>
                      <Button 
                        size="sm" 
                        className="group/btn bg-gradient-to-r from-[var(--brand-orange)] to-orange-500 hover:from-orange-600 hover:to-red-500 text-white font-orbitron font-bold text-sm px-6 py-3 rounded-xl border-0 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                        Read Full Article
                      </Button>
                    </Link>

                    {/* Quick Share Button */}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="group/share bg-white hover:bg-[var(--brand-blue)]/10 border-[var(--brand-blue)]/20 text-[var(--brand-blue)] hover:text-[var(--brand-blue)] transition-all duration-300 transform hover:scale-105"
                      onClick={() => {
                        const shareText = `🔧 Check out this automotive guide: "${post.title}"\n\n${post.excerpt}\n\n🔗 Read more: ${window.location.origin}/blog/${post.id}\n\n#AutomotiveTips #CarMaintenance`;

                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            text: post.excerpt,
                            url: `${window.location.origin}/blog/${post.id}`,
                          });
                        } else {
                          // WhatsApp as fallback
                          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 z-40">
          <div className="flex flex-col space-y-4">
            <Button 
              size="lg"
              className="rounded-full w-16 h-16 bg-[var(--brand-orange)] hover:bg-orange-600 shadow-xl transition-all duration-300 transform hover:scale-110"
              onClick={() => window.open('tel:+263242770389', '_self')}
            >
              <Phone size={24} className="text-white" />
            </Button>
            <Button 
              size="lg"
              className="rounded-full w-16 h-16 bg-[var(--brand-blue)] hover:bg-blue-700 shadow-xl transition-all duration-300 transform hover:scale-110"
              onClick={() => window.open('https://wa.me/+263719974846', '_blank')}
            >
              <MessageSquare size={24} className="text-white" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
 