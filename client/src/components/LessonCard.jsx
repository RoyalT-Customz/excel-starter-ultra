/**
 * Lesson Card Component
 * Displays a single lesson with completion status and XP rewards
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const LessonCard = ({ lesson, isCompleted, onComplete }) => {
  const [markingComplete, setMarkingComplete] = useState(false);

  const handleMarkComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCompleted) return;
    
    setMarkingComplete(true);
    try {
      await axios.post(`${API_BASE_URL}/lessons/${lesson.id}/complete`, {
        userId: 'default'
      });
      // Award XP
      const currentXp = parseInt(localStorage.getItem('excel-xp') || '0');
      localStorage.setItem('excel-xp', (currentXp + 25).toString());
      onComplete();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      alert('Oops! Something went wrong. Please try again.');
    } finally {
      setMarkingComplete(false);
    }
  };

  return (
    <Link to={`/lessons/${lesson.id}`}>
      <div className={`bg-dark-card rounded-xl p-6 border-2 hover:shadow-pink-glow transition-all duration-300 transform hover:scale-105 ${
        isCompleted ? 'border-baby-pink shadow-pink-glow' : 'border-dark-border hover:border-baby-pink/50'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-full bg-baby-pink/20 flex items-center justify-center">
            <span className="text-lg font-bold text-baby-pink">
              {lesson.order_index}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="text-xs bg-baby-pink/20 text-baby-pink px-2 py-1 rounded-full font-semibold">+25 XP</span>
            )}
            {isCompleted && (
              <span className="text-2xl">✅</span>
            )}
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-3">
          {lesson.title}
        </h2>
        
        <p className="text-gray-400 mb-4 line-clamp-3">
          {lesson.content.substring(0, 100)}...
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-baby-pink font-semibold">
            Start Lesson →
          </span>
          {!isCompleted && (
            <button
              onClick={handleMarkComplete}
              disabled={markingComplete}
              className="px-4 py-2 bg-dark-surface text-baby-pink border border-baby-pink/30 rounded-lg font-semibold hover:bg-baby-pink hover:text-black transition-colors disabled:opacity-50"
            >
              {markingComplete ? 'Marking...' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LessonCard;
