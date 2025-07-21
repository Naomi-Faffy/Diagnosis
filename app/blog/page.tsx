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
import Image from "next/image";
import Logo from "@/components/logo";
import FloatingNavigation from "@/components/floating-navigation";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

// Toast utility functions
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Using simple alert for now - should be replaced with proper toast component
  if (typeof window !== 'undefined') {
    window.alert(message);
  }
};

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
      if (typeof window === 'undefined') return;

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
      setIsCreateDialogOpen(false);
      setEditingPost(null);
      resetForm();
      showToast('Blog post created successfully!', 'success');
    },
    onError: (error: Error) => {
      console.error('Create post error:', error);
      showToast(`Failed to create blog post: ${error.message}`, 'error');
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
      showToast('Blog post updated successfully!', 'success');
    },
    onError: (error: Error) => {
      console.error('Update post error:', error);
      showToast(`Failed to update blog post: ${error.message}`, 'error');
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
        if (typeof window !== 'undefined') {
          localStorage.setItem("admin_token", token);
        }
        setIsAdminMode(true);
        setShowPasswordDialog(false);
        setAdminPassword("");
        showToast('Admin access granted', 'success');
      } else {
        showToast("Incorrect password. Please contact administrator.", 'error');
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("Login failed. Please try again.", 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Please upload only JPG, PNG, or WEBP images.', 'error');
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        showToast('Image size should be less than 5MB.', 'error');
        e.target.value = '';
        return;
      }

      setImageFile(file);
      setImagePreview('');
      setFormData({ ...formData, imageUrl: '' });

      // Upload to Vercel Blob
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
          showToast(data.error || 'Image upload failed.', 'error');
        }
      } catch (err) {
        showToast('Image upload failed.', 'error');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation only
    if (!formData.title?.trim()) {
      showToast("Please enter a title.", 'error');
      return;
    }

    if (!formData.content?.trim()) {
      showToast("Please enter content.", 'error');
      return;
    }

    if (!formData.excerpt?.trim()) {
      showToast("Please enter an excerpt.", 'error');
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

        {/* Admin Toggle */}
        <div className="fixed top-2 right-4 z-80">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
                if (typeof window !== 'undefined') {
                  localStorage.removeItem("admin_token");
                }
                showToast('Admin session terminated successfully', 'success');
              } else {
                setShowPasswordDialog(true);
              }
            }}
            className="bg-gradient-to-r from-[var(--brand-orange)] to-red-500 text-white font-orbitron font-bold shadow-lg border-2 border-white/20 hover:scale-105 transition-all duration-200"
          >
            {isAdminMode ? (
              <>
                <EyeOff className="w-5 h-5 mr-2" />
                Exit Admin
              </>
            ) : (
              <>
                <Settings className="w-5 h-5 mr-2" />
                🔐 Admin Login
              </>
            )}
          </Button>
        </div>

        {/* Admin Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="sm:max-w-[425px] bg-white border-2 border-[var(--brand-blue)]/20 shadow-2xl">
            <DialogHeader className="text-center pb-6">
              <DialogTitle className="font-orbitron text-2xl font-bold text-gray-900 flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[var(--brand-orange)] to-red-500 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <span>Admin Access</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-semibold text-gray-700">
                  Enter Admin Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-2 border-gray-200 focus:border-[var(--brand-orange)] rounded-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAdminLogin();
                    }
                  }}
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setAdminPassword("");
                  }}
                  className="flex-1 border-2 border-gray-200 hover:bg-gray-50 font-orbitron"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdminLogin}
                  className="flex-1 bg-gradient-to-r from-[var(--brand-orange)] to-red-500 hover:from-red-500 hover:to-[var(--brand-orange)] text-white font-orbitron font-bold"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
                  <DialogHeader className="pb-6 border-b border-gray-200">
                    <DialogTitle className="font-orbitron text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[var(--brand-orange)] to-red-500 rounded-full flex items-center justify-center">
                        {editingPost ? <Edit3 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                      </div>
                      <span>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-8 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-[var(--brand-orange)]" />
                            <span>Title *</span>
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter blog post title..."
                            className="border-2 border-gray-200 focus:border-[var(--brand-orange)] rounded-lg text-lg p-4"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                            Category
                          </Label>
                          <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Technology, Business, etc."
                            className="border-2 border-gray-200 focus:border-[var(--brand-orange)] rounded-lg"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="image-upload" className="text-sm font-semibold text-gray-700">
                            Featured Image
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--brand-orange)] transition-colors">
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              className="mb-4"
                            >
                              Choose Image
                            </Button>
                            {imagePreview && (
                              <div className="mt-4">
                                <Image
                                  src={imagePreview}
                                  alt="Preview"
                                  width={300}
                                  height={200}
                                  className="mx-auto rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Switch
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                          />
                          <Label htmlFor="published" className="text-sm font-semibold text-gray-700">
                            Publish immediately
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">
                            Excerpt *
                          </Label>
                          <Textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Brief description of the blog post..."
                            className="border-2 border-gray-200 focus:border-[var(--brand-orange)] rounded-lg min-h-[120px]"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
                            Content *
                          </Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your blog post content..."
                            className="border-2 border-gray-200 focus:border-[var(--brand-orange)] rounded-lg min-h-[300px]"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false);
                          setEditingPost(null);
                          resetForm();
                        }}
                        className="flex-1 border-2 border-gray-200 hover:bg-gray-50 font-orbitron py-3"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createPostMutation.isPending || updatePostMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-[var(--brand-orange)] to-red-500 hover:from-red-500 hover:to-[var(--brand-orange)] text-white font-orbitron font-bold py-3 transform hover:scale-105 transition-all duration-200"
                      >
                        {createPostMutation.isPending || updatePostMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <>
                            {editingPost ? <Edit3 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {editingPost ? "Update Post" : "Create Post"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <h4 className="font-semibold text-gray-800">Edit Posts</h4>
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

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card  
              key={post.id}
              className="group bg-white backdrop-blur-sm border border-gray-200 shadow-lg overflow-hidden transition-all duration-300 transform"
            >
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.imageUrl || "/images/image10.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                              Are you sure you want to permanently delete <strong>&quot;{post.title}&quot;</strong>? 
                              <br />
                              <span className="text-red-600 font-medium">This action cannot be undone.</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
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
                </div>
              </CardHeader>
              <CardContent className="p-6 relative">
                {/* Title */}
                <h2 className="font-orbitron text-xl font-bold mb-4 transition-all duration-300 text-gray-900 group-hover:text-[var(--brand-orange)] line-clamp-2">
                  {post.title}
                </h2>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed font-light transition-colors duration-300 line-clamp-3">
                    {post.excerpt}
                  </p>
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
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link href={`/blog/${post.id}`}>
                      <Button 
                        size="sm" 
                        className="group/btn bg-gradient-to-r from-[var(--brand-orange)] to-orange-500 hover:from-orange-600 hover:to-red-500 text-white font-orbitron font-bold text-sm px-6 py-3 rounded-xl border-0 transition-all duration-300 transform hover:scale-105 shadow-md"
                      >
                        <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                        Read Article
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}