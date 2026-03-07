"use client"

import { useState, useEffect, useCallback } from "react"
import { db, auth } from "@/lib/firebase"
import { collection, query, getDocs, addDoc, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"
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
  RefreshCw,
  Send,
} from "lucide-react"

const mockForumPosts = [
  {
    id: "mock-1",
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
    id: "mock-2",
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

function ForumPostCard({ post }: { post: any }) {
  const [comments, setComments] = useState<any[]>([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const currentUserId = auth.currentUser?.uid
  const hasLiked = currentUserId && post.liked_by?.includes(currentUserId)

  useEffect(() => {
    if (!showComments || !post.id || post.id.startsWith("mock-")) return

    const q = query(collection(db, "forum_posts", post.id, "comments"), orderBy("created_at", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setComments(data)
    })
    return () => unsubscribe()
  }, [showComments, post.id])

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Please log in to like a post")
      return
    }
    if (post.id.startsWith("mock-")) {
      toast.info("Cannot like a mock post.")
      return
    }

    try {
      setIsLiking(true)
      const postRef = doc(db, "forum_posts", post.id)
      if (hasLiked) {
        await updateDoc(postRef, {
          liked_by: arrayRemove(currentUserId),
          likes: (post.likes || 1) - 1
        })
      } else {
        await updateDoc(postRef, {
          liked_by: arrayUnion(currentUserId),
          likes: (post.likes || 0) + 1
        })
      }
    } catch (err: any) {
      toast.error("Failed to like post")
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) {
      toast.error("Please log in to comment")
      return
    }
    if (!newComment.trim()) return

    try {
      setIsCommenting(true)
      const commentsRef = collection(db, "forum_posts", post.id, "comments")
      await addDoc(commentsRef, {
        content: newComment,
        author: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "Anonymous",
        author_avatar: auth.currentUser?.photoURL || null,
        user_id: currentUserId,
        created_at: new Date().toISOString()
      })

      const postRef = doc(db, "forum_posts", post.id)
      await updateDoc(postRef, {
        replies: (post.replies || 0) + 1
      })

      setNewComment("")
    } catch (err: any) {
      toast.error("Failed to add comment")
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            {post.is_pinned && <Badge className="bg-yellow-100 text-yellow-800">Pinned</Badge>}
            {post.is_resolved && <Badge className="bg-green-100 text-green-800">Solved</Badge>}
            <Badge variant="outline">{post.category}</Badge>
          </div>
          <h3 className="text-lg font-semibold cursor-pointer hover:text-primary">{post.title}</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author_avatar} />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{post.author}</p>
                <p className="text-muted-foreground text-xs">{post.location || "Location Hidden"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <button
                onClick={handleLike}
                disabled={isLiking || post.id.startsWith("mock-")}
                className={`flex items-center gap-1 transition-colors hover:text-primary ${hasLiked ? 'text-primary font-medium' : ''}`}
              >
                <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                {post.likes || 0}
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                disabled={post.id.startsWith("mock-")}
                className="flex items-center gap-1 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                {post.replies || 0}
              </button>

              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now'}
              </span>
            </div>
          </div>

          {showComments && !post.id.startsWith("mock-") && (
            <div className="mt-4 pt-4 border-t space-y-4">
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c.id} className="bg-muted/50 rounded-lg p-3 text-sm flex gap-3 cursor-default">
                      <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                        <AvatarImage src={c.author_avatar} />
                        <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{c.author}</span>
                          <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-foreground">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">No comments yet. Be the first!</p>
              )}

              {currentUserId ? (
                <form onSubmit={handleComment} className="flex items-center gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-background"
                  />
                  <Button type="submit" size="sm" disabled={isCommenting || !newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <p className="text-xs text-center text-muted-foreground">Log in to add a comment.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function CommunityForum() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("recent")
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  useEffect(() => {
    setLoading(true)
    setFetchError(null)

    const q = query(collection(db, "forum_posts"), orderBy("created_at", "desc"))

    // Fallback timeout in case onSnapshot completely hangs
    const timeoutId = setTimeout(() => {
      setLoading(false)
    }, 5000)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      clearTimeout(timeoutId)
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      if (!data || data.length === 0) {
        setPosts(mockForumPosts)
      } else {
        setPosts([...data, ...mockForumPosts])
      }
      setLoading(false)
    }, (err) => {
      clearTimeout(timeoutId)
      console.error("Critical error in onSnapshot:", err)
      setFetchError(err.message || "Unknown error")
      toast.error(`Live data unavailable: ${err.message}`)
      setPosts(mockForumPosts)
      setLoading(false)
    })

    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [])

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const sessionUser = auth.currentUser

      await addDoc(collection(db, 'forum_posts'), {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: sessionUser?.displayName || sessionUser?.email?.split('@')[0] || "Anonymous Farmer",
        author_avatar: sessionUser?.photoURL || null,
        location: "Location Hidden",
        likes: 0,
        replies: 0,
        is_resolved: false,
        is_pinned: false,
        user_id: sessionUser?.uid || null,
        created_at: new Date().toISOString()
      })

      toast.success("Post created successfully!")
      setNewPost({ title: "", content: "", category: "", tags: "" })
      setShowNewPostDialog(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to create post")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPosts = (posts || []).filter((post) => {
    const matchesSearch =
      (post.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.content || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") return (Number(b.likes) || 0) - (Number(a.likes) || 0)
    if (sortBy === "replies") return (Number(b.replies) || 0) - (Number(a.replies) || 0)
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()
    return dateB - dateA
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

        {fetchError && (
          <div className="mb-6 flex items-center justify-center gap-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <span className="text-sm">Live data sync issue. Syncing failed with timeout.</span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Sync
            </Button>
          </div>
        )}

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
                      <SelectItem value="replies">Most Replies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <ForumPostCard key={post.id} post={post} />
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
