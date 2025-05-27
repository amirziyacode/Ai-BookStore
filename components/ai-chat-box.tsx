"use client"
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

// Utility function for class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

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
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const assistantMessageRef = useRef<ChatMessage>({
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString()
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      setError(null);

      const userMessage: ChatMessage = {
        role: 'user',
        content: inputMessage,
        timestamp: new Date().toISOString()
      };

      assistantMessageRef.current = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage, assistantMessageRef.current]);
      setInputMessage('');

      const eventSource = new EventSource(`http://localhost:8080/api/ai/ask-bot?message=${encodeURIComponent(inputMessage)}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newChunk = data.message?.content || '';

          assistantMessageRef.current.content += newChunk;

          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...assistantMessageRef.current };
            return updated;
          });

          if (data.done) {
            eventSource.close();
            setIsSending(false);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
          setError("Error processing response");
          eventSource.close();
          setIsSending(false);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setError("Connection error. Please try again.");
        eventSource.close();
        setIsSending(false);
      };
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[380px] shadow-2xl border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b p-4 bg-primary/5">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div 
              ref={chatContainerRef}
              className="h-[450px] overflow-y-auto p-4 space-y-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(var(--primary) / 0.2) transparent'
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bot className="h-12 w-12 mb-4 text-primary/50" />
                  <p className="text-center">How can I help you today?</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-2",
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl p-3",
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {error && (
                <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-3 flex gap-2 bg-primary/5">
              <Input
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSending}
                className="px-4 bg-primary hover:bg-primary/90"
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