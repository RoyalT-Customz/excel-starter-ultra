/**
 * Quiz Results Page Component
 * Displays quiz results with score, XP earned, and explanations
 */

import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const QuizResults = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const results = location.state?.results;

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-400">No results found.</p>
        <Link to="/lessons" className="text-baby-pink underline mt-4 inline-block">
          ← Back to Lessons
        </Link>
      </div>
    );
  }

  const { score, totalQuestions, percentage, results: detailedResults, xpEarned } = results;
  const isPassing = percentage >= 70;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-baby-pink mb-6">
        🎉 Quiz Results
      </h1>

      {/* Score Summary */}
      <div className={`bg-dark-card rounded-xl p-8 border-2 mb-6 text-center ${
        isPassing ? 'border-baby-pink shadow-pink-glow' : 'border-dark-border'
      }`}>
        <div className="text-6xl mb-4">
          {isPassing ? '🎊' : '💪'}
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          You scored {score} out of {totalQuestions}!
        </h2>
        <div className="text-5xl font-bold text-baby-pink mb-4">
          {percentage}%
        </div>
        {xpEarned > 0 && (
          <div className="inline-block bg-baby-pink/20 text-baby-pink px-4 py-2 rounded-full font-bold text-lg mb-4">
            +{xpEarned} XP earned! ⚡
          </div>
        )}
        {isPassing ? (
          <p className="text-xl text-gray-300">
            Excellent work! You're doing great! 🌟
          </p>
        ) : (
          <p className="text-xl text-gray-300">
            Good effort! Review the explanations below and try again! 💪
          </p>
        )}
      </div>

      {/* Detailed Results */}
      <div className="space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-baby-pink">
          Review Your Answers
        </h2>
        {detailedResults.map((result, index) => (
          <div
            key={index}
            className={`bg-dark-card rounded-xl p-6 border-l-4 ${
              result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
            } border border-dark-border`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-white">
                Question {index + 1}
              </h3>
              <span className="text-2xl">
                {result.isCorrect ? '✅' : '❌'}
              </span>
            </div>
            
            <p className="text-lg text-gray-300 mb-4">
              {result.question}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className={`p-3 rounded-lg ${
                result.isCorrect
                  ? 'bg-green-900/30 border border-green-700/50'
                  : 'bg-red-900/30 border border-red-700/50'
              }`}>
                <span className="font-semibold text-gray-300">Your answer: </span>
                <span className="text-gray-200">{result.userAnswer || 'Not answered'}</span>
              </div>
              
              {!result.isCorrect && (
                <div className="p-3 rounded-lg bg-green-900/30 border border-green-700/50">
                  <span className="font-semibold text-gray-300">Correct answer: </span>
                  <span className="text-gray-200">{result.correctAnswer}</span>
                </div>
              )}
            </div>
            
            {result.explanation && (
              <div className="bg-dark-surface p-4 rounded-lg border border-baby-pink/20">
                <p className="font-semibold text-baby-pink mb-1">
                  💡 Explanation:
                </p>
                <p className="text-gray-300">
                  {result.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          to={`/quiz/${lessonId}`}
          className="px-6 py-3 bg-baby-pink text-black rounded-lg font-bold text-lg hover:bg-baby-pink-light transition-colors shadow-pink-glow"
        >
          🔄 Retry Quiz
        </Link>
        <Link
          to={`/lessons/${lessonId}`}
          className="px-6 py-3 bg-dark-surface text-baby-pink border border-baby-pink/30 rounded-lg font-bold text-lg hover:bg-baby-pink hover:text-black transition-colors"
        >
          📚 Review Lesson
        </Link>
        <Link
          to="/lessons"
          className="px-6 py-3 bg-dark-card text-gray-300 rounded-lg font-bold text-lg hover:text-baby-pink transition-colors border border-dark-border"
        >
          ← Back to Lessons
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;
