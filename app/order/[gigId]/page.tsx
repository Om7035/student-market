"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Wallet,
  Lock,
  Smartphone,
  Globe,
  AlertCircle,
} from "lucide-react"
import { mockGigs } from "@/lib/mock-data"
import type { Gig } from "@/lib/types"

interface PaymentMethod {
  id: string
  type: "card" | "upi" | "wallet" | "netbanking"
  name: string
  icon: React.ReactNode
  description: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "upi",
    type: "upi",
    name: "UPI",
    icon: <Smartphone className="h-5 w-5" />,
    description: "Pay instantly with UPI (Google Pay, PhonePe, Paytm)",
  },
  {
    id: "wallet",
    type: "wallet",
    name: "Student Market Wallet",
    icon: <Wallet className="h-5 w-5" />,
    description: "Use your wallet balance (₹2,500 available)",
  },
  {
    id: "card",
    type: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Visa, Mastercard, RuPay cards accepted",
  },
  {
    id: "netbanking",
    type: "netbanking",
    name: "Net Banking",
    icon: <Globe className="h-5 w-5" />,
    description: "All major Indian banks supported",
  },
]

export default function OrderPage() {
  const params = useParams()
  const router = useRouter()
  const [gig, setGig] = useState<Gig | null>(null)
  const [selectedPayment, setSelectedPayment] = useState("upi")
  const [requirements, setRequirements] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderStep, setOrderStep] = useState(1)

  useEffect(() => {
    const gigData = mockGigs.find((g) => g.id === params.gigId) || mockGigs[0]
    setGig(gigData)
  }, [params.gigId])

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create order and redirect to success page
      router.push(`/order/success?orderId=${Date.now()}`)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const platformFee = gig ? Math.round(gig.price * 0.05) : 0
  const totalAmount = gig ? gig.price + platformFee : 0

  if (!gig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gig not found</h1>
          <Button onClick={() => router.push("/gigs")}>Browse Gigs</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Order</h1>
            <p className="text-muted-foreground">Secure payment with buyer protection</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step <= orderStep
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {step < orderStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      step < orderStep ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gig Details */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                      {gig.images?.[0] ? (
                        <img
                          src={gig.images[0] || "/placeholder.svg"}
                          alt={gig.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Star className="h-8 w-8 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{gig.title}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={gig.user?.avatar_url || "/placeholder.svg"} alt={gig.user?.full_name} />
                          <AvatarFallback>{gig.user?.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{gig.user?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{gig.user?.college}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {gig.delivery_days} days delivery
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {gig.rating} ({gig.total_orders} reviews)
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Project Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="requirements">Describe your requirements in detail</Label>
                      <Textarea
                        id="requirements"
                        placeholder="Please provide detailed information about what you need..."
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="mt-2 min-h-32"
                      />
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Be as specific as possible to ensure the seller delivers exactly what you need.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedPayment === method.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-blue-600">{method.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{method.name}</h4>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                              selectedPayment === method.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {selectedPayment === method.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Service Price</span>
                    <span className="font-semibold">₹{gig.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform Fee (5%)</span>
                    <span>₹{platformFee.toLocaleString("en-IN")}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>

                  <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        disabled={!requirements.trim()}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Pay Securely
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Confirm Payment</DialogTitle>
                        <DialogDescription>
                          You're about to pay ₹{totalAmount.toLocaleString("en-IN")} for this service
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            Your payment is protected. Money will be held in escrow until you approve the delivery.
                          </AlertDescription>
                        </Alert>
                        <Button
                          onClick={handlePlaceOrder}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600"
                        >
                          {loading ? "Processing..." : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="text-xs text-muted-foreground text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Shield className="h-3 w-3" />
                      <span>100% Secure Payment</span>
                    </div>
                    <p>Your payment is protected by Student Market's buyer protection policy</p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 text-center">Why Choose Student Market?</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Secure escrow system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>24/7 student support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Verified student sellers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
