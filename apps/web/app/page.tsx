"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [roomId, setRoomId] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/chat/${roomId}`);
    } else {
      alert('Please enter a valid Room ID');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #334155',
        transition: 'all 0.3s ease',
        ...(isHovered && { boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.1)' })
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Connect Instantly
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Secure, real-time messaging for everyone
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#cbd5e1',
              marginBottom: '0.5rem'
            }}>
              Room ID
            </label>
            <input
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: '#334155',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: 'white',
                outline: 'none',
                transition: 'all 0.2s ease',
                ...(roomId && { borderColor: '#7c3aed' })
              }}
              type="text"
              placeholder="Enter your room code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
          </div>

          <button
            onClick={handleJoinRoom}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: isHovered 
                ? '#7c3aed' 
                : 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isHovered 
                ? '0 10px 15px -3px rgba(124, 58, 237, 0.3)'
                : 'none'
            }}
          >
            <span>Join Room</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'translateX(4px)' : 'none'
              }}
            >
              <path
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #334155',
          textAlign: 'center'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Don't have a room? Create one by entering a new ID
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>
        <p>Secure • Encrypted • No Tracking</p>
      </div>
    </div>
  );
};

export default Page;