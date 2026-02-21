import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chatbot/chat', { message: text, sessionId });
      setSessionId(data.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 20px', maxWidth: 720, margin: '0 auto' }}>
      <h1 className="page-title">Rental Assistant</h1>
      <p style={{ color: 'var(--earth-500)', marginBottom: '1.5rem' }}>Ask about land rental, booking, payments, or agreements.</p>
      <div className="card" style={{ height: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 && (
            <p style={{ color: 'var(--earth-500)', fontSize: '0.95rem' }}>Type a message to start...</p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: 'var(--radius)',
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--earth-200)',
                color: msg.role === 'user' ? 'var(--white)' : 'var(--earth-700)',
              }}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'var(--earth-200)', borderRadius: 'var(--radius)' }}>
              ...
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ padding: '1rem', borderTop: '1px solid var(--earth-200)' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--earth-300)', borderRadius: 'var(--radius)' }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
