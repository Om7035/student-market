"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Upload,
  X,
  Plus,
  IndianRupee,
  Clock,
  Star,
  Users,
  Zap,
  Camera,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"
import { dataService } from "@/lib/data-service"
import type { Category, User } from "@/lib/types"

interface GigFormData {
  title: string
  description: string
  category_id: string
  price: number
  delivery_days: number
  tags: string[]
  images: string[]
  video_url: string
  requirements: string
  revisions: number
  is_featured: boolean
  gig_type: "service" | "request"
  urgency: "low" | "medium" | "high"
  skill_level: "beginner" | "intermediate" | "expert"
  collaboration_type: "individual" | "team"
}

const initialFormData: GigFormData = {
  title: "",
  description: "",
  category_id: "",
  price: 100,
  delivery_days: 3,
  tags: [],
  images: [],
  video_url: "",
  requirements: "",
  revisions: 2,
  is_featured: false,
  gig_type: "service",
  urgency: "medium",
  skill_level: "intermediate",
  collaboration_type: "individual",
}

const pricingTiers = [
  { name: "Basic", price: 100, description: "Essential service with standard delivery" },
  { name: "Standard", price: 300, description: "Enhanced service with faster delivery" },
  { name: "Premium", price: 500, description: "Complete package with priority support" },
]

const deliveryOptions = [
  { days: 1, label: "Express (24 hours)", premium: true },
  { days: 2, label: "Fast (2 days)", premium: false },
  { days: 3, label: "Standard (3 days)", premium: false },
  { days: 7, label: "Extended (1 week)", premium: false },
  { days: 14, label: "Project (2 weeks)", premium: false },
]

