"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BookCard from "@/components/book-card"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from 'axios'
export default function BookstorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [pageCount,setPage] = useState(1)
  const [fetchBooks,setBooks] = useState([]);


  const genres = ["CRYPTOGRAPHY", "COMPUTER_SCIENCE", "MOTIVATION","LANGUAGE", "BIOGRAPHY"]

  // {Comes From Server} //
  useEffect(() => {
    const getAllBooks = async() =>{
      try{
        const getBooks = (await axios.get("http://localhost:8080/api/book/Books",{
          params:{
            pageNumber:0,
            perPage:12
          }
        })).data.content
        setBooks(getBooks);
      }catch(error){
        console.error('Error fetching books:', error);
      }
    }
    getAllBooks();
  },[]);
  
    // {Comes From Server }  //
  const bookpages = async(pageNumber:number,pageper:number) =>{
    try{
      const getBooks = (await axios.get("http://localhost:8080/api/book/Books",{
        params:{
          pageNumber:pageNumber,
          perPage:pageper
        }
      })).data.content
      setBooks(getBooks);
      setPage(pageNumber+1)
    }catch(error){
      console.error('Error fetching books:', error);
    }
  }

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


  const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                <div className="absolute inset-1 border-2 border-t-cyan-400 border-transparent rounded-full animate-[spin_0.8s_ease-in-out_infinite_reverse]"></div>
            </div>
        </div>
    );
};

  if(fetchBooks.length == 0){
    return <Loader></Loader>
  }

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

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            {pageCount==1 ?  <Button variant="outline" size="icon" onClick={() => {setPage(1)}}   className="bg-primary text-primary-foreground">1</Button>:<Button variant="outline" size="icon" onClick={() => {setPage(1),bookpages(0,12)}}>1</Button>}
            {pageCount ==2 ? <Button variant="outline" className="bg-primary text-primary-foreground" onClick={() => setPage(2)} size="icon">
              2
            </Button> : <Button variant="outline" onClick={() => {bookpages(1,12)}} size="icon">
              2
            </Button>}
            {pageCount ==3 ?<Button variant="outline" className="bg-primary text-primary-foreground" onClick={() => setPage(3)} size="icon">
              3
            </Button>:<Button variant="outline" onClick={() => setPage(3)} size="icon">
              3
            </Button>}
        </div>
      </div>
    </div>
  )
}

