'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, ShoppingBag, Truck, CreditCard, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/use-store'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatHistory {
  role: string
  content: string
}

const QUICK_ACTIONS = [
  { label: 'অর্ডার করতে চাই', icon: ShoppingBag, message: 'আমি অর্ডার করতে চাই। কিভাবে অর্ডার করবো?' },
  { label: 'ডেলিভারি তথ্য', icon: Truck, message: 'ডেলিভারি সম্পর্কে তথ্য দিন।' },
  { label: 'পেমেন্ট পদ্ধতি', icon: CreditCard, message: 'পেমেন্ট পদ্ধতি কি কি?' },
  { label: 'অফার আছে?', icon: Tag, message: 'এখন কি কোনো অফার আছে?' },
]

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'আসসালামু আলাইকুম! আমি আপনাকে কিভাবে সাহায্য করতে পারি? 😊',
  timestamp: new Date(),
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-green-500"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-start gap-2 mb-3 justify-end"
      >
        <div className="bg-green-600 dark:bg-green-700 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-green-600 dark:bg-green-700 text-white text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-2 mb-3"
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] shadow-sm">
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  )
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { language } = useStore()
  const isBn = language === 'bn'

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]')
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight
        })
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue('')
      setIsLoading(true)

      const history: ChatHistory[] = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, history }),
        })

        const data = await res.json()

        const botMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)
        }
      } catch {
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: 'দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, messages, isOpen]
  )

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setUnreadCount(0)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setMessages([WELCOME_MESSAGE])
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage(inputValue)
      }
    },
    [inputValue, handleSendMessage]
  )

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
            aria-label={isBn ? 'চ্যাট সাহায্যকারী খুলুন' : 'Open chat assistant'}
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
            {/* Unread badge */}
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-xs border-2 border-background">
                {unreadCount}
              </Badge>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-50 flex flex-col bg-card border border-border shadow-2xl overflow-hidden
              bottom-0 left-0 right-0 h-[85dvh] rounded-t-2xl
              sm:bottom-6 sm:right-6 sm:left-auto sm:h-[520px] sm:w-[380px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-green-600 dark:bg-green-700 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-9 w-9 border-2 border-white/30">
                    <AvatarFallback className="bg-white/20 text-white text-sm">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-300 border-2 border-green-600 dark:border-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {isBn ? 'আমাদের বাজার সাহায্যকারী' : 'Amar Bazar Assistant'}
                  </h3>
                  <p className="text-xs text-green-100">
                    {isBn ? 'অনলাইন • সাহায্য করতে প্রস্তুত' : 'Online • Ready to help'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-white hover:bg-white/20 h-8 w-8"
                aria-label={isBn ? 'চ্যাট বন্ধ করুন' : 'Close chat'}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSendMessage(action.message)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {action.label}
                    </motion.button>
                  )
                })}
              </div>

              {/* Message List */}
              <div className="space-y-1">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              {/* Typing Indicator */}
              {isLoading && <TypingIndicator />}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-3 shrink-0 bg-card">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isBn ? 'আপনার বার্তা লিখুন...' : 'Type your message...'}
                  disabled={isLoading}
                  className="flex-1 h-10 text-sm rounded-xl bg-muted/50 border-border focus-visible:border-green-500 focus-visible:ring-green-500/20"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shrink-0 disabled:opacity-40"
                  aria-label={isBn ? 'বার্তা পাঠান' : 'Send message'}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                {isBn
                  ? 'AI অ্যাসিস্ট্যান্ট • উত্তর স্বয়ংক্রিয়ভাবে তৈরি হয়'
                  : 'AI Assistant • Responses are auto-generated'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
