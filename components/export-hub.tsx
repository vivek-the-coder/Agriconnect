"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, MapPin, Calendar, Phone, Mail, Handshake, TrendingUp } from "lucide-react"

// Mock data for crop listings
const cropListings = [
  {
    id: 1,
    cropName: "Basmati Rice",
    variety: "Pusa Basmati 1121",
    quantity: "500 tons",
    location: "Punjab, India",
    farmer: "Rajesh Kumar",
    contact: "+91 98765 43210",
    email: "rajesh.kumar@email.com",
    priceRange: "₹45-50 per kg",
    harvestDate: "2024-04-15",
    quality: "Premium",
    organic: true,
    description: "High-quality basmati rice with excellent aroma and long grains. Grown using organic methods.",
  },
  {
    id: 2,
    cropName: "Wheat",
    variety: "HD-2967",
    quantity: "200 tons",
    location: "Haryana, India",
    farmer: "Priya Sharma",
    contact: "+91 87654 32109",
    email: "priya.sharma@email.com",
    priceRange: "₹22-25 per kg",
    harvestDate: "2024-03-20",
    quality: "Grade A",
    organic: false,
    description: "High-yield wheat variety suitable for bread making. Excellent protein content.",
  },
  {
    id: 3,
    cropName: "Turmeric",
    variety: "Curcuma Longa",
    quantity: "50 tons",
    location: "Tamil Nadu, India",
    farmer: "Murugan Pillai",
    contact: "+91 76543 21098",
    email: "murugan.pillai@email.com",
    priceRange: "₹80-90 per kg",
    harvestDate: "2024-02-10",
    quality: "Premium",
    organic: true,
    description: "High curcumin content turmeric with bright golden color. Organically certified.",
  },
]

// Mock data for joint ventures
const jointVentures = [
  {
    id: 1,
    title: "Organic Spice Export Partnership",
    description: "Looking for farmers to partner in organic spice cultivation for European markets",
    company: "Global Spice Traders Ltd.",
    investment: "₹10-50 lakhs",
    location: "Kerala, Karnataka",
    crops: ["Cardamom", "Black Pepper", "Cinnamon"],
    requirements: "Organic certification, minimum 5 acres",
    contact: "partnerships@globalspice.com",
  },
  {
    id: 2,
    title: "Basmati Rice Contract Farming",
    description: "Contract farming opportunity for premium basmati rice with guaranteed buyback",
    company: "Premium Rice Exports",
    investment: "₹5-25 lakhs",
    location: "Punjab, Haryana",
    crops: ["Basmati Rice"],
    requirements: "Minimum 10 acres, irrigation facility",
    contact: "contracts@premiumrice.com",
  },
]

