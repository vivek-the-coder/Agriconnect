"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  HelpCircle,
  Lightbulb,
  AlertTriangle,
} from "lucide-react"

// Mock data for forum posts
const forumPosts = [
  {
    id: 1,
    title: "Best practices for organic wheat farming?",
    content:
      "I'm transitioning to organic wheat farming and looking for advice on soil preparation, pest management, and certification process. Any experienced organic farmers here?",
    author: "Rajesh Kumar",
    authorAvatar: "/farmer-avatar.png",
    location: "Punjab",
    category: "Organic Farming",
    tags: ["wheat", "organic", "certification"],
    likes: 15,
    replies: 8,
    createdAt: "2024-01-15",
    isResolved: false,
    isPinned: false,
  },
  {
    id: 2,
    title: "Drip irrigation system installation - Need guidance",
    content:
      "Planning to install drip irrigation for my 5-acre tomato farm. What are the costs involved and which brands are reliable? Also looking for government subsidies information.",
    author: "Priya Sharma",
    authorAvatar: "/female-farmer.png",
    location: "Maharashtra",
    category: "Irrigation",
    tags: ["drip-irrigation", "tomato", "subsidy"],
    likes: 23,
    replies: 12,
    createdAt: "2024-01-14",
    isResolved: true,
    isPinned: true,
  },
  {
    id: 3,
    title: "Pest attack on cotton crop - Urgent help needed!",
    content:
      "My cotton crop is under severe pest attack. Pink bollworm infestation is spreading rapidly. What immediate measures should I take? Has anyone faced similar issues?",
    author: "Suresh Patel",
    authorAvatar: "/concerned-farmer.png",
    location: "Gujarat",
    category: "Pest Management",
    tags: ["cotton", "pest-control", "bollworm", "urgent"],
    likes: 8,
    replies: 15,
    createdAt: "2024-01-13",
    isResolved: false,
    isPinned: false,
  },
  {
    id: 4,
    title: "Success story: Increased yield with crop rotation",
    content:
      "Sharing my experience with crop rotation. Switched from continuous rice-wheat to rice-wheat-legume rotation. Saw 20% increase in yield and improved soil health.",
    author: "Meera Devi",
    authorAvatar: "/successful-farmer.png",
    location: "Haryana",
    category: "Success Stories",
    tags: ["crop-rotation", "yield-increase", "soil-health"],
    likes: 45,
    replies: 6,
    createdAt: "2024-01-12",
    isResolved: false,
    isPinned: true,
  },
  {
    id: 5,
    title: "Market prices for turmeric - Where to sell?",
    content:
      "Harvested 2 tons of quality turmeric. Current market prices seem low. Should I wait or sell now? Any suggestions for better markets or direct buyers?",
    author: "Ravi Krishnan",
    authorAvatar: "/turmeric-farmer.png",
    location: "Tamil Nadu",
    category: "Market & Pricing",
    tags: ["turmeric", "market-price", "selling"],
    likes: 12,
    replies: 9,
    createdAt: "2024-01-11",
    isResolved: false,
    isPinned: false,
  },
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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("recent")
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)

  // New post form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  })

  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "popular") {
      return b.likes - a.likes
    } else if (sortBy === "replies") {
      return b.replies - a.replies
    }
    return 0
  })

  // Separate pinned posts
  const pinnedPosts = sortedPosts.filter((post) => post.isPinned)
  const regularPosts = sortedPosts.filter((post) => !post.isPinned)

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("New post submitted:", newPost)
    setNewPost({ title: "", content: "", category: "", tags: "" })
    setShowNewPostDialog(false)
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName)
    return category ? category.icon : MessageCircle
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Farmer Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow farmers, share experiences, ask questions, and learn from the community
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* New Post Button */}
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
                  <DialogDescription>Share your question, experience, or start a discussion</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="What's your question or topic?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newPost.category}
                      onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Describe your question, problem, or share your experience..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                      placeholder="e.g., wheat, organic, pest-control (comma separated)"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Post to Community
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowNewPostDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.name
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Members</span>
                  <span className="font-semibold">3,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Solved Problems</span>
                  <span className="font-semibold">892</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts, topics, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="replies">Most Replies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Pinned Posts
                </h2>
                {pinnedPosts.map((post) => (
                  <PostCard key={post.id} post={post} isPinned={true} />
                ))}
              </div>
            )}

            {/* Regular Posts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Recent Discussions ({regularPosts.length})</h2>
              </div>
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} isPinned={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, isPinned }: { post: (typeof forumPosts)[0]; isPinned: boolean }) {
  const CategoryIcon =
    post.category === "Pest Management"
      ? AlertTriangle
      : post.category === "Success Stories"
        ? Lightbulb
        : post.category === "Organic Farming"
          ? Lightbulb
          : MessageCircle

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isPinned && (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {post.isResolved && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <HelpCircle className="h-3 w-3 mr-1" />
                    Solved
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {post.category}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer">
                {post.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2">{post.content}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-muted-foreground">{post.location}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {post.likes}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.replies}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
