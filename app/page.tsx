import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wheat, Tractor, Users, TrendingUp, Shield, Clock, MapPin, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wheat className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-primary">AgriLink</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="#marketplace"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/sign-up">Join AgriLink</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Connecting Farmers Across India
                </Badge>
                <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Transparent Crop Trade & Equipment Rental
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join thousands of farmers using AgriLink to sell crops directly, rent equipment affordably, and access
                  real-time market prices. No middlemen, just fair trade.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/auth/sign-up">Start Selling Today</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>10,000+ Farmers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wheat className="h-4 w-4" />
                  <span>50+ Crop Types</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>All States</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
                <img
                  src="/placeholder-vihz6.png"
                  alt="Farmer with crops"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Market Price Alert</p>
                    <p className="text-xs text-muted-foreground">Wheat: ₹2,150/quintal ↗️</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold">Everything Farmers Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From selling crops to renting equipment, AgriLink provides all the tools for modern farming success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wheat className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Crop Marketplace</CardTitle>
                <CardDescription>Sell directly to buyers without middlemen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Transparent pricing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Direct buyer connection</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Real-time market rates</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tractor className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="font-serif text-xl">Equipment Rental</CardTitle>
                <CardDescription>Rent farming equipment at fair prices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-secondary" />
                  <span>Flexible rental periods</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span>Local availability</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-secondary" />
                  <span>Verified equipment</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-serif text-xl">Market Analytics</CardTitle>
                <CardDescription>Make informed decisions with data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span>Price trend analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>Regional comparisons</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>Historical data</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold font-serif">10,000+</div>
              <div className="text-primary-foreground/80">Active Farmers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold font-serif">₹50L+</div>
              <div className="text-primary-foreground/80">Crops Traded</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold font-serif">2,500+</div>
              <div className="text-primary-foreground/80">Equipment Listed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold font-serif">28</div>
              <div className="text-primary-foreground/80">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold">Trusted by Farmers</h2>
            <p className="text-xl text-muted-foreground">See what farmers are saying about AgriLink</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "AgriLink helped me get 20% better prices for my wheat crop. No more dealing with middlemen!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">RK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rajesh Kumar</p>
                    <p className="text-xs text-muted-foreground">Punjab</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Renting a harvester through AgriLink saved me ₹15,000 compared to buying. Great platform!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">SP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Suresh Patel</p>
                    <p className="text-xs text-muted-foreground">Gujarat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The market price alerts help me decide the best time to sell. Very useful for small farmers like me."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">MS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Meera Singh</p>
                    <p className="text-xs text-muted-foreground">Uttar Pradesh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl lg:text-5xl font-bold">Ready to Transform Your Farming?</h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of farmers who are already earning more and farming smarter with AgriLink.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/auth/sign-up">Create Free Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Free to join • No hidden fees • Available in Hindi & English
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Wheat className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold">AgriLink</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting farmers across India for transparent crop trade and equipment rental.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Crop Marketplace
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Equipment Rental
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Market Prices
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Community
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 AgriLink. All rights reserved. Made with ❤️ for Indian farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
