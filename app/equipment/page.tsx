import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tractor, MapPin, Search, Filter, Wheat } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function EquipmentPage() {
  const supabase = await createClient()

  // Get all available equipment with owner information
  const { data: equipment, error } = await supabase
    .from("equipment")
    .select(`
      *,
      farmers (
        full_name,
        location
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching equipment:", error)
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
                <Link href="/marketplace">Marketplace</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/equipment/list">List Equipment</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary/10 to-accent/10 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl font-bold">Equipment Rental</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rent farming equipment from fellow farmers. Save money, access modern tools.
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
              <Input placeholder="Search equipment..." className="pl-10 h-11" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40 h-11">
                  <SelectValue placeholder="Equipment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tractor">Tractor</SelectItem>
                  <SelectItem value="harvester">Harvester</SelectItem>
                  <SelectItem value="plough">Plough</SelectItem>
                  <SelectItem value="seeder">Seeder</SelectItem>
                  <SelectItem value="sprayer">Sprayer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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

      {/* Equipment Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {equipment && equipment.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {equipment.map((item) => (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="aspect-square relative bg-muted">
                    {item.image_url ? (
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.equipment_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tractor className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className={`absolute top-2 right-2 ${
                        item.condition === "excellent"
                          ? "bg-green-500"
                          : item.condition === "good"
                            ? "bg-blue-500"
                            : item.condition === "fair"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                    >
                      {item.condition}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-lg">{item.equipment_name}</CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-secondary">₹{item.rental_price_per_day}</div>
                        <div className="text-xs text-muted-foreground">per day</div>
                      </div>
                    </div>
                    <CardDescription className="text-sm capitalize">{item.equipment_type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.brand && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Brand:</span>
                        <span className="font-medium">{item.brand}</span>
                      </div>
                    )}
                    {item.model && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-medium">{item.model}</span>
                      </div>
                    )}
                    {item.year_manufactured && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium">{item.year_manufactured}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Owner: {item.farmers?.full_name || "Unknown"}</span>
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/equipment/${item.id}`}>View Details & Book</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tractor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No equipment available</h3>
              <p className="text-muted-foreground mb-6">Be the first to list your equipment for rental!</p>
              <Button asChild>
                <Link href="/equipment/list">List Your Equipment</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
