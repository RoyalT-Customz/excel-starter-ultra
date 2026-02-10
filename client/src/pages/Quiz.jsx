/**
 * Quiz Page Component
 * Displays quiz questions and handles user answers with XP rewards
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuizQuestion from '../components/QuizQuestion';
import { API_BASE_URL } from '../config/api';

const Quiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quizzes/${lessonId}`);
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [lessonId]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      if (!window.confirm(`You haven't answered ${unanswered.length} question(s). Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/quizzes/${lessonId}/submit`,
        {
          answers,
          userId: 'default'
        }
      );
      
      // Award XP based on score
      const { score, totalQuestions } = response.data;
      const xpEarned = Math.round((score / totalQuestions) * 50);
      const currentXp = parseInt(localStorage.getItem('excel-xp') || '0');
      localStorage.setItem('excel-xp', (currentXp + xpEarned).toString());
      
      navigate(`/quiz/${lessonId}/results`, {
        state: { results: { ...response.data, xpEarned } }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Oops! Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-baby-pink animate-pulse">Loading quiz...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-dark-card rounded-xl border border-dark-border">
        <p className="text-xl text-gray-400">No questions available for this lesson.</p>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        📝 Quiz Time!
      </h1>

      {/* Progress Bar */}
      <div className="bg-dark-card rounded-xl p-6 border border-dark-border mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-300">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-lg font-bold text-baby-pink">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-dark-surface rounded-full h-6">
          <div
            className="bg-gradient-to-r from-baby-pink-dark to-baby-pink h-6 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-dark-card rounded-xl p-8 border border-dark-border mb-6">
        <QuizQuestion
          question={currentQ}
          selectedAnswer={answers[currentQ.id]}
          onAnswer={(answer) => handleAnswer(currentQ.id, answer)}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-dark-surface text-baby-pink border border-baby-pink/30 rounded-lg font-bold text-lg hover:bg-baby-pink hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-baby-pink text-black rounded-lg font-bold text-lg hover:bg-baby-pink-light transition-colors shadow-pink-glow"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-baby-pink text-black rounded-lg font-bold text-lg hover:bg-baby-pink-light transition-colors shadow-pink-glow disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz ✅'}
          </button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestion(index)}
            className={`w-4 h-4 rounded-full transition-all ${
              index === currentQuestion
                ? 'bg-baby-pink w-8 shadow-pink-glow'
                : answers[q.id]
                ? 'bg-baby-pink/40'
                : 'bg-dark-surface border border-dark-border'
            }`}
            title={`Question ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Quiz;