export function ExportHub() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("All Crops")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")

  // Form state for crop listing
  const [cropForm, setCropForm] = useState({
    cropName: "",
    variety: "",
    quantity: "",
    location: "",
    farmer: "",
    contact: "",
    email: "",
    priceRange: "",
    harvestDate: "",
    quality: "",
    organic: false,
    description: "",
  })

  const filteredCrops = cropListings.filter((crop) => {
    const matchesSearch =
      crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.farmer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCrop = selectedCrop === "All Crops" || crop.cropName === selectedCrop
    const matchesLocation = selectedLocation === "All Locations" || crop.location.includes(selectedLocation)

    return matchesSearch && matchesCrop && matchesLocation
  })

  const handleSubmitCrop = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Crop listing submitted:", cropForm)
    // Reset form
    setCropForm({
      cropName: "",
      variety: "",
      quantity: "",
      location: "",
      farmer: "",
      contact: "",
      email: "",
      priceRange: "",
      harvestDate: "",
      quality: "",
      organic: false,
      description: "",
    })
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Export Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect farmers with global exporters. List your crops, find export opportunities, and explore joint
            ventures.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Crops</TabsTrigger>
            <TabsTrigger value="list">List Your Crop</TabsTrigger>
            <TabsTrigger value="ventures">Joint Ventures</TabsTrigger>
          </TabsList>

          {/* Browse Crops Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Crops for Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search crops, varieties, farmers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Crop Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Crops">All Crops</SelectItem>
                      <SelectItem value="Basmati Rice">Basmati Rice</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Turmeric">Turmeric</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Locations">All Locations</SelectItem>
                      <SelectItem value="Punjab">Punjab</SelectItem>
                      <SelectItem value="Haryana">Haryana</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Crop Listings */}
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredCrops.map((crop) => (
                <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{crop.cropName}</CardTitle>
                        <CardDescription className="text-base">{crop.variety}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {crop.organic && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Organic</Badge>
                        )}
                        <Badge variant="outline">{crop.quality}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{crop.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Quantity:</span>
                        <p className="text-muted-foreground">{crop.quantity}</p>
                      </div>
                      <div>
                        <span className="font-medium">Price Range:</span>
                        <p className="text-primary font-semibold">{crop.priceRange}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{crop.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{crop.harvestDate}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{crop.farmer}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {crop.contact}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {crop.email}
                            </div>
                          </div>
                        </div>
                        <Button>Contact Farmer</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* List Your Crop Tab */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  List Your Crop for Export
                </CardTitle>
                <CardDescription>
                  Fill out the form below to list your crop and connect with potential exporters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitCrop} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cropName">Crop Name *</Label>
                      <Select
                        value={cropForm.cropName}
                        onValueChange={(value) => setCropForm({ ...cropForm, cropName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basmati Rice">Basmati Rice</SelectItem>
                          <SelectItem value="Wheat">Wheat</SelectItem>
                          <SelectItem value="Turmeric">Turmeric</SelectItem>
                          <SelectItem value="Cotton">Cotton</SelectItem>
                          <SelectItem value="Cardamom">Cardamom</SelectItem>
                          <SelectItem value="Black Pepper">Black Pepper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variety">Variety</Label>
                      <Input
                        id="variety"
                        value={cropForm.variety}
                        onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                        placeholder="e.g., Pusa Basmati 1121"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity Available *</Label>
                      <Input
                        id="quantity"
                        value={cropForm.quantity}
                        onChange={(e) => setCropForm({ ...cropForm, quantity: e.target.value })}
                        placeholder="e.g., 100 tons"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={cropForm.location}
                        onChange={(e) => setCropForm({ ...cropForm, location: e.target.value })}
                        placeholder="e.g., Punjab, India"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="farmer">Farmer Name *</Label>
                      <Input
                        id="farmer"
                        value={cropForm.farmer}
                        onChange={(e) => setCropForm({ ...cropForm, farmer: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input
                        id="contact"
                        value={cropForm.contact}
                        onChange={(e) => setCropForm({ ...cropForm, contact: e.target.value })}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cropForm.email}
                        onChange={(e) => setCropForm({ ...cropForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priceRange">Expected Price Range</Label>
                      <Input
                        id="priceRange"
                        value={cropForm.priceRange}
                        onChange={(e) => setCropForm({ ...cropForm, priceRange: e.target.value })}
                        placeholder="e.g., ₹45-50 per kg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="harvestDate">Harvest Date</Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        value={cropForm.harvestDate}
                        onChange={(e) => setCropForm({ ...cropForm, harvestDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quality">Quality Grade</Label>
                      <Select
                        value={cropForm.quality}
                        onValueChange={(value) => setCropForm({ ...cropForm, quality: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Grade A">Grade A</SelectItem>
                          <SelectItem value="Grade B">Grade B</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={cropForm.description}
                      onChange={(e) => setCropForm({ ...cropForm, description: e.target.value })}
                      placeholder="Describe your crop quality, farming methods, certifications, etc."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="organic"
                      checked={cropForm.organic}
                      onChange={(e) => setCropForm({ ...cropForm, organic: e.target.checked })}
                      className="rounded border-border"
                    />
                    <Label htmlFor="organic">This is an organically grown crop</Label>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    List Your Crop
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Joint Ventures Tab */}
          <TabsContent value="ventures" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Joint Venture Opportunities</h2>
              <p className="text-muted-foreground">
                Partner with established exporters for guaranteed markets and shared investments
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {jointVentures.map((venture) => (
                <Card key={venture.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{venture.title}</CardTitle>
                        <CardDescription className="text-base">{venture.company}</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <Handshake className="h-3 w-3 mr-1" />
                        Partnership
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{venture.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-medium">Investment Range:</span>
                        <span className="text-primary font-semibold">{venture.investment}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span className="text-muted-foreground">{venture.location}</span>
                      </div>

                      <div>
                        <span className="font-medium">Crops:</span>
                        <div className="flex gap-2 mt-1">
                          {venture.crops.map((crop) => (
                            <Badge key={crop} variant="outline">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium">Requirements:</span>
                        <p className="text-muted-foreground text-sm mt-1">{venture.requirements}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 inline mr-1" />
                        {venture.contact}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Learn More</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{venture.title}</DialogTitle>
                            <DialogDescription>{venture.company}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>{venture.description}</p>
                            <div className="space-y-2">
                              <p>
                                <strong>Investment Range:</strong> {venture.investment}
                              </p>
                              <p>
                                <strong>Location:</strong> {venture.location}
                              </p>
                              <p>
                                <strong>Requirements:</strong> {venture.requirements}
                              </p>
                              <p>
                                <strong>Contact:</strong> {venture.contact}
                              </p>
                            </div>
                            <Button className="w-full">Express Interest</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
