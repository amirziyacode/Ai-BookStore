"use client"

import { useParams } from "next/navigation"
import { useState} from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { books } from "@/lib/data"
import { useCart } from "@/context/cart-context"
import { ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BookDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const book = books.find((book) => book.id.toString() === params.id)


  if (!book) {
    return (
      <div className="container mx-auto flex h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Book Not Found</CardTitle>
            <CardDescription>The book you are looking for does not exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/bookstore">Back to Bookstore</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(book)
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${book.title} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Book Image */}
        <div className="flex items-center justify-center">
          <div className="relative h-[500px] w-[350px] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={book.coverImage || "/placeholder.svg?height=500&width=350"}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <Badge className="mb-2">{book.category}</Badge>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg text-gray-500">by {book.author}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < book.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">${book.discount?.toFixed(2)}</h2>
            {book.price && (
              <span className="text-lg text-gray-500 line-through">${book.price.toFixed(2)}</span>
            )}
            {book.discount && (
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                {Math.round(book.discount)}% OFF
              </Badge>
            )}
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="outline" onClick={handleToggleWishlist}>
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
            </Button>
          </div>

          <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <h3 className="mb-2 font-semibold">Book Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Publisher:</div>
              <div>{book.publisher}</div>
              <div>Year:</div>
              <div>{book.year}</div>
              <div>Pages:</div>
              <div>{book.paperback}</div>
              <div>Language:</div>
              <div>{book.language}</div>
              <div>ISBN:</div>
              <div>{book.isbn}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

