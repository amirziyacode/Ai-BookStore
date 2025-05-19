"use client";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import BookCard from "@/components/book-card"
import { useEffect, useState } from "react"
import axios from "axios"
import { Loader2, ArrowRight } from "lucide-react"
import type { Book } from "@/lib/types"

export default function Home() {
  const [featuredBooks, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8080/api/book/findBestSeller", {
          params: {
            books: "4"
          }
        });
        
        // Transform the API response to match our Book type
        const transformedBooks = response.data.map((book: any) => ({
          id: Number(book.id),
          title: book.title || '',
          author: book.author || '',
          description: book.description || '',
          price: Number(book.price) || 0,
          coverImage: book.coverImage || book.imageUrl || "/placeholder.svg?height=450&width=300",
          rating: Number(book.rating) || 0,
          category: book.category || '',
          publisher: book.publisher || '',
          year: String(book.year || ''),
          paperback: Number(book.paperback) || 0,
          language: book.language || '',
          isbn: book.isbn || '',
          discount: book.discount ? Number(book.discount) : 0,
          new: book.new || false,
          bestseller: book.bestseller || false
        }));
        
        setBooks(transformedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load featured books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-28 lg:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Discover Your Next Favorite Book
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
                Explore our vast collection of books from bestsellers to hidden gems. Start your reading journey today.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/bookstore">
                  <Button size="lg" className="group">
                    Browse Books
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto h-[450px] w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
              <Image
                src="/landing.png"
                alt="Bookstore Hero Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Featured Books
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our handpicked selection of must-read books that are making waves in the literary world.
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-16">
                <p className="text-red-500 text-lg">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-6 hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              featuredBooks.map((book) => (
                <div key={book.id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <BookCard book={book} />
                </div>
              ))
            )}
          </div>
          <div className="mt-16 flex justify-center">
            <Link href="/bookstore">
              <Button size="lg" className="group">
                View All Books
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Stay Updated
              </h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe to our newsletter to receive updates on new releases, author events, and exclusive offers.
              </p>
            </div>
            <div className="w-full max-w-md space-y-4">
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit" className="h-12 whitespace-nowrap group">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

