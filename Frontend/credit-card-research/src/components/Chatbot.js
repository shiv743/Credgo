// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css';

const faqSuggestions = [
  "How to improve my credit score?",
  "Which credit card is best for students?",
  "What are cashback credit cards?",
  "What are the requirements to get a credit card?",
  "How to compare credit cards?"
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/api/chat', { message: text });
      const botMessage = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = { sender: 'bot', text: 'Sorry, server is not responding.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="floating-chatbot-container">
      {/* Updated Header */}
      <div className="chatbot-header">
        <span className="chatbot-title">
          <span className="cred-text">Cred</span><span className="go-text">Go</span> Chatbot
        </span>
      </div>

      {/* FAQ */}
      <div className="faq-bar">
        {faqSuggestions.map((q, idx) => (
          <button key={idx} onClick={() => sendMessage(q)} className="faq-button">
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="chat-box" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-row ${msg.sender}`}>
            <div className="avatar">{msg.sender === 'user' ? '🐸' : '👾'}</div>
            <div
              className="message-bubble"
              dangerouslySetInnerHTML={{
                __html: msg.text
                  .replace(/\n/g, '<br>')
                  .replace(/^- /gm, '🔹 ')
                  .replace(/\*\*(.*?)\*\*/g, '<span class="highlight-bold">$1</span>')
              }}
            />
          </div>
        ))}
        {loading && <div className="typing">👾 Typing...</div>}
      </div>

      {/* Input */}
      <div className="input-area">
        <input
          type="text"
          placeholder="Ask about credit cards..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
