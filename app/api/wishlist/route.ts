import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { cropId, action } = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (action === "add") {
      const { data: farmer } = await supabase.from("farmers").select("wishlist").eq("id", user.id).single()

      const currentWishlist = farmer?.wishlist || []
      if (!currentWishlist.includes(cropId)) {
        const { error } = await supabase
          .from("farmers")
          .update({ wishlist: [...currentWishlist, cropId] })
          .eq("id", user.id)

        if (error) throw error
      }
    } else if (action === "remove") {
      const { data: farmer } = await supabase.from("farmers").select("wishlist").eq("id", user.id).single()

      const currentWishlist = farmer?.wishlist || []
      const { error } = await supabase
        .from("farmers")
        .update({ wishlist: currentWishlist.filter((id: string) => id !== cropId) })
        .eq("id", user.id)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wishlist error:", error)
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 })
  }
}
