"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { CartItem } from "@/lib/types"

interface OrderRequest {
  items: CartItem[];
  subTotal: number;
  tax: number;
  total: number;
}


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const { toast } = useToast()
  const {user} = useAuth();
  const router = useRouter()
  const [promoCode, setPromoCode] = useState("")
  const {isAuthenticated} = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Calculate order summary
  const subTotal = cartTotal
  const shipping = subTotal > 35 ? 0 : 4.99
  const tax = subTotal * 0.1 // 10% tax
  const discount = promoCode.toLowerCase() === "bookworm" ? subTotal * 0.1 : 0
  const total = subTotal + shipping + tax - discount
  



  // TODO : authentication 
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
    console.log(cart)
  }, [isAuthenticated, router])

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault()

    if (promoCode.toLowerCase() === "bookworm") {
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order.",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async() => {
    setIsCheckingOut(true)
    try{
      const token = localStorage.getItem('token')
      const OrderRequest:OrderRequest = {
        items:cart,
        subTotal:subTotal,
        tax:tax,
        total:total
      }
      const response = await axios({
        method: 'post',
        url: `http://localhost:8080/api/order/addOrder/${user?.email}`,
        data: OrderRequest,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data)

      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      })
      clearCart()
      setIsCheckingOut(false)

    }catch(error){
      alert(error)
    }
  }


  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</CardTitle>
                <CardDescription>Review your items before checkout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="relative h-20 w-16 overflow-hidden rounded">
                        <Image
                          src={item.coverImage || "/placeholder.svg?height=80&width=60"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.author}</p>
                        <p className="mt-1 font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Link href="/bookstore">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                  <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button type="submit" variant="outline">
                    Apply
                  </Button>
                </form>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium">Free shipping on orders over $35</p>
                  <p className="text-muted-foreground">
                    {subTotal < 35 ? (
                      <>Add ${(35 - subTotal).toFixed(2)} more to qualify for free shipping</>
                    ) : (
                      <>Your order qualifies for free shipping</>
                    )}
                  </p>
                </div>

                <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-muted-foreground">Looks like you haven't added any books to your cart yet.</p>
          </div>
          <Link href="/bookstore">
            <Button>Browse Books</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

