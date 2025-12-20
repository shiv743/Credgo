// src/components/FloatingChatbotWrapper.js
import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';
import '../styles/FloatingChatbotWrapper.css';

const FloatingChatbotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef();

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Chatbot toggle button */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* Chatbot */}
      {isOpen && (
        <div ref={wrapperRef} className="floating-chatbot">
          <Chatbot />
        </div>
      )}
    </>
  );
};

export default FloatingChatbotWrapper;