export default function CreateGigPage() {
  const [formData, setFormData] = useState<GigFormData>(initialFormData)
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [tagInput, setTagInput] = useState("")
  const [previewMode, setPreviewMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [categoriesData, userData] = await Promise.all([dataService.getCategories(), dataService.getCurrentUser()])
      setCategories(categoriesData)
      setUser(userData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (!formData.category_id) newErrors.category_id = "Category is required"
        break
      case 2:
        if (formData.price < 50) newErrors.price = "Minimum price is ₹50"
        if (formData.delivery_days < 1) newErrors.delivery_days = "Minimum delivery time is 1 day"
        break
      case 3:
        if (formData.tags.length === 0) newErrors.tags = "At least one tag is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, this would call dataService.createGig(formData)
      console.log("Creating gig:", formData)

      router.push("/dashboard?tab=gigs&success=created")
    } catch (error) {
      console.error("Error creating gig:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // In real implementation, upload to storage and get URLs
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages].slice(0, 5),
      })
    }
  }

  const removeImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== imageToRemove),
    })
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <FileText className="h-5 w-5" />
      case 2:
        return <IndianRupee className="h-5 w-5" />
      case 3:
        return <Target className="h-5 w-5" />
      case 4:
        return <Camera className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Gig
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your skills with Pune's student community and start earning today
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {getStepIcon(step)}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < currentStep
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Basic Info</span>
            <span>Pricing</span>
            <span>Details</span>
            <span>Media</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Tell us about your service</h2>
                    <p className="text-muted-foreground">Provide the basic details of what you're offering</p>
                  </div>

                  {/* Gig Type Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card
                      className={`cursor-pointer transition-all duration-300 ${
                        formData.gig_type === "service"
                          ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => setFormData({ ...formData, gig_type: "service" })}
                    >
                      <CardContent className="p-6 text-center">
                        <Zap className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                        <h3 className="font-semibold mb-2">Offer a Service</h3>
                        <p className="text-sm text-muted-foreground">I want to provide a service to others</p>
                      </CardContent>
                    </Card>
                    <Card
                      className={`cursor-pointer transition-all duration-300 ${
                        formData.gig_type === "request"
                          ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => setFormData({ ...formData, gig_type: "request" })}
                    >
                      <CardContent className="p-6 text-center">
                        <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                        <h3 className="font-semibold mb-2">Request a Service</h3>
                        <p className="text-sm text-muted-foreground">I need help with something</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-base font-semibold">
                        {formData.gig_type === "service" ? "Service Title" : "What do you need help with?"}
                      </Label>
                      <Input
                        id="title"
                        placeholder={
                          formData.gig_type === "service"
                            ? "I will create a professional resume for your dream job"
                            : "I need help with Python programming assignment"
                        }
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-2 h-12 text-lg"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-base font-semibold">
                        Category
                      </Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                      >
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-semibold">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your service in detail. What will you deliver? What makes you qualified?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-2 min-h-32 text-base"
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Skill Level & Collaboration Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-base font-semibold">Skill Level Required</Label>
                        <Select
                          value={formData.skill_level}
                          onValueChange={(value: any) => setFormData({ ...formData, skill_level: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-base font-semibold">Collaboration Type</Label>
                        <Select
                          value={formData.collaboration_type}
                          onValueChange={(value: any) => setFormData({ ...formData, collaboration_type: value })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Work</SelectItem>
                            <SelectItem value="team">Team Collaboration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pricing & Delivery */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Set your pricing</h2>
                    <p className="text-muted-foreground">Choose competitive pricing that reflects your value</p>
                  </div>

                  {/* Pricing Tiers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {pricingTiers.map((tier, index) => (
                      <Card
                        key={tier.name}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          index === 1 ? "ring-2 ring-blue-500 scale-105" : ""
                        }`}
                        onClick={() => setFormData({ ...formData, price: tier.price })}
                      >
                        <CardContent className="p-6 text-center">
                          {index === 1 && <Badge className="mb-2 bg-blue-500">Most Popular</Badge>}
                          <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                          <div className="text-3xl font-bold text-green-600 mb-2">₹{tier.price}</div>
                          <p className="text-sm text-muted-foreground">{tier.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price" className="text-base font-semibold">
                        Custom Price (₹)
                      </Label>
                      <div className="relative mt-2">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          min="50"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
                          className="pl-12 h-12 text-lg"
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Delivery Time</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {deliveryOptions.map((option) => (
                          <Card
                            key={option.days}
                            className={`cursor-pointer transition-all duration-300 ${
                              formData.delivery_days === option.days
                                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => setFormData({ ...formData, delivery_days: option.days })}
                          >
                            <CardContent className="p-4 text-center">
                              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                              <div className="font-semibold">
                                {option.days} day{option.days > 1 ? "s" : ""}
                              </div>
                              <div className="text-xs text-muted-foreground">{option.label}</div>
                              {option.premium && <Badge className="mt-1 text-xs">Premium</Badge>}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">Revisions Included</Label>
                      <div className="mt-2">
                        <Slider
                          value={[formData.revisions]}
                          onValueChange={(value) => setFormData({ ...formData, revisions: value[0] })}
                          max={5}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>No revisions</span>
                          <span className="font-semibold">
                            {formData.revisions} revision{formData.revisions !== 1 ? "s" : ""}
                          </span>
                          <span>5 revisions</span>
                        </div>
                      </div>
                    </div>

                    {/* Urgency Level */}
                    <div>
                      <Label className="text-base font-semibold">Urgency Level</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {[
                          { value: "low", label: "Low", color: "green", icon: "🟢" },
                          { value: "medium", label: "Medium", color: "yellow", icon: "🟡" },
                          { value: "high", label: "High", color: "red", icon: "🔴" },
                        ].map((urgency) => (
                          <Card
                            key={urgency.value}
                            className={`cursor-pointer transition-all duration-300 ${
                              formData.urgency === urgency.value
                                ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => setFormData({ ...formData, urgency: urgency.value as any })}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-2xl mb-2">{urgency.icon}</div>
                              <div className="font-semibold">{urgency.label}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Tags & Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Add details & requirements</h2>
                    <p className="text-muted-foreground">Help buyers understand exactly what you need</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">Tags (Skills/Keywords)</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Add a tag (e.g., Python, Design, Writing)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          className="flex-1"
                        />
                        <Button onClick={addTag} type="button">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-3 py-1">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                    </div>

                    <div>
                      <Label htmlFor="requirements" className="text-base font-semibold">
                        Requirements from Buyer
                      </Label>
                      <Textarea
                        id="requirements"
                        placeholder="What information do you need from the buyer to get started? (e.g., project details, deadlines, specific requirements)"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        className="mt-2 min-h-24"
                      />
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold">Additional Options</h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Featured Gig</Label>
                          <p className="text-sm text-muted-foreground">Boost visibility for ₹50 extra</p>
                        </div>
                        <Switch
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Media & Preview */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Add media & preview</h2>
                    <p className="text-muted-foreground">Showcase your work with images and videos</p>
                  </div>

                  <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="images" className="space-y-4">
                      <div>
                        <Label className="text-base font-semibold">Gig Images (Up to 5)</Label>
                        <div className="mt-2">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>

                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Gig image ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeImage(image)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="video_url" className="text-base font-semibold">
                          Video URL (Optional)
                        </Label>
                        <Input
                          id="video_url"
                          placeholder="https://youtube.com/watch?v=..."
                          value={formData.video_url}
                          onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="preview">
                      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                            <h3 className="text-lg font-semibold mb-2">Gig Preview</h3>
                            <p className="text-muted-foreground mb-4">
                              This is how your gig will appear to potential buyers
                            </p>

                            {/* Mini Gig Card Preview */}
                            <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                              <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                                {formData.images[0] ? (
                                  <img
                                    src={formData.images[0] || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Camera className="h-8 w-8 text-gray-400" />
                                )}
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                                  {formData.title || "Your gig title will appear here"}
                                </h4>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-green-600 font-bold">₹{formData.price}</span>
                                  <span className="text-muted-foreground">{formData.delivery_days}d delivery</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-8 bg-transparent"
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Save Draft
                  </Button>

                  {currentStep < 4 ? (
                    <Button onClick={handleNext} className="px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-8 bg-gradient-to-r from-green-600 to-blue-600"
                    >
                      {loading ? "Publishing..." : "Publish Gig"}
                      {!loading && <TrendingUp className="ml-2 h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Tips */}
        <Card className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Award className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Tips for a Successful Gig</h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Use clear, descriptive titles that highlight your unique value</li>
                  <li>• Add high-quality images showcasing your previous work</li>
                  <li>• Price competitively based on your experience and market rates</li>
                  <li>• Respond quickly to messages and deliver on time</li>
                  <li>• Ask for reviews from satisfied clients to build credibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
