"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Book, CartItem } from "@/lib/types"

interface CartContextType {
  cart: CartItem[]
  addToCart: (book: Book) => void
  removeFromCart: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // Update localStorage and calculate total when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))

    const total = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    setCartTotal(total)
  }, [cart])

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id)

      if (existingItem) {
        // Increment quantity if item already exists
        return prevCart.map((item) => (item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item with quantity 1
        return [
          ...prevCart,
          {
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            coverImage: book.coverImage,
            quantity: 1,
          },
        ]
      }
    })
  }

  const removeFromCart = (bookId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(bookId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === bookId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

