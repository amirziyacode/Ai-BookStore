"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { books } from "@/lib/data"
import BookCard from "@/components/book-card"
import { Search } from "lucide-react"

export default function BookstorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")

  const genres = ["Fiction", "Non-Fiction", "Science Fiction", "Mystery", "Romance", "Biography"]

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = genreFilter === "all" || book.genre === genreFilter
    return matchesSearch && matchesGenre
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "author") {
      return a.author.localeCompare(b.author)
    } else if (sortBy === "price-low") {
      return a.price - b.price
    } else if (sortBy === "price-high") {
      return b.price - a.price
    }
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Bookstore</h1>

      {/* Filters and Search */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by title or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title (A-Z)</SelectItem>
            <SelectItem value="author">Author (A-Z)</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      {sortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-center text-gray-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

