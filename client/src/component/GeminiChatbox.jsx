import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance, endPoints } from '../api/axios';
import { IoSend, IoClose } from 'react-icons/io5';
import { FaRobot, FaUser } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiMinimize2, FiMaximize2 } from 'react-icons/fi';
import { MdChat } from 'react-icons/md';
import './GeminiChatbox.css';

const GeminiChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Gemini AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(endPoints.ai.chat, { prompt: input });
      const botMessage = { 
        text: response.data?.data || "I'm sorry, I couldn't process that.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the AI. Please try again later.", 
        sender: 'bot',
        isError: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="gemini-chat-toggle"
        onClick={() => setIsOpen(true)}
        title="Chat with Gemini"
      >
        <MdChat size={30} />
      </button>
    );
  }

  return (
    <div className={`gemini-chat-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="gemini-chat-header">
        <div className="gemini-chat-title">
          <FaRobot size={20} className="bot-icon" />
          <span>Gemini AI</span>
        </div>
        <div className="gemini-chat-actions">
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <FiMaximize2 size={18} /> : <FiMinimize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)}>
            <IoClose size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="gemini-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                <div className="message-icon">
                  {msg.sender === 'bot' ? <FaRobot size={16} /> : <FaUser size={16} />}
                </div>
                <div className={`message-content ${msg.isError ? 'error' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper bot">
                <div className="message-icon">
                  <FaRobot size={16} />
                </div>
                <div className="message-content loading">
                  <BiLoaderAlt className="animate-spin" size={16} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="gemini-chat-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              <IoSend size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default GeminiChatbox;
