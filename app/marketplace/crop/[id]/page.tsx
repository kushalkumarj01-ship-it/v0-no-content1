import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wheat, MapPin, Calendar, User, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import ContactFarmerButton from "./contact-farmer-button"
import WishlistButton from "./wishlist-button"

export default async function CropDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  console.log("[v0] Fetching crop with ID:", params.id)

  // Get crop details with farmer information - removed available filter to show all crops
  const { data: crop, error } = await supabase
    .from("crops")
    .select(`
      *,
      farmers (
        id,
        full_name,
        phone,
        location,
        farming_experience
      )
    `)
    .eq("id", params.id)
    .single()

  console.log("[v0] Crop query result:", { crop, error })

  if (error) {
    console.log("[v0] Database error:", error)
    notFound()
  }

  if (!crop) {
    console.log("[v0] No crop found with ID:", params.id)
    notFound()
  }

  const isAvailable = crop.available

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
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

      {/* Crop Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isAvailable && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">⚠️ This crop is currently not available for purchase.</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-muted rounded-xl overflow-hidden">
              {crop.image_url ? (
                <Image src={crop.image_url || "/placeholder.svg"} alt={crop.crop_name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Wheat className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                {crop.organic && <Badge className="bg-green-500">Organic</Badge>}
                {crop.quality_grade && <Badge variant="secondary">Grade {crop.quality_grade}</Badge>}
                <Badge variant={isAvailable ? "default" : "secondary"}>
                  {isAvailable ? "Available" : "Not Available"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-4xl font-bold">{crop.crop_name}</h1>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">₹{crop.price_per_unit}</div>
                  <div className="text-sm text-muted-foreground">per {crop.unit}</div>
                </div>
              </div>

              {crop.variety && <p className="text-xl text-muted-foreground">{crop.variety}</p>}

              {crop.description && <p className="text-muted-foreground leading-relaxed">{crop.description}</p>}
            </div>

            <Separator />

            {/* Crop Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Quantity Available
                  </h3>
                  <p className="text-2xl font-bold">
                    {crop.quantity} {crop.unit}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Location</h3>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{crop.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {crop.harvest_date && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Harvest Date
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(crop.harvest_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {crop.expiry_date && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Best Before</h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(crop.expiry_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Farmer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{crop.farmers?.full_name || "Unknown Farmer"}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{crop.farmers?.location}</span>
                    </div>
                  </div>
                  {crop.farmers?.farming_experience && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-semibold">{crop.farmers.farming_experience} years</p>
                    </div>
                  )}
                </div>

                {crop.farmers?.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{crop.farmers.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ContactFarmerButton
                farmerId={crop.farmers?.id}
                farmerName={crop.farmers?.full_name || "Unknown Farmer"}
                farmerPhone={crop.farmers?.phone}
                cropId={crop.id}
              />
              <WishlistButton cropId={crop.id} />
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <p>Listed on {new Date(crop.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
