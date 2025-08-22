import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Wheat } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Wheat className="h-8 w-8 text-primary" />
              <span className="font-serif text-2xl font-bold text-primary">AgriLink</span>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-serif">Account Created!</CardTitle>
              <CardDescription>Welcome to the AgriLink farming community</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">Check your email to verify your account</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification link to your email address. Please click the link to activate your account
                  and start using AgriLink.
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/auth/login">Continue to Sign In</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Didn't receive the email? Check your spam folder or contact support.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
