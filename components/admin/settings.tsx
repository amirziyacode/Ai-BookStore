"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Save, Settings2, Bell, Package, Globe } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from "axios"
import { motion } from "framer-motion"

interface SettingsData {
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  maxBooksPerOrder: number
  orderProcessingTime: number
  emailNotifications: boolean
  systemEmail: string
  currency: string
  taxRate: number
}

export default function Settings() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [settings, setSettings] = useState<SettingsData>({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxBooksPerOrder: 10,
    orderProcessingTime: 24,
    emailNotifications: true,
    systemEmail: "admin@bookstore.com",
    currency: "USD",
    taxRate: 8.5,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8080/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setSettings(response.data)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        })
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings. Using default values.",
        })
      }
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://localhost:8080/api/admin/settings",
        settings,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        })
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Failed to save settings. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your bookstore settings and configurations
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic settings for your bookstore
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to temporarily disable the store
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, maintenanceMode: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable new user registrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowNewRegistrations}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, allowNewRegistrations: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Order Settings</CardTitle>
                <CardDescription>
                  Configure order processing and limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="text-base">Maximum Books Per Order</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.maxBooksPerOrder}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxBooksPerOrder: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="max-w-[200px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Order Processing Time (hours)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings.orderProcessingTime}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          orderProcessingTime: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="max-w-[200px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Tax Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.taxRate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          taxRate: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)),
                        })
                      }
                      className="max-w-[200px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable email notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">System Email</Label>
                  <Input
                    type="email"
                    value={settings.systemEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, systemEmail: e.target.value })
                    }
                    className="max-w-[300px]"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>System Information</AlertTitle>
                  <AlertDescription>
                    These settings affect the entire system. Please be careful when making changes.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label className="text-base">Currency</Label>
                  <Input
                    value={settings.currency}
                    onChange={(e) =>
                      setSettings({ ...settings, currency: e.target.value.toUpperCase() })
                    }
                    className="max-w-[200px]"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 