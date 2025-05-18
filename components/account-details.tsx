"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import axios from "axios"

interface AccountDetailsProps {
  user: User
}

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})
  const { logout } = useAuth()
  const { toast } = useToast()
  const { clearCart } = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
  })

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      clearCart()
      const token = localStorage.getItem("token")
      await axios.get("http://localhost:8080/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getAccountDetails = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
          handleLogout()
          return
        }

        const response = await axios.get(
          `http://localhost:8080/api/account/getAccount?${new URLSearchParams({
            email: formData.email
          })}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        )

        // Ensure all values are strings and not null
        const data = response.data
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: data.country || "",
        })
      } catch (error) {
        console.error("Fetch error:", error)
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          handleLogout()
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch account details. Please try again.",
            variant: "destructive"
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    getAccountDetails()
  }, [])

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }
    if (!formData.city.trim()) {
      errors.city = "City is required"
    }
    if (!formData.state.trim()) {
      errors.state = "State is required"
    }
    if (!formData.zipCode.trim()) {
      errors.zipCode = "ZIP code is required"
    }
    if (!formData.country.trim()) {
      errors.country = "Country is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value || "" }))
    // Clear error when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        handleLogout()
        return
      }

      const payload = {
        fullName: formData.name,
        phoneNumber: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode
      }

      await axios.put(
        `http://localhost:8080/api/account/setAccount?${new URLSearchParams({
          email: formData.email
        })}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      setIsEditing(false)
      toast({
        title: "Success",
        description: "Your account details have been updated.",
      })
    } catch (error) {
      console.error("Update error:", error)
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        handleLogout()
      } else {
        toast({
          title: "Error",
          description: "Failed to update account details. Please try again.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>Manage your personal information and address</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  required
                  error={formErrors.name}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone || ""} 
                onChange={handleChange} 
                disabled={!isEditing || isLoading}
                error={formErrors.phone}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                error={formErrors.address}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city || ""} 
                  onChange={handleChange} 
                  disabled={!isEditing || isLoading}
                  error={formErrors.city}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State / Province
                </label>
                <Input 
                  id="state" 
                  name="state" 
                  value={formData.state || ""} 
                  onChange={handleChange} 
                  disabled={!isEditing || isLoading}
                  error={formErrors.state}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="zipCode" className="text-sm font-medium">
                  ZIP / Postal Code
                </label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  error={formErrors.zipCode}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  error={formErrors.country}
                />
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false)
                  setFormErrors({})
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
      {!isEditing && (
        <CardFooter>
          <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

