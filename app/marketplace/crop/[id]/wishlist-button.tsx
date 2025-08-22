"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  cropId: string
}

export default function WishlistButton({ cropId }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(`/api/wishlist/check?cropId=${cropId}`)
        if (response.ok) {
          const data = await response.json()
          setIsInWishlist(data.isInWishlist)
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    checkWishlistStatus()
  }, [cropId])

  const handleWishlist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId,
          action: isInWishlist ? "remove" : "add",
        }),
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      if (data.success) {
        setIsInWishlist(!isInWishlist)
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isInitialized) {
    return (
      <Button size="lg" variant="outline" className="w-full text-lg bg-transparent" disabled>
        <Heart className="h-5 w-5 mr-2" />
        Loading...
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      variant="outline"
      className="w-full text-lg bg-transparent"
      onClick={handleWishlist}
      disabled={isLoading}
    >
      <Heart className={`h-5 w-5 mr-2 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
      {isLoading ? "Updating..." : isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
