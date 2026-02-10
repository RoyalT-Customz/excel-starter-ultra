/**
 * Chat Message Component
 * Displays a single chat message with typewriter effect
 */

import React, { useState, useEffect } from 'react';

const ChatMessage = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.role === 'assistant' && message.content) {
      setIsTyping(true);
      setDisplayedText('');
      let index = 0;
      
      const typewriter = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedText(message.content.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typewriter);
        }
      }, 10);

      return () => clearInterval(typewriter);
    } else {
      setDisplayedText(message.content);
    }
  }, [message]);

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-baby-pink text-black'
            : 'bg-dark-surface text-gray-200 border border-dark-border'
        }`}
      >
        <div className="text-lg whitespace-pre-wrap">
          {displayedText}
          {isTyping && <span className="animate-pulse text-baby-pink">|</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
