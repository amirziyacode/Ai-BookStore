"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BookCard from "@/components/book-card"
import { Search } from "lucide-react"
import axios from 'axios'
export default function BookstorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [fetchBooks,setBooks] = useState([
    {
      id: 1,
      title: "Grokking Algorithms",
      author: "Aditya Y. Bhargava",
      coverImage: "https://skybooks.ir/images/productImages/Grokking-Algorithms_EB1709675048.jpg",
      price: 24.99,
      rating: 5,
      category: "computer science",
      discount: 15,
      isbn:"9781633438538",
      paperback:322,
      publisher:"Manning",
      language:"English",
      year:"2012",
      description:"An Illustrated Guide for Programmers and Other Curious People  A friendly, fully-illustrated introduction to the most important computer programming algorithms.Master the most widely used algorithms and be fully prepared when you’re asked about them at your next job interview. With beautifully simple explanations, over 400 fun illustrations, and dozens of relevant examples, you’ll actually enjoy learning about algorithms with this fun and friendly guide! The first edition of Grokking Algorithms proved to over 100,000 readers that learning algorithms doesn't have to be complicated or boring! This revised second edition contains brand new coverage of trees, including binary search trees, balanced trees, B-trees and more. You’ll also discover fresh insights on data structure performance that takes account of modern CPUs. Plus, the book’s fully annotated code samples have been updated to Python 3.Foreword by Daniel Zingaro."
    },
  ]);


  const genres = ["CRYPTOGRAPHY", "COMPUTER_SCIENCE", "MOTIVATION","LANGUAGE", "BIOGRAPHY"]

  // {Coms From Server} //
  useEffect(() => {
    const getAllBooks = async() =>{
      try{
        const allBooks = (await axios.get("http://localhost:8080/api/book/allBooks")).data;
        setBooks(allBooks);
      }catch(error){
        console.error('Error fetching books:', error);
      }
    }
    getAllBooks();
  },[]);

  const filteredBooks = fetchBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = genreFilter === "all" || book.category === genreFilter
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

