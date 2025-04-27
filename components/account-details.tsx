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

interface AccountDetailsProps {
  user: User
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const {logout} = useAuth()
  const { toast } = useToast()
  const {clearCart} = useCart()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
  })

  // TODO : logOut
  const handleLogout = () => {
    clearCart()
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  useEffect(() => {
    const getAccountDetails = async() =>{
      try{
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8080/api/account/getAccount?"+new URLSearchParams({
          email:formData.email
        }), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        // TODO : jwt Expired
        if (response.status === 401 || response.status === 403) {
          handleLogout()
        }

      const data = await response.json();

      setFormData(data)
      }catch(error){
      }
    }

    getAccountDetails();

  },[]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      fullName:formData.name,
      phoneNumber:formData.phone,
      address:formData.address,
      city:formData.city,
      state:formData.state,
      country:formData.country,
      zipCode:formData.zipCode
    }

    try{
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/account/setAccount?"+new URLSearchParams({
        email:formData.email
      }), {
        method:"PUT",
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body:JSON.stringify(payload)
      })
      if(response.status === 200){
      setIsEditing(false)
      }

    }catch(error){
      console.log("Error"+error)
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
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
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
                  value={formData.email}
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
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State / Province
                </label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} disabled={!isEditing} />
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
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          )}
        </form>
      </CardContent>
      {!isEditing && (
        <CardFooter>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </CardFooter>
      )}
    </Card>
  )
}

