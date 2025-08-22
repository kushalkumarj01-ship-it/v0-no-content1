import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wheat, MapPin, Calendar, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function MarketplacePage() {
  const supabase = await createClient()

  // Get all available crops with farmer information
  const { data: crops, error } = await supabase
    .from("crops")
    .select(`
      *,
      farmers (
        full_name,
        location
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching crops:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wheat className="h-8 w-8 text-primary" />
              <Link href="/" className="font-serif text-2xl font-bold text-primary">
                AgriLink
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/equipment">Equipment</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Join AgriLink</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl font-bold">Crop Marketplace</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Buy fresh crops directly from farmers across India. No middlemen, fair prices.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search crops..." className="pl-10 h-11" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Crop Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="corn">Corn</SelectItem>
                  <SelectItem value="sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Crops Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {crops && crops.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {crops.map((crop) => (
                <Card key={crop.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="aspect-square relative bg-muted">
                    {crop.image_url ? (
                      <Image
                        src={crop.image_url || "/placeholder.svg"}
                        alt={crop.crop_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Wheat className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    {crop.organic && <Badge className="absolute top-2 left-2 bg-green-500">Organic</Badge>}
                    {crop.quality_grade && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        Grade {crop.quality_grade}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-lg">{crop.crop_name}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">₹{crop.price_per_unit}</div>
                        <div className="text-xs text-muted-foreground">per {crop.unit}</div>
                      </div>
                    </div>
                    {crop.variety && <CardDescription className="text-sm">{crop.variety}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">
                        {crop.quantity} {crop.unit}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{crop.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Harvest: {new Date(crop.harvest_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>By: {crop.farmers?.full_name || "Unknown Farmer"}</span>
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/marketplace/crop/${crop.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No crops available</h3>
              <p className="text-muted-foreground mb-6">Be the first to list your crops in the marketplace!</p>
              <Button asChild>
                <Link href="/marketplace/sell">List Your Crops</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
