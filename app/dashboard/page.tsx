import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wheat, Tractor, TrendingUp, Plus, Eye, Edit, Calendar, MapPin, Phone, Mail, User } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get farmer profile
  const { data: farmer } = await supabase.from("farmers").select("*").eq("id", data.user.id).single()

  // Get farmer's crops
  const { data: crops } = await supabase
    .from("crops")
    .select("*")
    .eq("farmer_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get farmer's equipment
  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get bookings as renter
  const { data: myBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      equipment (
        equipment_name,
        equipment_type,
        rental_price_per_day
      ),
      farmers!bookings_owner_id_fkey (
        full_name,
        phone
      )
    `)
    .eq("renter_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get bookings for my equipment
  const { data: equipmentBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      equipment (
        equipment_name,
        equipment_type
      ),
      farmers!bookings_renter_id_fkey (
        full_name,
        phone
      )
    `)
    .eq("owner_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Calculate statistics
  const totalCrops = crops?.length || 0
  const totalEquipment = equipment?.length || 0
  const totalBookings = (myBookings?.length || 0) + (equipmentBookings?.length || 0)
  const totalRevenue = crops?.reduce((sum, crop) => sum + crop.price_per_unit * crop.quantity, 0) || 0

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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/equipment">Equipment</Link>
              </Button>
              <span className="text-sm text-muted-foreground">Welcome, {farmer?.full_name || "Farmer"}!</span>
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold">Farmer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your crops, equipment, and track your farming business performance
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Crops Listed</CardTitle>
                <Wheat className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCrops}</div>
                <p className="text-xs text-muted-foreground">Active listings</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipment Listed</CardTitle>
                <Tractor className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEquipment}</div>
                <p className="text-xs text-muted-foreground">Available for rent</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-xs text-muted-foreground">Rental transactions</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From crop listings</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wheat className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Sell Crops</CardTitle>
                <CardDescription>List your crops in the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/marketplace/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Crop Listing
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tractor className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="font-serif text-xl">Rent Equipment</CardTitle>
                <CardDescription>Find equipment for your farming needs</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/equipment">Browse Equipment</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-serif text-xl">List Equipment</CardTitle>
                <CardDescription>Rent out your equipment to earn</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/equipment/list">List Equipment</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="crops" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="crops">My Crops</TabsTrigger>
              <TabsTrigger value="equipment">My Equipment</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* My Crops Tab */}
            <TabsContent value="crops" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold">My Crop Listings</h2>
                <Button asChild>
                  <Link href="/marketplace/sell">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Crop
                  </Link>
                </Button>
              </div>

              {crops && crops.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {crops.map((crop) => (
                    <Card key={crop.id} className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-serif text-lg">{crop.crop_name}</CardTitle>
                          <Badge variant={crop.available ? "default" : "secondary"}>
                            {crop.available ? "Available" : "Sold"}
                          </Badge>
                        </div>
                        {crop.variety && <CardDescription>{crop.variety}</CardDescription>}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-medium">
                            {crop.quantity} {crop.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">
                            ₹{crop.price_per_unit}/{crop.unit}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{crop.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                            <Link href={`/marketplace/crop/${crop.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Wheat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">No crops listed yet</h3>
                    <p className="text-muted-foreground mb-6">Start by listing your first crop in the marketplace!</p>
                    <Button asChild>
                      <Link href="/marketplace/sell">List Your First Crop</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* My Equipment Tab */}
            <TabsContent value="equipment" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold">My Equipment</h2>
                <Button asChild>
                  <Link href="/equipment/list">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Link>
                </Button>
              </div>

              {equipment && equipment.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equipment.map((item) => (
                    <Card key={item.id} className="border-0 shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-serif text-lg">{item.equipment_name}</CardTitle>
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? "Available" : "Rented"}
                          </Badge>
                        </div>
                        <CardDescription className="capitalize">{item.equipment_type}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Daily Rate:</span>
                          <span className="font-medium">₹{item.rental_price_per_day}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium capitalize">{item.condition}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                            <Link href={`/equipment/${item.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Tractor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">No equipment listed yet</h3>
                    <p className="text-muted-foreground mb-6">
                      List your farming equipment to earn extra income when not in use!
                    </p>
                    <Button asChild>
                      <Link href="/equipment/list">List Your Equipment</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* My Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <h2 className="font-serif text-2xl font-bold">Booking Management</h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* My Rental Requests */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-semibold">My Rental Requests</h3>
                  {myBookings && myBookings.length > 0 ? (
                    <div className="space-y-4">
                      {myBookings.map((booking) => (
                        <Card key={booking.id} className="border-0 shadow-lg">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{booking.equipment?.equipment_name}</CardTitle>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "pending"
                                      ? "secondary"
                                      : booking.status === "completed"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <CardDescription className="capitalize">
                              {booking.equipment?.equipment_type}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{booking.total_days} days</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Total Amount:</span>
                              <span className="font-medium">₹{booking.total_amount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Dates:</span>
                              <span>
                                {new Date(booking.start_date).toLocaleDateString()} -{" "}
                                {new Date(booking.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>Owner: {booking.farmers?.full_name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">No rental requests yet</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Equipment Booking Requests */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-semibold">Equipment Booking Requests</h3>
                  {equipmentBookings && equipmentBookings.length > 0 ? (
                    <div className="space-y-4">
                      {equipmentBookings.map((booking) => (
                        <Card key={booking.id} className="border-0 shadow-lg">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{booking.equipment?.equipment_name}</CardTitle>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "pending"
                                      ? "secondary"
                                      : booking.status === "completed"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <CardDescription>Requested by {booking.farmers?.full_name}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{booking.total_days} days</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Total Amount:</span>
                              <span className="font-medium">₹{booking.total_amount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Dates:</span>
                              <span>
                                {new Date(booking.start_date).toLocaleDateString()} -{" "}
                                {new Date(booking.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            {booking.status === "pending" && (
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="flex-1">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                  Decline
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">No booking requests yet</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <h2 className="font-serif text-2xl font-bold">Farmer Profile</h2>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Full Name
                        </h3>
                        <p className="text-lg">{farmer?.full_name || "Not provided"}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Email</h3>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{data.user.email}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Phone Number
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{farmer?.phone || "Not provided"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Location
                        </h3>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{farmer?.location || "Not provided"}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Farm Size
                        </h3>
                        <p className="text-lg">{farmer?.farm_size ? `${farmer.farm_size} acres` : "Not provided"}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Farming Experience
                        </h3>
                        <p className="text-lg">
                          {farmer?.farming_experience ? `${farmer.farming_experience} years` : "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
