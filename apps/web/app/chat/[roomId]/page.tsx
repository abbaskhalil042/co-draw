'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('You');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMessages([
      { id: 1, text: 'Welcome to the chat!', sender: 'System', time: '12:00 PM' },
      { id: 2, text: 'Feel free to start messaging.', sender: 'System', time: '12:01 PM' },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: username,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleLeaveChat = () => {
    if (confirm('Are you sure you want to leave the chat?')) {
      router.push('/');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: 0,
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Chat Room
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '0.9rem' }}>Online</span>
          </div>
          <button
            onClick={handleLeaveChat}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          >
            Leave
          </button>
        </div>
      </header>

      {/* Messages */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.map((msg) => {
          const isSystem = msg.sender === 'System';
          const isUser = msg.sender === username;
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isSystem ? 'center' : isUser ? 'flex-end' : 'flex-start',
                backgroundColor: isSystem ? '#334155' : isUser ? '#7c3aed' : '#475569',
                borderRadius: isSystem
                  ? '0.5rem'
                  : isUser
                  ? '1rem 1rem 0 1rem'
                  : '1rem 1rem 1rem 0',
                padding: '0.75rem 1rem',
                maxWidth: '80%',
                color: isSystem ? '#cbd5e1' : '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {!isSystem && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                    color: isUser ? '#e9d5ff' : '#d1d5db',
                  }}
                >
                  {msg.sender}
                </div>
              )}
              <div>{msg.text}</div>
              <div
                style={{
                  fontSize: '0.625rem',
                  textAlign: 'right',
                  marginTop: '0.25rem',
                  color: isSystem ? '#94a3b8' : isUser ? '#d8b4fe' : '#9ca3af',
                }}
              >
                {msg.time}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        style={{
          display: 'flex',
          padding: '1rem',
          borderTop: '1px solid #334155',
          backgroundColor: '#1e293b',
          gap: '0.5rem',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: '#334155',
            border: '1px solid #475569',
            color: '#fff',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#6d28d9')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#7c3aed')}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
