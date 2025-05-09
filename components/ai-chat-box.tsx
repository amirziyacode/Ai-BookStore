"use client"
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import axios from 'axios'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return

    setIsSending(true)
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:8080/api/chat/message', 
        { message: inputMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 p-0"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[350px]">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="font-semibold">AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending}
                className="px-3"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}