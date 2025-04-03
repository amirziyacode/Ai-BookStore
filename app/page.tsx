import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { featuredBooks } from "@/lib/data"
import BookCard from "@/components/book-card"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-20 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Your Next Favorite Book
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl">
                  Explore our vast collection of books from bestselling authors and emerging talents. Find your perfect
                  read today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/bookstore">
                  <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                    Browse Books
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-slate-900"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[300px] rotate-3 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/placeholder.svg?height=500&width=350"
                  alt="Book collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 h-[250px] w-[200px] -rotate-6 overflow-hidden rounded-lg shadow-lg md:block hidden">
                <Image src="/placeholder.svg?height=400&width=250" alt="Book" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Books</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our handpicked selection of must-read books that are making waves in the literary world.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/bookstore">
              <Button size="lg">View All Books</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-slate-100 py-12 dark:bg-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Stay Updated</h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe to our newsletter to receive updates on new releases, author events, and exclusive offers.
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <form className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

