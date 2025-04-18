"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import AccountDetails from "@/components/account-details"
import OrderHistory from "@/components/order-history"
import Notifications from "@/components/notifications"
// Add this import at the top of the file
import MyMessages from '@/components/my-messages'
import axios from "axios"

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [name,setName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  useEffect(() => {
    const getAccount = async() =>{
      try{
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:8080/api/account/getAccount",{
          headers: {
            Authorization: `Bearer ${token}`
          },
          params:{
            email:user?.email
          }
        }
        )
        setName(response.data.name)
      }catch(error){
        console.log("Error: "+error)
      }
    }
    getAccount()
  },[]);

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-gray-500">Welcome back, {name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-4">
          <TabsTrigger value="details">Account Details</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="messages">My Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <AccountDetails user={user} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>

        <TabsContent value="notifications">
          <Notifications />
        </TabsContent>

        <TabsContent value="messages">
          <MyMessages user={user} />
        </TabsContent>

      </Tabs>
    </div>
  )
}

