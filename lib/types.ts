export interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  originalPrice?: number
  coverImage?: string
  rating: number
  reviews: number
  genre: string
  isNew?: boolean
  isBestseller?: boolean
  publisher: string
  publicationDate: string
  pages: number
  language: string
  isbn: string
}

export interface CartItem {
  id: string
  title: string
  author: string
  price: number
  coverImage?: string
  quantity: number
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface Order {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  items: {
    title: string
    author: string
    price: number
    quantity: number
  }[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shipping_address: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "order" | "delivery" | "promotion" | "gift" | "other"
  date: string
  isRead: boolean
  action?: string
  actionLink?: string
}

