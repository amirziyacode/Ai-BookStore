"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Gift, ShoppingBag, Tag, Truck } from "lucide-react"
import { notifications } from "@/lib/data"

export default function Notifications() {
  const [activeNotifications, setActiveNotifications] = useState(notifications)

  const markAllAsRead = () => {
    setActiveNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setActiveNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5" />
      case "delivery":
        return <Truck className="h-5 w-5" />
      case "promotion":
        return <Tag className="h-5 w-5" />
      case "gift":
        return <Gift className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900 dark:text-blue-300"
      case "delivery":
        return "text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "promotion":
        return "text-amber-500 bg-amber-100 dark:bg-amber-900 dark:text-amber-300"
      case "gift":
        return "text-rose-500 bg-rose-100 dark:bg-rose-900 dark:text-rose-300"
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated with order status, promotions, and more</CardDescription>
          </div>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeNotifications.length > 0 ? (
          <div className="space-y-4">
            {activeNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-lg border p-4 ${!notification.isRead ? "bg-muted/40" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconColor(notification.type)}`}
                >
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <span className="sr-only">Delete</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.date).toLocaleDateString()} at{" "}
                      {new Date(notification.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {!notification.isRead && (
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  {notification.action && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={notification.actionLink}>{notification.action}</a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-center text-muted-foreground">No notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

