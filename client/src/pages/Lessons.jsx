/**
 * Lessons Page Component
 * Displays all available lessons in a grid layout with progress tracking
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LessonCard from '../components/LessonCard';
import { API_BASE_URL } from '../config/api';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lessons`);
        setLessons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setLoading(false);
      }
    };

    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lessons/progress/default`);
        const progressMap = {};
        response.data.forEach(item => {
          if (item.completed) {
            progressMap[item.lesson_id] = true;
          }
        });
        setProgress(progressMap);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchLessons();
    fetchProgress();
  }, []);

  const completedCount = Object.keys(progress).length;
  const progressPercentage = lessons.length > 0 
    ? Math.round((completedCount / lessons.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-baby-pink animate-pulse">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        📚 Excel Lessons
      </h1>
      
      {/* Progress Bar */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-300">
            Your Progress
          </span>
          <span className="text-lg font-bold text-baby-pink">
            {completedCount} / {lessons.length} lessons completed
          </span>
        </div>
        <div className="w-full bg-dark-surface rounded-full h-6">
          <div
            className="bg-gradient-to-r from-baby-pink-dark to-baby-pink h-6 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">
            {progressPercentage}% complete - Keep going! 💪
          </p>
          <p className="text-sm text-baby-pink/70">
            🏆 {completedCount * 25} XP earned from lessons
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isCompleted={progress[lesson.id] || false}
            onComplete={async () => {
              try {
                const response = await axios.get(`${API_BASE_URL}/lessons/progress/default`);
                const progressMap = {};
                response.data.forEach(item => {
                  if (item.completed) {
                    progressMap[item.lesson_id] = true;
                  }
                });
                setProgress(progressMap);
              } catch (error) {
                console.error('Error fetching progress:', error);
              }
            }}
          />
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12 bg-dark-card rounded-xl border border-dark-border">
          <p className="text-xl text-gray-400">No lessons available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Lessons;
