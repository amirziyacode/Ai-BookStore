import type {Order, Notification } from "@/lib/types"


export const orders: Order[] = [
  {
    id: "ORD-2023-1001",
    date: "2023-03-15T10:30:00",
    status: "delivered",
    items: [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 14.99,
        quantity: 1,
        coverImage:"coverImage"
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        price: 11.99,
        quantity: 1,
        coverImage:"coverImage"
      },
    ],
    subtotal: 26.98,
    tax: 2.7,
    total: 34.67,
    // shipping_address: {
    //   name: "John Doe",
    //   street: "123 Main St",
    //   city: "Anytown",
    //   state: "CA",
    //   zip: "12345",
    //   country: "United States",
    // },
  },
  {
    id: "ORD-2023-1002",
    date: "2023-04-22T14:45:00",
    status: "shipped",
    items: [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        price: 14.99,
        quantity: 1,
        coverImage:"coverImage"
      },
    ],
    subtotal: 14.99,
    tax: 1.5,
    total: 21.48,
    // shipping_address: {
    //   name: "John Doe",
    //   street: "123 Main St",
    //   city: "Anytown",
    //   state: "CA",
    //   zip: "12345",
    //   country: "United States",
    // },
  },
  {
    id: "ORD-2023-1003",
    date: "2023-05-10T09:15:00",
    status: "processing",
    items: [
      {
        title: "The Four Winds",
        author: "Kristin Hannah",
        price: 14.99,
        quantity: 1,
        coverImage:"coverImage"
      },
      {
        title: "The Vanishing Half",
        author: "Brit Bennett",
        price: 13.99,
        quantity: 1,
        coverImage:"coverImage"
      },
      {
        title: "Educated",
        author: "Tara Westover",
        price: 12.99,
        quantity: 1,
        coverImage:"coverImage"
      },
    ],
    subtotal: 41.97,
    tax: 4.2,
    total: 46.17,
    // shipping_address: {
    //   name: "John Doe",
    //   street: "123 Main St",
    //   city: "Anytown",
    //   state: "CA",
    //   zip: "12345",
    //   country: "United States",
    // },
  },
]

export const notifications: Notification[] = [
  {
    id: "notif-1",
    title: "Order Shipped",
    message: "Your order #ORD-2023-1002 has been shipped and is on its way!",
    type: "delivery",
    date: "2023-04-23T10:15:00",
    isRead: false,
    action: "Track Order",
    actionLink: "/account?tab=orders",
  },
  {
    id: "notif-2",
    title: "New Order Confirmation",
    message: "Thank you for your order #ORD-2023-1003. We're processing it now.",
    type: "order",
    date: "2023-05-10T09:20:00",
    isRead: false,
    action: "View Order",
    actionLink: "/account?tab=orders",
  },
  {
    id: "notif-3",
    title: "Summer Reading Sale",
    message: "Enjoy 20% off on all fiction books until June 30th!",
    type: "promotion",
    date: "2023-06-01T08:00:00",
    isRead: true,
    action: "Shop Now",
    actionLink: "/bookstore",
  },
  {
    id: "notif-4",
    title: "Free Book with Purchase",
    message: "Spend $50 or more and get a free mystery book with your order!",
    type: "gift",
    date: "2023-05-15T12:30:00",
    isRead: true,
  },
  {
    id: "notif-5",
    title: "Order Delivered",
    message: "Your order #ORD-2023-1001 has been delivered. Enjoy your books!",
    type: "delivery",
    date: "2023-03-18T15:45:00",
    isRead: true,
  },
]

