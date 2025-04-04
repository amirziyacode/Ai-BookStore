"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/lib/types"

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(book)
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/bookstore/${book.id}`} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={book.coverImage || "/placeholder.svg?height=450&width=300"}
            alt={book.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          {book.new && (
            <Badge className="absolute right-2 top-2 bg-green-500 text-white hover:bg-green-600">New</Badge>
          )}
          {book.bestseller && (
            <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-600">Bestseller</Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-semibold">{book.title}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium">${book.discount?.toFixed(2)}</span>
              {book.price && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < book.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}

