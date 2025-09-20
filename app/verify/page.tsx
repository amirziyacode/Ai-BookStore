"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import axios from "axios"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [verificationCode, setVerificationCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const [isCountdownActive, setIsCountdownActive] = useState(true)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // 5-minute countdown timer
  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setIsCountdownActive(false)
    }
  }, [countdown, isCountdownActive])

  // Format countdown time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      })
      return
    }

    if (!isCountdownActive) {
      toast({
        title: "Code Expired",
        description: "Your verification code has expired. Please request a new one.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.get(`http://localhost:8080/api/auth/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`)

      if (response.status === 200) {
        setIsVerified(true)
        toast({
          title: "Email Verified Successfully",
          description: "Your email has been verified. You can now login to your account.",
        })
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Verification failed. Please try again."
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    try {
      await axios.get(`http://localhost:8080/api/auth/resend-verification?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`)

      setResendCooldown(60) // 60 seconds cooldown
      setCountdown(300) // Reset 5-minute countdown
      setIsCountdownActive(true)
      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend verification code."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  if (isVerified) {
    return (
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You will be redirected to the login page shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your email address.
            {isCountdownActive && (
              <div className="mt-2 text-sm text-orange-600 font-medium">
                ⏰ Code expires in: {formatTime(countdown)}
              </div>
            )}
            {!isCountdownActive && (
              <div className="mt-2 text-sm text-red-600 font-medium">
                ⚠️ Verification code has expired. Please request a new one.
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="verification-code" className="text-sm font-medium">
                Verification Code
              </label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                required
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !isCountdownActive}
            >
              {isSubmitting ? "Verifying..." : !isCountdownActive ? "Code Expired" : "Verify Email"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : "Resend Code"
              }
            </Button>
            {!isCountdownActive && (
              <p className="text-xs text-red-500 mt-2">
                Your verification code has expired. Click "Resend Code" to get a new one.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-gray-500 hover:underline">
            <ArrowLeft className="mr-1 h-3 w-3 inline" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
