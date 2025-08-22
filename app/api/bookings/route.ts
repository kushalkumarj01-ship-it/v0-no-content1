import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  try {
    const { bookingId, status } = await request.json()
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update booking status
    const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId).eq("owner_id", user.id) // Only owner can update status

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}
