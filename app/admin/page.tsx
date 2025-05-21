"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Package, Users, Settings, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import BooksManagement from "@/components/admin/books-management"
import OrdersManagement from "@/components/admin/orders-management"
import UsersManagement from "@/components/admin/users-management"
import { Toaster } from "@/components/ui/toaster"
import axios from "axios"

export default function AdminPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    activeUsers: 0
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log(token)
    if (!isAuthenticated || user?.role !== "ADMIN" ) {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const [booksRes, ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/getAllBooks", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8080/api/admin/getAllOrders", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:8080/api/admin/getAllUsers", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setStats({
        totalBooks: booksRes.data.length || 0,
        totalOrders: ordersRes.data.length || 0,
        totalUsers: usersRes.data.length || 0,
        activeUsers: usersRes.data.filter((user: any) => user.isActive).length || 0
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar className="w-64 border-r">
          <div className="flex h-16 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <nav className="space-y-1 p-4">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "books" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("books")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Books
            </Button>
            <Button
              variant={activeTab === "orders" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <Package className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </Sidebar>

        <main className="flex-1 overflow-y-auto p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl font-bold tracking-tight">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsContent value="dashboard" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalBooks}</div>
                      <p className="text-xs text-muted-foreground">Total books in inventory</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalOrders}</div>
                      <p className="text-xs text-muted-foreground">Total orders processed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeUsers}</div>
                      <p className="text-xs text-muted-foreground">Currently active users</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="books" className="space-y-4">
                <BooksManagement />
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <OrdersManagement />
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <UsersManagement />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Settings content will go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
} 