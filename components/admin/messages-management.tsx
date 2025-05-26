"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Eye, Trash2 } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  isRead: boolean
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("https://spring-bookstore-3.onrender.com/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data)
    } catch (error: any) {
      console.error("Error fetching messages:", error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        })
        localStorage.removeItem("token")
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setIsDialogOpen(true)
    
    if (!message.isRead) {
      try {
        const token = localStorage.getItem("token")
        await axios.put(
          `https://spring-bookstore-3.onrender.com/api/admin/messages/${message.id}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        fetchMessages()
      } catch (error) {
        console.error("Error marking message as read:", error)
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`https://spring-bookstore-3.onrender.com/api/admin/messages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast({
          title: "Success",
          description: "Message deleted successfully",
        })
        fetchMessages()
      } catch (error: any) {
        console.error("Error deleting message:", error)
        toast({
          title: "Error",
          description: "Failed to delete message",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        message.isRead
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {message.isRead ? "Read" : "Unread"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(message.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">From</h3>
                <p>{selectedMessage.name} ({selectedMessage.email})</p>
              </div>
              <div>
                <h3 className="font-medium">Subject</h3>
                <p>{selectedMessage.subject}</p>
              </div>
              <div>
                <h3 className="font-medium">Message</h3>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div>
                <h3 className="font-medium">Date</h3>
                <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 