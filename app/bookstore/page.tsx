"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BookCard from "@/components/book-card"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { Book } from "@/lib/types"
import { motion } from "framer-motion"

export default function BookstorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [currentPage, setCurrentPage] = useState(1)
  const [fetchBooks, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  const genres = ["CRYPTOGRAPHY", "COMPUTER_SCIENCE", "MOTIVATION","LANGUAGE", "BIOGRAPHY"]

  const transformBookData = (data: any): Book => {
    return {
      id: Number(data.id),
      title: data.title || '',
      author: data.author || '',
      description: data.description || '',
      price: Number(data.price) || 0,
      coverImage: data.coverImage || data.imageUrl || "/placeholder.svg?height=450&width=300",
      rating: Number(data.rating) || 0,
      category: data.category || '',
      publisher: data.publisher || '',
      year: String(data.year || ''),
      paperback: Number(data.paperback) || 0,
      language: data.language || '',
      isbn: data.isbn || '',
      discount: data.discount ? Number(data.discount) : 0,
      new: data.new || false,
      bestseller: data.bestseller || false
    }
  }

  const fetchBooksData = async (pageNumber: number, perPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/book/Books", {
        params: {
          pageNumber: pageNumber,
          perPage: perPage
        }
      });
      
      if (response.data && response.data.content) {
        const transformedBooks = response.data.content.map(transformBookData);
        setBooks(transformedBooks);
        setTotalPages(Math.ceil(response.data.totalElements / perPage));
      } else {
        setError('Invalid response from server');
      }
    } catch(error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBooksData(0, 12);
  }, []);

  const handlePageChange = async (pageNum: number) => {
    setCurrentPage(pageNum);
    await fetchBooksData(pageNum - 1, 12);
    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100); 
  }

  const filteredBooks = fetchBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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

  const getBooksByQuerySearch = async(query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/book/getAllBooksByQuery", {
        params: {
          query: query
        }
      });
      
      if (response.data) {
        const transformedBooks = response.data.map(transformBookData);
        setBooks(transformedBooks);
        setTotalPages(Math.ceil(transformedBooks.length / 12));
      } else {
        setError('Invalid response from server');
      }
    } catch(error) {
      console.error('Error searching books:', error);
      setError('Failed to search books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const getBooksByCategory = async(category: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (category === "all") {
        await fetchBooksData(currentPage - 1, 12);
        return;
      }

      const response = await axios.get("http://localhost:8080/api/book/getByCategory", {
        params: {
          category: category
        }
      });
      
      if (response.data) {
        const transformedBooks = response.data.map(transformBookData);
        setBooks(transformedBooks);
        setTotalPages(Math.ceil(transformedBooks.length / 12));
        setCurrentPage(1); // Reset to first page when changing category
      } else {
        setError('Invalid response from server');
      }
    } catch(error) {
      console.error('Error fetching books by category:', error);
      setError('Failed to fetch books by category. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  // Add debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        getBooksByQuerySearch(searchQuery);
      } else if (genreFilter !== "all") {
        getBooksByCategory(genreFilter);
      } else {
        fetchBooksData(currentPage - 1, 12);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, genreFilter, currentPage]);

  const Loader = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
          <div className="absolute inset-1 border-2 border-t-cyan-400 border-transparent rounded-full animate-[spin_0.8s_ease-in-out_infinite_reverse]"></div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Discover Your Next Favorite Book
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Explore our vast collection of books across various genres. From bestsellers to new releases, find your perfect read.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative flex-1"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-background/50 backdrop-blur-sm"
              />
            </motion.div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm">
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="author">Author (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        {isLoading && fetchBooks.length === 0 ? (
          <Loader />
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <div className="text-center space-y-4">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchBooksData(currentPage - 1, 12)}>Try Again</Button>
            </div>
          </motion.div>
        ) : fetchBooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <p className="text-muted-foreground">No books available at the moment.</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {sortedBooks.map((book) => (
                <motion.div 
                  key={book.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex justify-center"
            >
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <motion.div
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(pageNum)}
                      className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

