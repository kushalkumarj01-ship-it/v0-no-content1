import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { farmerId, message, contactInfo } = await request.json()
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get farmer details
    const { data: farmer, error: farmerError } = await supabase
      .from("farmers")
      .select("full_name, phone, location")
      .eq("id", farmerId)
      .single()

    if (farmerError || !farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 })
    }

    // In a real app, you would send an email or SMS here
    // For now, we'll just return success with farmer contact info
    return NextResponse.json({
      success: true,
      farmer: {
        name: farmer.full_name,
        phone: farmer.phone,
        location: farmer.location,
      },
      message: "Contact information retrieved successfully",
    })
  } catch (error) {
    console.error("Contact farmer error:", error)
    return NextResponse.json({ error: "Failed to contact farmer" }, { status: 500 })
  }
}
