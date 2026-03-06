"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ExternalLink, Calendar, Users, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

// Mock data for government schemes
const schemes = [
  {
    id: 1,
    name: "PM-KISAN Samman Nidhi",
    description: "Direct income support to farmers with landholding up to 2 hectares",
    amount: "₹6,000 per year",
    eligibility: "Small and marginal farmers",
    state: "All India",
    type: "Income Support",
    deadline: "2024-03-31",
    status: "Active",
    image: "/farmer-receiving-direct-cash-payment-from-governme.png",
    details:
      "Provides financial assistance of ₹6,000 per year in three equal installments to eligible farmer families.",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support to farmers in case of crop failure",
    amount: "Up to ₹2 lakh coverage",
    eligibility: "All farmers",
    state: "All India",
    type: "Insurance",
    deadline: "2024-06-30",
    status: "Active",
    image: "/crop-insurance-protection-against-natural-disaster.png",
    details: "Comprehensive crop insurance covering pre-sowing to post-harvest losses due to natural calamities.",
  },
  {
    id: 3,
    name: "Kisan Credit Card",
    description: "Credit facility for farmers to meet their agricultural and allied activities",
    amount: "Based on land holding",
    eligibility: "All farmers with land records",
    state: "All India",
    type: "Credit",
    deadline: "Ongoing",
    status: "Active",
    image: "/farmer-holding-kisan-credit-card-for-agricultural-.png",
    details: "Provides adequate and timely credit support for comprehensive credit needs of farmers.",
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    description: "Provides soil health cards to farmers with recommendations for appropriate nutrients",
    amount: "Free service",
    eligibility: "All farmers",
    state: "All India",
    type: "Advisory",
    deadline: "Ongoing",
    status: "Active",
    image: "/soil-testing-and-health-card-with-nutrient-recomme.png",
    details: "Promotes soil test based nutrient management for improving soil health and crop productivity.",
  },
  {
    id: 5,
    name: "Maharashtra Krishi Samruddhi Yojana",
    description: "State scheme for agricultural development and farmer welfare",
    amount: "₹10,000 per hectare",
    eligibility: "Farmers in Maharashtra",
    state: "Maharashtra",
    type: "Development",
    deadline: "2024-12-31",
    status: "Active",
    image: "/modern-farming-techniques-in-maharashtra-agricultu.png",
    details: "Comprehensive agricultural development scheme focusing on modern farming techniques.",
  },
  {
    id: 6,
    name: "Punjab Crop Diversification Scheme",
    description: "Encourages farmers to shift from rice-wheat to alternative crops",
    amount: "₹17,500 per hectare",
    eligibility: "Punjab farmers",
    state: "Punjab",
    type: "Incentive",
    deadline: "2024-05-15",
    status: "Active",
    image: "/diverse-crops-alternative-to-rice-wheat-in-punjab-.png",
    details: "Promotes sustainable agriculture by encouraging crop diversification and water conservation.",
  },
]

const states = ["All India", "Maharashtra", "Punjab", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "Gujarat"]
const types = ["All Types", "Income Support", "Insurance", "Credit", "Advisory", "Development", "Incentive"]

export function SchemesDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("All States")
  const [selectedType, setSelectedType] = useState("All Types")
  const [allSchemes, setAllSchemes] = useState<any[]>(schemes)
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null)

  useEffect(() => {
    async function fetchSchemes() {
      const { data, error } = await supabase
        .from('schemes')
        .select('*')

      if (!error && data && data.length > 0) {
        setAllSchemes(data)
      }
    }
    fetchSchemes()
  }, [])

  const filteredSchemes = allSchemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedState === "All States" || scheme.state === selectedState
    const matchesType = selectedType === "All Types" || scheme.type === selectedType

    return matchesSearch && matchesState && matchesType
  })

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative mb-6 sm:mb-8 min-h-[200px]">
            <img
              src="/government-schemes-for-farmers-agricultural-suppor.png"
              alt="Government Schemes for Farmers"
              className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white text-left">
              <h1 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2">Government Schemes</h1>
              <p className="text-sm sm:text-xl opacity-90 max-w-xl">
                Supporting farmers with financial assistance and development programs
              </p>
            </div>
          </div>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Discover and apply for government schemes designed to support farmers and boost agricultural development
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Filter Schemes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All States">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Schemes List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Available Schemes ({filteredSchemes.length})</h2>
            </div>

            <div className="space-y-4">
              {filteredSchemes.map((scheme) => (
                <Card
                  key={scheme.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden ${selectedScheme?.id === scheme.id ? "ring-2 ring-primary" : ""
                    }`}
                  onClick={() => setSelectedScheme(scheme)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0">
                      <img
                        src={scheme.image || "/placeholder.svg"}
                        alt={scheme.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                          <div className="space-y-2">
                            <CardTitle className="text-lg sm:text-xl line-clamp-1 sm:line-clamp-none">{scheme.name}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-[10px] sm:text-xs">{scheme.type}</Badge>
                              <Badge variant="outline" className="text-[10px] sm:text-xs">{scheme.state}</Badge>
                              <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px] sm:text-xs">
                                {scheme.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="sm:text-right">
                            <div className="flex items-center text-primary font-semibold text-sm sm:text-base">
                              <DollarSign className="h-4 w-4 mr-1 shrink-0" />
                              {scheme.amount}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                        <CardDescription className="text-sm sm:text-base mb-4 line-clamp-2 sm:line-clamp-none">{scheme.description}</CardDescription>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground border-t pt-3">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            <span className="truncate">{scheme.eligibility}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Deadline: {scheme.deadline}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Scheme Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedScheme ? (
                <Card>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={selectedScheme.image || "/placeholder.svg"}
                      alt={selectedScheme.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{selectedScheme.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedScheme.type}</Badge>
                      <Badge variant="outline">{selectedScheme.state}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedScheme.details}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Amount</h4>
                        <p className="text-primary font-semibold">{selectedScheme.amount}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Deadline</h4>
                        <p className="text-muted-foreground">{selectedScheme.deadline}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-1">Eligibility</h4>
                      <p className="text-muted-foreground">{selectedScheme.eligibility}</p>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full" onClick={() => {
                        toast.success(`Redirecting to ${selectedScheme.name} application portal...`)
                        // In a real app, this would use selectedScheme.application_url
                        setTimeout(() => {
                          window.open('https://www.india.gov.in/my-government/schemes', '_blank')
                        }, 1000)
                      }}>
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => toast.info("Guidelines downloading...")}
                      >
                        Download Guidelines
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a scheme to view details</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
