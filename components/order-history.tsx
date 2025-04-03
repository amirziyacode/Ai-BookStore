"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { orders } from "@/lib/data"

export default function OrderHistory() {
  const [filter, setFilter] = useState("all")

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and manage your orders</CardDescription>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredOrders.map((order) => (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                  <div className="flex w-full flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-medium">Order #{order.id}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`
                          ${order.status === "delivered" ? "bg-green-500" : ""}
                          ${order.status === "processing" ? "bg-blue-500" : ""}
                          ${order.status === "shipped" ? "bg-amber-500" : ""}
                          ${order.status === "cancelled" ? "bg-red-500" : ""}
                        `}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 ${
                            index !== order.items.length - 1 ? "border-b" : ""
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-12 rounded bg-muted"></div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.author}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.price.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border p-4">
                      <h4 className="mb-2 font-medium">Order Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 font-medium">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h4 className="mb-2 font-medium">Shipping Information</h4>
                      <div className="space-y-1 text-sm">
                        <p>{order.shipping_address.name}</p>
                        <p>{order.shipping_address.street}</p>
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm">
                        Download Invoice
                      </Button>
                      {order.status !== "delivered" && order.status !== "cancelled" && (
                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-center text-muted-foreground">No orders found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

