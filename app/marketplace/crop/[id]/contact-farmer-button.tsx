"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ContactFarmerButtonProps {
  farmerId?: string
  farmerName: string
  farmerPhone?: string
  cropId?: string
}

export default function ContactFarmerButton({ farmerId, farmerName, farmerPhone, cropId }: ContactFarmerButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messageSent, setMessageSent] = useState(false)
  const router = useRouter()

  const handleContact = async () => {
    if (!farmerId) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: farmerId,
          cropId: cropId,
          subject: subject || `Inquiry about your crop`,
          message,
        }),
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      if (data.success) {
        setMessageSent(true)
        setMessage("")
        setSubject("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full text-lg">
          <MessageCircle className="h-5 w-5 mr-2" />
          Contact Farmer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {farmerName}</DialogTitle>
          <DialogDescription>
            {messageSent ? "Your message has been sent successfully!" : "Send a message to connect with the farmer."}
          </DialogDescription>
        </DialogHeader>

        {messageSent ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">✓ Message sent successfully!</p>
              <p className="text-green-600 text-sm mt-1">
                The farmer will receive your message and can respond directly.
              </p>
            </div>

            {farmerPhone && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">You can also call directly</p>
                  <p className="text-sm text-muted-foreground">{farmerPhone}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard/messages")} variant="outline" className="flex-1">
                View Messages
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Inquiry about your crop"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'm interested in your crops. Could you provide more details about availability and pricing?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1"
                rows={4}
                required
              />
            </div>
            <Button onClick={handleContact} disabled={isLoading || !message.trim()} className="w-full">
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
