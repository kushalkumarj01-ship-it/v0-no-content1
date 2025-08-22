"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tractor, MapPin, Calendar, User, Phone, ArrowLeft, Wheat } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EquipmentDetailPage({ params }: { params: { id: string } }) {
  const [equipment, setEquipment] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [bookingData, setBookingData] = useState({
    start_date: "",
    end_date: "",
    notes: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Get equipment details
      const { data: equipmentData, error } = await supabase
        .from("equipment")
        .select(`
          *,
          farmers (
            full_name,
            phone,
            location,
            farming_experience
          )
        `)
        .eq("id", params.id)
        .eq("available", true)
        .single()

      if (error) {
        setError("Equipment not found")
      } else {
        setEquipment(equipmentData)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [params.id, supabase])

  const calculateDays = () => {
    if (!bookingData.start_date || !bookingData.end_date) return 0
    const start = new Date(bookingData.start_date)
    const end = new Date(bookingData.end_date)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const calculateTotal = () => {
    const days = calculateDays()
    return days * (equipment?.rental_price_per_day || 0)
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsBooking(true)
    setError(null)

    try {
      const days = calculateDays()
      const total = calculateTotal()

      const { error } = await supabase.from("bookings").insert({
        equipment_id: equipment.id,
        renter_id: user.id,
        owner_id: equipment.owner_id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        total_days: days,
        total_amount: total,
        notes: bookingData.notes || null,
        status: "pending",
      })

      if (error) throw error

      setBookingSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Tractor className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p>Loading equipment details...</p>
        </div>
      </div>
    )
  }

  if (error || !equipment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="font-serif text-2xl font-bold mb-2">Equipment Not Found</h2>
            <p className="text-muted-foreground mb-4">The equipment you're looking for is not available.</p>
            <Button asChild>
              <Link href="/equipment">Browse Equipment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tractor className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-2">Booking Request Sent!</h2>
            <p className="text-muted-foreground mb-4">
              Your booking request has been sent to the equipment owner. They will contact you soon.
            </p>
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/equipment">Browse More Equipment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/equipment">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Equipment
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Wheat className="h-8 w-8 text-primary" />
              <Link href="/" className="font-serif text-2xl font-bold text-primary">
                AgriLink
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Equipment Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-muted rounded-xl overflow-hidden">
              {equipment.image_url ? (
                <Image
                  src={equipment.image_url || "/placeholder.svg"}
                  alt={equipment.equipment_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tractor className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge
                  className={`${
                    equipment.condition === "excellent"
                      ? "bg-green-500"
                      : equipment.condition === "good"
                        ? "bg-blue-500"
                        : equipment.condition === "fair"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                >
                  {equipment.condition}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-4xl font-bold">{equipment.equipment_name}</h1>
                <div className="text-right">
                  <div className="text-4xl font-bold text-secondary">₹{equipment.rental_price_per_day}</div>
                  <div className="text-sm text-muted-foreground">per day</div>
                </div>
              </div>

              <p className="text-xl text-muted-foreground capitalize">{equipment.equipment_type}</p>

              {equipment.description && (
                <p className="text-muted-foreground leading-relaxed">{equipment.description}</p>
              )}
            </div>

            <Separator />

            {/* Equipment Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {equipment.brand && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Brand</h3>
                    <p className="text-lg font-medium">{equipment.brand}</p>
                  </div>
                )}

                {equipment.model && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Model</h3>
                    <p className="text-lg font-medium">{equipment.model}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location</h3>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{equipment.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {equipment.year_manufactured && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Year</h3>
                    <p className="text-lg font-medium">{equipment.year_manufactured}</p>
                  </div>
                )}

                {equipment.maintenance_date && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Last Maintenance
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(equipment.maintenance_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Equipment Owner</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{equipment.farmers?.full_name || "Unknown Owner"}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{equipment.farmers?.location}</span>
                    </div>
                  </div>
                  {equipment.farmers?.farming_experience && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-semibold">{equipment.farmers.farming_experience} years</p>
                    </div>
                  )}
                </div>

                {equipment.farmers?.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{equipment.farmers.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Form */}
            {user && user.id !== equipment.owner_id && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Book This Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input
                          id="start_date"
                          type="date"
                          required
                          min={new Date().toISOString().split("T")[0]}
                          value={bookingData.start_date}
                          onChange={(e) => setBookingData((prev) => ({ ...prev, start_date: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date *</Label>
                        <Input
                          id="end_date"
                          type="date"
                          required
                          min={bookingData.start_date || new Date().toISOString().split("T")[0]}
                          value={bookingData.end_date}
                          onChange={(e) => setBookingData((prev) => ({ ...prev, end_date: e.target.value }))}
                        />
                      </div>
                    </div>

                    {bookingData.start_date && bookingData.end_date && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span>Duration: {calculateDays()} days</span>
                          <span className="font-bold text-lg">Total: ₹{calculateTotal()}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requirements or notes for the owner..."
                        rows={3}
                        value={bookingData.notes}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>

                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isBooking}>
                      {isBooking ? "Sending Booking Request..." : "Send Booking Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">Please sign in to book this equipment</p>
                  <Button asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {user && user.id === equipment.owner_id && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">This is your equipment listing</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
