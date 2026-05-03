import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiSend } from 'react-icons/fi';
import StarRating from '../components/StarRating';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([{ role: 'ai', content: { type: 'message', message: 'Hi! I\'m your AI stylist. Ask me anything about fashion, products, or recommendations.' } }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/api/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'ai', content: res.data }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: { type: 'message', message: 'Sorry, I had trouble processing that. Try again!' } }]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header"><h2>AI Stylist</h2><span className="chat-status">● Online</span></div>
        <div className="chat-messages">
          {messages.map((msg, i) => msg.role === 'user' ? (
            <div key={i} className="msg user-msg"><div className="msg-bubble user">{msg.text}</div></div>
          ) : (
            <div key={i} className="msg ai-msg">
              <div className="msg-bubble ai">
                <p>{msg.content?.message}</p>
                {msg.content?.data?.length > 0 && (
                  <div className="ai-products">{msg.content.data.map(p => (
                    <Link to={`/product/${p.id}`} key={p.id} className="ai-product-card">
                      {p.tag && <span className="ai-tag">{p.tag}</span>}
                      <strong>{p.name}</strong>
                      <div className="ai-product-meta"><span>₹{p.price?.toLocaleString()}</span>{p.rating && <StarRating rating={p.rating} readOnly size={12} />}</div>
                      {p.reason && <p className="ai-reason">{p.reason}</p>}
                    </Link>
                  ))}</div>
                )}
                {msg.content?.followUp?.length > 0 && <div className="ai-followups">{msg.content.followUp.map((q, j) => <button key={j} className="followup-btn" onClick={() => { setInput(q); }}>{q}</button>)}</div>}
              </div>
            </div>
          ))}
          {loading && <div className="msg ai-msg"><div className="msg-bubble ai typing">Thinking...</div></div>}
          <div ref={bottomRef} />
        </div>
        <form className="chat-input-area" onSubmit={sendMessage}>
          <input className="input-field" placeholder="Ask about products, styles, recommendations..." value={input} onChange={e => setInput(e.target.value)} />
          <button className="btn-primary" type="submit"><FiSend /></button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
