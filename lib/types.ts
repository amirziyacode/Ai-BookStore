export interface Book {
  id: number
  title: string
  author: string
  description: string
  discount?: number
  price: number
  coverImage?: string
  rating: number
  category: string
  new?: boolean
  bestseller?: boolean
  publisher: string
  year: string
  paperback: number
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
  role?:string
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
    coverImage:string
    quantity: number
  }[]
  subtotal: number
  tax: number
  total: number
}

export interface Notification {
  id: number
  title: string
  message: string
  type: "order" | "delivery" | "promotion" | "gift" | "other"
  date: string
  isRead: boolean
  action?: string
  actionLink?: string
}

