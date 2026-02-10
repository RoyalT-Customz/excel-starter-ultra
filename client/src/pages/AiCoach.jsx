/**
 * AI Coach Page Component
 * Chat interface with AI Excel tutor, includes voice input
 */

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatMessage from '../components/ChatMessage';
import { API_BASE_URL } from '../config/api';

const AiCoach = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your friendly Excel tutor. Ask me anything about Excel, and I'll explain it in simple terms! 😊"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        alert('Sorry, there was an error with voice recognition. Please try typing instead.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/coach`, {
        message: input,
        simpleMode
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Please make sure the OpenAI API key is configured, or try again later. 😔"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const suggestedPrompts = [
    "What is a formula?",
    "How do I use SUM?",
    "Explain XLOOKUP simply",
    "What are cells and rows?",
    "How do I create a chart?"
  ];

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        🤖 AI Excel Coach
      </h1>

      {/* Mode Toggle */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border mb-6">
        <label className="flex items-center cursor-pointer">
          <span className="text-lg font-semibold text-gray-300 mr-4">
            Simple Mode (Beginner-Friendly):
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={simpleMode}
              onChange={(e) => setSimpleMode(e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${
              simpleMode ? 'bg-baby-pink' : 'bg-dark-surface'
            }`}>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                simpleMode ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
          </div>
        </label>
      </div>

      {/* Chat Messages */}
      <div className="bg-dark-card rounded-xl border border-dark-border mb-6 h-96 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {loading && (
            <div className="flex items-center text-gray-500">
              <div className="animate-pulse text-baby-pink">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border mb-6">
        <p className="text-sm font-semibold text-gray-400 mb-2">
          💡 Try asking:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedPrompt(prompt)}
              className="px-4 py-2 bg-dark-surface text-baby-pink border border-baby-pink/20 rounded-lg text-sm font-semibold hover:bg-baby-pink hover:text-black transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about Excel..."
            className="flex-1 px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-lg text-lg text-white focus:outline-none focus:border-baby-pink placeholder-gray-600"
          />
          <button
            onClick={handleVoiceInput}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-dark-surface text-baby-pink border border-baby-pink/30 hover:bg-baby-pink hover:text-black'
            }`}
            title="Voice Input"
          >
            🎤
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-baby-pink text-black rounded-lg font-bold text-lg hover:bg-baby-pink-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-pink-glow"
          >
            Send
          </button>
        </div>
        {isListening && (
          <p className="text-sm text-red-400 mt-2 text-center">
            🎤 Listening... Speak now!
          </p>
        )}
      </div>
    </div>
  );
};

export default AiCoach;
