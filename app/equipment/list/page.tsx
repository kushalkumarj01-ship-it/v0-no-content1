"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tractor, ArrowLeft, Wheat } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function ListEquipmentPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    equipment_name: "",
    equipment_type: "tractor",
    brand: "",
    model: "",
    year_manufactured: "",
    condition: "good",
    rental_price_per_day: "",
    location: "",
    description: "",
    maintenance_date: "",
  })

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Equipment form data:", formData)
      console.log("[v0] User ID:", user.id)

      if (!formData.equipment_name || !formData.rental_price_per_day || !formData.location) {
        throw new Error("Please fill in all required fields")
      }

      const equipmentData = {
        owner_id: user.id,
        equipment_name: formData.equipment_name,
        equipment_type: formData.equipment_type,
        brand: formData.brand || null,
        model: formData.model || null,
        year_manufactured: formData.year_manufactured ? Number.parseInt(formData.year_manufactured) : null,
        condition: formData.condition,
        rental_price_per_day: Number.parseFloat(formData.rental_price_per_day),
        location: formData.location,
        description: formData.description || null,
        maintenance_date: formData.maintenance_date || null,
        available: true,
      }

      console.log("[v0] Equipment data to insert:", equipmentData)

      const { data, error } = await supabase.from("equipment").insert(equipmentData).select()

      console.log("[v0] Insert result:", { data, error })

      if (error) {
        console.log("[v0] Database error details:", error)
        throw error
      }

      console.log("[v0] Equipment added successfully")
      setSuccess(true)
      setTimeout(() => {
        router.push("/equipment")
      }, 2000)
    } catch (error: unknown) {
      console.log("[v0] Equipment form error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tractor className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="font-serif text-2xl font-bold mb-2">Equipment Listed Successfully!</h2>
            <p className="text-muted-foreground mb-4">Your equipment is now available for rental.</p>
            <Button asChild>
              <Link href="/equipment">View Equipment</Link>
            </Button>
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace">Marketplace</Link>
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

      {/* Form */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h1 className="font-serif text-3xl font-bold">List Your Equipment</h1>
            <p className="text-muted-foreground">
              Rent out your farming equipment and earn extra income when not in use
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="font-serif">Equipment Details</CardTitle>
              <CardDescription>Provide accurate information to attract renters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment_name">Equipment Name *</Label>
                    <Input
                      id="equipment_name"
                      placeholder="e.g., John Deere 5050D"
                      required
                      value={formData.equipment_name}
                      onChange={(e) => handleInputChange("equipment_name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipment_type">Equipment Type *</Label>
                    <Select
                      value={formData.equipment_type}
                      onValueChange={(value) => handleInputChange("equipment_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., John Deere"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., 5050D"
                      value={formData.model}
                      onChange={(e) => handleInputChange("model", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year_manufactured">Year</Label>
                    <Input
                      id="year_manufactured"
                      type="number"
                      placeholder="2020"
                      min="1990"
                      max="2024"
                      value={formData.year_manufactured}
                      onChange={(e) => handleInputChange("year_manufactured", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rental_price_per_day">Rental Price per Day (₹) *</Label>
                    <Input
                      id="rental_price_per_day"
                      type="number"
                      step="0.01"
                      placeholder="1500"
                      required
                      value={formData.rental_price_per_day}
                      onChange={(e) => handleInputChange("rental_price_per_day", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Ludhiana, Punjab"
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance_date">Last Maintenance Date</Label>
                  <Input
                    id="maintenance_date"
                    type="date"
                    value={formData.maintenance_date}
                    onChange={(e) => handleInputChange("maintenance_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your equipment condition, features, usage instructions, etc."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Listing Equipment..." : "List Equipment for Rental"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
