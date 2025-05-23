"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Book } from "@/lib/types"
import { Plus, Pencil, Trash2, AlertTriangle, Search } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { headers } from "next/headers"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    category: "",
    publisher: "",
    year: "",
    paperback: "",
    language: "",
    isbn: "",
    coverImage: "",
    rating: "0",
    discount: "0",
    isNew: false,
    isBestSeller: false,
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query)
      )
      setFilteredBooks(filtered)
    }
  }, [searchQuery, books])

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8080/api/admin/book/getAllBooks",
        {headers: { Authorization: `Bearer ${token}` }}
      )

      setBooks(response.data)
      setFilteredBooks(response.data)
    } catch (error: any) {
      console.error("Error fetching books:", error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        })
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch books",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "rating") {
      const numValue = parseFloat(value)
      if (numValue >= 0 && numValue <= 5) {
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const submitData = {
        ...formData,
        rating: parseFloat(formData.rating) || 0,
        price: parseFloat(formData.price) || 0,
        paperback: parseInt(formData.paperback) || 0,
        discount: parseFloat(formData.discount) || 0,
      }

      if (editingBook) {
        await axios.put(
          `http://localhost:8080/api/admin/book/updateBook/${editingBook.id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        toast({
          title: "Success",
          description: "Book updated successfully",
        })
      } else {
        await axios.post("http://localhost:8080/api/admin/book/addBook", submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        toast({
          title: "Success",
          description: "Book added successfully",
        })
      }
      setIsDialogOpen(false)
      fetchBooks()
      resetForm()
    } catch (error: any) {
      console.error("Error saving book:", error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        })
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: "Failed to save book",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price.toString(),
      category: book.category,
      publisher: book.publisher,
      year: book.year,
      paperback: book.paperback.toString(),
      language: book.language,
      isbn: book.isbn,
      coverImage: book.coverImage,
      rating: book.rating?.toString() || "0",
      discount: book.discount?.toString() ?? "0",
      isNew: book.isNew,
      isBestSeller: book.isBestSeller,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:8080/api/admin/book/deleteBook/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        toast({
          title: "Success",
          description: "Book deleted successfully",
        })
        fetchBooks()
      } catch (error: any) {
        console.error("Error deleting book:", error)
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please login again to continue.",
          })
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          toast({
            title: "Error",
            description: "Failed to delete book",
            variant: "destructive",
          })
        }
      }
    }
  }

  const handleDeleteAll = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete("http://localhost:8080/api/admin/book/deleteAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast({
        title: "Success",
        description: "All books have been deleted successfully",
      })
      fetchBooks()
    } catch (error: any) {
      console.error("Error deleting all books:", error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        })
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: "Failed to delete all books",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      price: "",
      category: "",
      publisher: "",
      year: "",
      paperback: "",
      language: "",
      isbn: "",
      coverImage: "",
      rating: "0",
      discount: "0",
      isNew: false,
      isBestSeller: false,
    })
    setEditingBook(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Books Management</h2>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Books
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all books from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete All Books
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBook ? "Edit Book" : "Add New Book"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title">Title</label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="author">Author</label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="price">Price</label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category">Category</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRYPTOGRAPHY">Cryptography</SelectItem>
                        <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                        <SelectItem value="MOTIVATION">Motivation</SelectItem>
                        <SelectItem value="LANGUAGE">Language</SelectItem>
                        <SelectItem value="BIOGRAPHY">Biography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="publisher">Publisher</label>
                    <Input
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="year">Year</label>
                    <Input
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="paperback">Paperback</label>
                    <Input
                      id="paperback"
                      name="paperback"
                      type="number"
                      value={formData.paperback}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="language">Language</label>
                    <Input
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="isbn">ISBN</label>
                    <Input
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rating">Rating (0-5)</label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0 && value <= 5) {
                          handleInputChange(e)
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="coverImage">Cover Image URL</label>
                    <Input
                      id="coverImage"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="discount">Discount (%)</label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>Is New Book</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span>Is Best Seller</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBook ? "Update Book" : "Add Book"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[50px] bg-background">#</TableHead>
                  <TableHead className="bg-background">Title</TableHead>
                  <TableHead className="bg-background">Author</TableHead>
                  <TableHead className="bg-background">Category</TableHead>
                  <TableHead className="bg-background">Price</TableHead>
                  <TableHead className="bg-background">Rating</TableHead>
                  <TableHead className="bg-background">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {searchQuery ? "No books found matching your search" : "No books found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBooks.map((book, index) => (
                    <TableRow key={book.id} className="hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.category}</TableCell>
                      <TableCell>${book.price}</TableCell>
                      <TableCell>{book.rating || "0"}/5</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(book)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(book.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
} 