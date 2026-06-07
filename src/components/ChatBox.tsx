'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, User, FileText, Download, Paperclip, Loader2 } from 'lucide-react'

interface ChatBoxProps {
  requestId: string
  currentUserId: string
  currentUserRole: string
  uploadLimitReached?: boolean
  isClosed?: boolean
}

export default function ChatBox({ 
  requestId, 
  currentUserId, 
  currentUserRole, 
  uploadLimitReached = false,
  isClosed = false
}: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?request_id=${requestId}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  // Poll for messages every 3 seconds
  useEffect(() => {
    fetchMessages()

    const interval = setInterval(() => {
      fetchMessages()
    }, 3000)

    return () => clearInterval(interval)
  }, [requestId])

  // Scroll to bottom on new messages (container level only, preventing page-level auto-scroll)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)

    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('request_id', requestId)
      
      const isSpecialist = currentUserRole.toLowerCase() === 'specialist' || currentUserRole.toLowerCase() === 'tutor'
      formData.append('is_delivery', isSpecialist ? 'true' : 'false')

      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Upload failed')
      }

      await fetchMessages()
    } catch (err: any) {
      console.error('Error uploading file in chat:', err)
      alert(err.message || 'File upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const tempText = inputText
    setInputText('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId,
          messageText: tempText
        })
      })

      if (!res.ok) throw new Error('Send failed')
      await fetchMessages() // Refresh messages list

    } catch (err) {
      console.error('Error sending message:', err)
      setInputText(tempText) // Restore text on failure
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-[400px] border border-border bg-background rounded-2xl items-center justify-center">
        <span className="text-sm text-text-muted">Loading messages...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[500px] border border-border bg-card rounded-3xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-background border-b border-border py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-foreground">Live Specialist Coordination</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-accent-warm bg-accent-warm-light px-2 py-0.5 rounded-full">
          {currentUserRole} View
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-accent-warm-light/5"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <User className="h-8 w-8 text-text-muted/40 mb-2" />
            <p className="text-xs font-semibold text-text-muted">No messages yet.</p>
            <p className="text-[10px] text-text-muted mt-0.5">Send a message to start coordinating with your specialist.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === currentUserId
            const senderName = m.sender_name || 'Specialist'
            const isFile = m.message_text.startsWith('[File: ') && m.message_text.endsWith(']') && m.message_text.includes('|')
            let fileName = ''
            let filePath = ''
            if (isFile) {
              const content = m.message_text.slice(7, -1)
              const pipeIndex = content.lastIndexOf('|')
              fileName = content.slice(0, pipeIndex)
              filePath = content.slice(pipeIndex + 1)
            }
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-[10px] text-text-muted mb-1 px-1 font-semibold">
                  {isMe ? 'You' : senderName}
                </span>
                {isFile ? (
                  <div className={`flex items-center gap-3 border p-3 rounded-2xl max-w-sm shadow-xs ${
                    isMe 
                      ? 'bg-accent-warm border-accent-warm text-white rounded-tr-none' 
                      : 'bg-background border border-border text-foreground rounded-tl-none'
                  }`}>
                    <div className={`p-2 rounded-xl ${isMe ? 'bg-white/20 text-white' : 'bg-accent-warm-light/20 text-accent-warm'}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className={`text-xs font-semibold block truncate ${isMe ? 'text-white' : 'text-foreground'}`}>{fileName}</span>
                      <span className={`text-[9px] block ${isMe ? 'text-white/70' : 'text-text-muted'}`}>Attached Document</span>
                    </div>
                    <a
                      href={filePath}
                      download={fileName}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMe 
                          ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                          : 'hover:bg-neutral-100 text-text-muted hover:text-accent-warm'
                      }`}
                      title="Download file"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ) : (
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-accent-warm text-white rounded-tr-none'
                        : 'bg-background border border-border text-foreground rounded-tl-none'
                    }`}
                  >
                    {m.message_text}
                  </div>
                )}
                <span className="text-[9px] text-text-muted/65 mt-1 px-1">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })
        )}
      </div>
      {/* Input Form or Closed Notice */}
      {isClosed ? (
        <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-border p-4 text-center text-xs font-semibold text-text-muted">
          🔒 This chat has been archived because the project is completed.
        </div>
      ) : (
        <form onSubmit={handleSend} className="bg-background border-t border-border p-4 flex gap-2 items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            disabled={uploading || uploadLimitReached}
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl border border-border bg-card text-text-muted hover:text-accent-warm hover:border-accent-warm transition-all disabled:opacity-50"
            title={uploadLimitReached ? "Upload limit reached. Ask specialist for permission." : "Upload document"}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent-warm" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            disabled={uploading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-xs focus:outline-none focus:border-accent-warm transition-all disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={uploading}
            className="p-2.5 rounded-xl bg-accent-warm text-white hover:bg-accent-warm-hover transition-colors shadow-md shadow-accent-warm/10 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  )
}
