"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { Book } from "@/lib/types"
import { motion } from "framer-motion"

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    addToCart(book)
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart.`,
    })
  }

  return (
    <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/bookstore/${book.id}`} className="block h-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
          <Image
            src={book.coverImage || "/placeholder.svg?height=450&width=300"}
            alt={book.title}
            fill
              className="object-cover"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          />
          {book.new && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
            <Badge className="absolute right-2 top-2 bg-green-500 text-white hover:bg-green-600">New</Badge>
            </motion.div>
          )}
          {book.bestseller && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
            <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-600">Bestseller</Badge>
            </motion.div>
          )}
          {book.discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="absolute left-2 bottom-2 bg-red-500 text-white hover:bg-red-600">
                {book.discount}% OFF
              </Badge>
            </motion.div>
          )}
        </div>
        <CardContent className="p-4">
          <motion.h3 
            whileHover={{ color: "hsl(var(--primary))" }}
            className="line-clamp-1 font-semibold"
          >
            {book.title}
          </motion.h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="font-medium text-primary"
              >
                ${book.discount === 0 ? book.price.toFixed(2) : (book.price - (book.price * book.discount) / 100).toFixed(2)}
              </motion.span>
              {book.discount > 0 && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground line-through"
                >
                  ${book.price.toFixed(2)}
                </motion.span>
              )}
            </div>
            <motion.div 
              className="flex items-center gap-1"
              whileHover={{ scale: 1.1 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`h-4 w-4 ${i < book.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
            >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAuthenticated ? "Add to Cart" : "Login to Add"}
          </Button>
          </motion.div>
        </CardFooter>
      </Link>
    </Card>
  )
}

