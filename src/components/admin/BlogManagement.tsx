import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  Search,
  Calendar,
  User,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  // Mock blog data
  const [blogs, setBlogs] = useState([
    {
      id: '1',
      title: 'Top 10 Interview Tips for Job Seekers in Nepal',
      slug: 'top-10-interview-tips-nepal',
      excerpt: 'Master the art of job interviews with these proven tips specifically tailored for the Nepali job market.',
      content: 'Full content here...',
      author: 'Admin User',
      category: 'Career Tips',
      status: 'published',
      publishDate: '2024-01-15',
      views: 1234,
      featured: true,
      tags: ['interview', 'career', 'tips'],
      seoTitle: 'Top 10 Interview Tips for Job Seekers in Nepal - MegaJobNepal',
      seoDescription: 'Master job interviews in Nepal with these expert tips...'
    },
    {
      id: '2',
      title: 'IT Job Market Trends in Nepal 2024',
      slug: 'it-job-market-trends-nepal-2024',
      excerpt: 'Explore the latest trends and opportunities in the IT sector across Nepal.',
      content: 'Full content here...',
      author: 'Content Manager',
      category: 'Industry News',
      status: 'published',
      publishDate: '2024-01-12',
      views: 987,
      featured: false,
      tags: ['IT', 'trends', 'technology'],
      seoTitle: 'IT Job Market Trends in Nepal 2024 - MegaJobNepal',
      seoDescription: 'Latest IT job market trends and opportunities in Nepal...'
    },
    {
      id: '3',
      title: 'How to Write a Perfect Resume',
      slug: 'how-to-write-perfect-resume',
      excerpt: 'Learn the art of crafting a compelling resume that gets you noticed by employers.',
      content: 'Full content here...',
      author: 'HR Specialist',
      category: 'Career Tips',
      status: 'draft',
      publishDate: '2024-01-18',
      views: 0,
      featured: false,
      tags: ['resume', 'career', 'tips'],
      seoTitle: 'How to Write a Perfect Resume - MegaJobNepal',
      seoDescription: 'Expert guide on writing resumes that get results...'
    }
  ]);

  const [news, setNews] = useState([
    {
      id: '1',
      title: 'New Employment Act 2024 Announced',
      excerpt: 'Government announces new employment regulations affecting job seekers and employers.',
      category: 'Government',
      status: 'published',
      publishDate: '2024-01-14',
      priority: 'high',
      source: 'Government of Nepal'
    },
    {
      id: '2',
      title: 'Tech Companies Expand Operations in Nepal',
      excerpt: 'Major international tech companies are setting up offices in Kathmandu.',
      category: 'Business',
      status: 'published',
      publishDate: '2024-01-13',
      priority: 'medium',
      source: 'Business Weekly'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    status: 'draft'
  });

  const categories = [
    'Career Tips',
    'Industry News',
    'Company Spotlight',
    'Job Market Trends',
    'Interview Guides',
    'Resume Writing',
    'Salary Insights',
    'Work Culture'
  ];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.excerpt || !newPost.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const post = {
      id: Date.now().toString(),
      ...newPost,
      slug: newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      author: 'Admin User',
      publishDate: new Date().toISOString().split('T')[0],
      views: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setBlogs([...blogs, post]);
    setNewPost({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featured: false,
      seoTitle: '',
      seoDescription: '',
      status: 'draft'
    });
    setIsCreateOpen(false);
    toast.success('Blog post created successfully!');
  };

  const handleEditPost = (post: any) => {
    setEditingPost({ ...post, tags: post.tags.join(', ') });
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    setBlogs(blogs.map(blog => 
      blog.id === editingPost.id 
        ? {
            ...editingPost,
            tags: editingPost.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
          }
        : blog
    ));
    setEditingPost(null);
    toast.success('Blog post updated successfully!');
  };

  const handleDeletePost = (id: string) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
    toast.success('Blog post deleted successfully!');
  };

  const togglePostStatus = (id: string) => {
    setBlogs(blogs.map(blog => 
      blog.id === id 
        ? { ...blog, status: blog.status === 'published' ? 'draft' : 'published' }
        : blog
    ));
    toast.success('Post status updated!');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { class: 'bg-green-100 text-green-800', label: 'Published' },
      draft: { class: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      archived: { class: 'bg-gray-100 text-gray-800', label: 'Archived' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.class}>{config.label}</Badge>;
  };

  const PostForm = ({ post, onSave, onCancel }: any) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={post.title}
          onChange={(e) => post.title = e.target.value}
          placeholder="Enter blog post title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={post.excerpt}
          onChange={(e) => post.excerpt = e.target.value}
          placeholder="Brief description of the blog post"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={post.content}
          onChange={(e) => post.content = e.target.value}
          placeholder="Write your blog post content here..."
          rows={10}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={post.category}
            onChange={(e) => post.category = e.target.value}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={post.status}
            onChange={(e) => post.status = e.target.value}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={post.tags}
          onChange={(e) => post.tags = e.target.value}
          placeholder="career, tips, interview"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input
          id="seoTitle"
          value={post.seoTitle}
          onChange={(e) => post.seoTitle = e.target.value}
          placeholder="SEO optimized title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Textarea
          id="seoDescription"
          value={post.seoDescription}
          onChange={(e) => post.seoDescription = e.target.value}
          placeholder="SEO meta description"
          rows={2}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={post.featured}
          onChange={(e) => post.featured = e.target.checked}
          className="rounded border-gray-300"
        />
        <Label htmlFor="featured">Featured post</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Blog & News Management</h2>
          <p className="text-gray-600">Manage blog posts, news articles, and content</p>
        </div>
      </div>

      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
          <TabsTrigger value="news">News Articles</TabsTrigger>
        </TabsList>

        {/* Blog Posts */}
        <TabsContent value="blogs" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Blog Post</DialogTitle>
                        <DialogDescription>
                          Create a new blog post or article.
                        </DialogDescription>
                      </DialogHeader>
                      <PostForm 
                        post={newPost}
                        onSave={handleCreatePost}
                        onCancel={() => setIsCreateOpen(false)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePost}>Create Post</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-blue-600">{blogs.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-green-600">
                      {blogs.filter(b => b.status === 'published').length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {blogs.filter(b => b.status === 'draft').length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {blogs.reduce((sum, b) => sum + b.views, 0).toLocaleString()}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts ({filteredBlogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBlogs.map(blog => (
                  <div key={blog.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{blog.title}</h3>
                          {blog.featured && (
                            <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                          )}
                          {getStatusBadge(blog.status)}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{blog.excerpt}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {blog.author}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {blog.publishDate}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {blog.views} views
                          </span>
                          <Badge variant="outline">{blog.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPost(blog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePostStatus(blog.id)}
                          className={blog.status === 'published' ? 'text-yellow-600' : 'text-green-600'}
                        >
                          {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePost(blog.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Articles */}
        <TabsContent value="news" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>News Articles ({news.length})</CardTitle>
              <div className="flex gap-2">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add News
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {news.map(article => (
                  <div key={article.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{article.title}</h3>
                          <Badge className={
                            article.priority === 'high' ? 'bg-red-100 text-red-800' :
                            article.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {article.priority} priority
                          </Badge>
                          {getStatusBadge(article.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{article.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{article.source}</span>
                          <span>{article.publishDate}</span>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Post Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post information.
            </DialogDescription>
          </DialogHeader>
          {editingPost && (
            <PostForm 
              post={editingPost}
              onSave={handleUpdatePost}
              onCancel={() => setEditingPost(null)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePost}>Update Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}