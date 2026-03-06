"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  MessageCircle,
  ThumbsUp,
  Clock,
  User,
  Tag,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  Loader2,
} from "lucide-react"

const mockForumPosts = [
  {
    id: 1,
    title: "Monsoon crop planning for Maharashtra region?",
    content: "With the monsoon approaching, what are the best short-duration crops to plant in the Vidarbha region? Looking for advice on soyabean varieties and cotton.",
    author: "Rajesh Patil",
    author_avatar: "/farmer-avatar.png",
    location: "Nagpur, Maharashtra",
    category: "Crop Management",
    tags: ["monsoon", "soyabean", "maharashtra"],
    likes: 24,
    replies: 12,
    created_at: "2024-02-15T10:00:00Z",
    is_resolved: false,
    is_pinned: true,
  },
  {
    id: 2,
    title: "Effective organic pest control for Rice?",
    content: "Are there any effective organic methods to control Stem Borer in Basmati rice? I've heard about Neem oil sprays, but need a proper schedule.",
    author: "Lakshmi Venkat",
    author_avatar: "/farmer-avatar.png",
    location: "Karnal, Haryana",
    category: "Pest Management",
    tags: ["organic", "pest-control", "basmati"],
    likes: 18,
    replies: 6,
    created_at: "2024-02-18T09:30:00Z",
    is_resolved: false,
    is_pinned: false,
  },
  {
    id: 3,
    title: "Successful transition to Dragon Fruit farming",
    content: "Sharing my journey of converting 2 acres of barren land into a profitable dragon fruit orchard in Andhra Pradesh. AMA!",
    author: "Vijay Reddy",
    author_avatar: "/farmer-avatar.png",
    location: "Chittoor, AP",
    category: "Success Stories",
    tags: ["dragon-fruit", "innovation", "horticulture"],
    likes: 156,
    replies: 45,
    created_at: "2024-02-10T14:20:00Z",
    is_resolved: true,
    is_pinned: false,
  }
]

const categories = [
  { name: "All Categories", icon: Tag, count: 45 },
  { name: "Crop Management", icon: TrendingUp, count: 12 },
  { name: "Pest Management", icon: AlertTriangle, count: 8 },
  { name: "Irrigation", icon: TrendingUp, count: 6 },
  { name: "Organic Farming", icon: Lightbulb, count: 9 },
  { name: "Market & Pricing", icon: TrendingUp, count: 5 },
  { name: "Success Stories", icon: Lightbulb, count: 3 },
  { name: "General Discussion", icon: MessageCircle, count: 2 },
]

export function CommunityForum() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("recent")
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        // Handle common "table missing" or "schema cache" errors gracefully
        if (error.code === 'PGRST116' || error.message?.includes("schema cache") || error.message?.includes("relation") || error.message?.includes("does not exist") || error.code === '42P01') {
          console.warn("Table 'forum_posts' not found, falling back to mock data.")
          setPosts(mockForumPosts)
          return
        }
        throw error
      }

      if (!data || data.length === 0) {
        setPosts(mockForumPosts)
      } else {
        // Merge live data with mock data for a richer community feel initially
        setPosts([...data, ...mockForumPosts])
      }
    } catch (err: any) {
      console.error("Error fetching forum posts:", err.message)
      // Only show error toast if it's not a standard "missing table" scenario
      if (!err.message?.includes("relation") && !err.message?.includes("does not exist")) {
        toast.error("Live community data currently unavailable. Showing trending discussions.")
      }
      setPosts(mockForumPosts)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const { data: { session } } = await supabase.auth.getSession()

      const { error } = await supabase
        .from('forum_posts')
        .insert([{
          ...newPost,
          tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
          author: session?.user?.email?.split('@')[0] || "Anonymous Farmer",
          author_avatar: session?.user?.user_metadata?.avatar_url || null,
          location: "Unknown",
          likes: 0,
          replies: 0,
          is_resolved: false,
          is_pinned: false,
          user_id: session?.user?.id || null
        }])

      if (error) throw error

      toast.success("Post created successfully!")
      setNewPost({ title: "", content: "", category: "", tags: "" })
      setShowNewPostDialog(false)
      fetchPosts()
    } catch (err: any) {
      toast.error(err.message || "Failed to create post. Please ensure the database tables are set up.")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.content || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0)
    if (sortBy === "replies") return (b.replies || 0) - (a.replies || 0)
    return 0
  })

  if (loading) {
    return <div className="py-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">Loading farmer community...</p>
    </div>
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Farmer Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow farmers, share experiences, and learn from the community.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newPost.category} onValueChange={(v) => setNewPost({ ...newPost, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea id="content" value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} rows={6} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" value={newPost.tags} onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" /> : "Post to Community"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Card className="sticky top-24">
              <CardHeader><CardTitle className="text-lg">Categories</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${selectedCategory === c.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <div className="flex items-center gap-3">
                      <c.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex gap-2 mb-2">
                          {post.is_pinned && <Badge className="bg-yellow-100 text-yellow-800">Pinned</Badge>}
                          {post.is_resolved && <Badge className="bg-green-100 text-green-800">Solved</Badge>}
                          <Badge variant="outline">{post.category}</Badge>
                        </div>
                        <h3 className="text-lg font-semibold cursor-pointer hover:text-primary">{post.title}</h3>
                        <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-4 sm:gap-0">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={post.author_avatar} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{post.author}</p>
                              <p className="text-muted-foreground text-xs">{post.location}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {post.likes}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {post.replies}</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No posts found matching your criteria.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
