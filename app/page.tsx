import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ArrowRight, Users, Shield, Zap, MapPin, TrendingUp, Award, Clock } from "lucide-react"
import Link from "next/link"
import { GigCard } from "@/components/gig-card"
import { CategoryCard } from "@/components/category-card"
import { mockCategories, mockGigs } from "@/lib/mock-data"
import { Search } from "lucide-react" // Import Search component

// Enhanced categories with Pune context
const categoriesWithCount = [
  {
    ...mockCategories[0],
    name: "Academic Help",
    description: "Tutoring, Assignment Help, Research Support",
    gigCount: 450,
    trending: true,
  },
  {
    ...mockCategories[1],
    name: "Tech & Programming",
    description: "Web Dev, App Dev, Data Science, AI/ML",
    gigCount: 380,
    trending: true,
  },
  {
    ...mockCategories[2],
    name: "Design & Creative",
    description: "UI/UX, Graphics, Video Editing, Animation",
    gigCount: 290,
  },
  {
    ...mockCategories[3],
    name: "Content & Writing",
    description: "Technical Writing, Copywriting, Translation",
    gigCount: 220,
  },
  {
    ...mockCategories[4],
    name: "Business & Marketing",
    description: "Digital Marketing, Business Plans, Analytics",
    gigCount: 180,
  },
  {
    ...mockCategories[5],
    name: "Skills & Hobbies",
    description: "Music, Art, Fitness, Language Learning",
    gigCount: 150,
  },
]

// Enhanced featured gigs with Pune universities
const featuredGigs = [
  {
    ...mockGigs[0],
    title: "Professional Resume Design + ATS Optimization",
    description: "Get hired at top companies with a standout resume designed by COEP graduate",
    user: {
      ...mockGigs[0].user!,
      full_name: "Priya Sharma",
      college: "COEP Pune",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    price: 299,
    rating: 4.9,
    total_orders: 180,
    tags: ["resume", "ats", "career", "hiring"],
  },
  {
    ...mockGigs[1],
    title: "Python & Data Science Mentorship",
    description: "1-on-1 coding sessions with IIT Bombay alumnus, now at Microsoft",
    user: {
      ...mockGigs[1].user!,
      full_name: "Arjun Patel",
      college: "Pune University",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    price: 499,
    rating: 5.0,
    total_orders: 120,
    tags: ["python", "data-science", "mentorship", "coding"],
  },
  {
    ...mockGigs[2],
    title: "Modern UI/UX Design for Startups",
    description: "Complete app/web design with prototypes. Featured designer at Pune Design Week",
    user: {
      ...mockGigs[2].user!,
      full_name: "Sneha Kulkarni",
      college: "MIT Pune",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    price: 899,
    rating: 4.8,
    total_orders: 95,
    tags: ["ui-ux", "design", "startup", "prototype"],
  },
  {
    ...mockGigs[3],
    title: "Technical Content Writing & Documentation",
    description: "High-quality technical blogs and documentation by published author",
    user: {
      ...mockGigs[3].user!,
      full_name: "Rahul Deshmukh",
      college: "Symbiosis Pune",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    price: 399,
    rating: 4.9,
    total_orders: 150,
    tags: ["writing", "technical", "documentation", "content"],
  },
]

const testimonials = [
  {
    name: "Ananya Joshi",
    college: "Fergusson College",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    text: "Found an amazing Python tutor from COEP who helped me crack my placement interviews at TCS. The platform made it so easy to connect!",
    role: "Computer Science Student",
  },
  {
    name: "Vikram Singh",
    college: "SPPU",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    text: "Got my startup's entire branding done here - logo, website, everything! The designer was from MIT Pune and understood exactly what I needed.",
    role: "Entrepreneur",
  },
  {
    name: "Kavya Reddy",
    college: "VIT Pune",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    text: "The resume service here is incredible. Got 5 interview calls within 2 weeks of updating my resume. Highly recommend for placement prep!",
    role: "Final Year Student",
  },
]

const puneUniversities = [
  "University of Pune (SPPU)",
  "College of Engineering Pune (COEP)",
  "MIT World Peace University",
  "Symbiosis International University",
  "Fergusson College",
  "VIT Pune",
  "PICT Pune",
  "Bharati Vidyapeeth University",
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-500" />

        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                🇮🇳 Pune's #1 Student Marketplace
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Connect. Learn.
              <br />
              <span className="text-4xl md:text-6xl">Grow Together.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join Pune's largest community of talented students. Get expert help in academics, tech, design, and more
              from peers at top universities.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link href="/gigs">
                  <Search className="mr-3 h-5 w-5" />
                  Explore Services
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300 bg-transparent"
              >
                <Link href="/signup">
                  <Users className="mr-3 h-5 w-5" />
                  Join Community
                </Link>
              </Button>
            </div>

            {/* University Logos Carousel */}
            <div className="flex flex-wrap justify-center gap-4 opacity-60">
              <p className="text-sm text-muted-foreground mb-4 w-full">Trusted by students from:</p>
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                {puneUniversities.slice(0, 4).map((uni, index) => (
                  <span key={index} className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full">
                    {uni}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-muted-foreground font-medium">Active Students</div>
              <div className="text-xs text-green-600 mt-1">↗ +25% this month</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">15K+</div>
              <div className="text-muted-foreground font-medium">Projects Completed</div>
              <div className="text-xs text-green-600 mt-1">↗ +40% this month</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-muted-foreground font-medium">Universities</div>
              <div className="text-xs text-blue-600 mt-1">Across Maharashtra</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">4.9★</div>
              <div className="text-muted-foreground font-medium">Average Rating</div>
              <div className="text-xs text-green-600 mt-1">98% satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Popular Categories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              What Can You Learn Today?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From coding bootcamps to creative workshops, discover services across various domains by Pune's most
              talented students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithCount.map((category, index) => (
              <div key={category.id} className="group relative">
                <CategoryCard category={category} />
                {category.trending && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 animate-pulse">
                    🔥 Trending
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Services */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              ⭐ Featured Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Handpicked by Our Community</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Top-rated services from verified students at Pune's premier institutions. Quality guaranteed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredGigs.map((gig, index) => (
              <div key={gig.id} className="group relative">
                <GigCard gig={gig} />
                {index === 0 && (
                  <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    🏆 Best Seller
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8 py-6 text-lg bg-transparent">
              <Link href="/gigs">
                View All Services
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple. Secure. Successful.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Getting help or offering your skills has never been easier. Join thousands of successful collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="text-center border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">1. Browse & Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  Discover verified students from top Pune universities. Filter by skills, ratings, and university to
                  find your perfect match.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">2. Secure Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  Pay safely with our escrow system. Your money is protected until you're 100% satisfied with the
                  delivered work.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">3. Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  Receive high-quality work on time. Rate your experience and build lasting connections with talented
                  peers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              💬 Student Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Success Stories from Pune</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real experiences from students who found success through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
              >
                <CardContent className="pt-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center">
                    <Avatar className="h-14 w-14 mr-4 ring-2 ring-blue-100 dark:ring-blue-900">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-blue-600 font-medium">{testimonial.college}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">🚀 Ready to Start?</Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Join Pune's Student Revolution</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Whether you need help with academics or want to earn money with your skills, you're just one click away from
            success.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-10 py-6 rounded-xl bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/signup">
                <Users className="mr-3 h-5 w-5" />
                Sign Up Free
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 rounded-xl border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent transition-all duration-300"
              asChild
            >
              <Link href="/gigs">
                <Search className="mr-3 h-5 w-5" />
                Explore Services
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Verified Students</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
