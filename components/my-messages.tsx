import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import axios from 'axios'
import type { User } from "@/lib/types"

interface AccountDetailsProps {
  user: User
}

interface Message {
  id: string
  subject: string
  message: string
  createdAt: string
  status: 'pending' | 'replied'
}

export default function MyMessages({user}:AccountDetailsProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/account/getMyMassages', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params:{
            email:user.email
          }
        })
        setMessages(response.data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  if (loading) {
    return <div>Loading messages...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-muted-foreground">You haven't sent any messages yet.</p>
      ) : (
        messages.map((message) => (
          <Card key={message.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{message.subject}</h3>
                <Badge variant={message.status === 'replied' ? 'default' : 'secondary'}>
                  {message.status === 'replied' ? 'Replied' : 'Pending'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
              <p className="text-xs text-muted-foreground">
                Sent {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}