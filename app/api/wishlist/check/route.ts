import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cropId = searchParams.get("cropId")

    if (!cropId) {
      return NextResponse.json({ error: "Crop ID required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ isInWishlist: false })
    }

    // Check if crop is in wishlist
    const { data: farmer } = await supabase.from("farmers").select("wishlist").eq("id", user.id).single()

    const currentWishlist = farmer?.wishlist || []
    const isInWishlist = currentWishlist.includes(cropId)

    return NextResponse.json({ isInWishlist })
  } catch (error) {
    console.error("Wishlist check error:", error)
    return NextResponse.json({ isInWishlist: false })
  }
}
