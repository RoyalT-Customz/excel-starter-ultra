/**
 * Quiz Question Component
 * Displays a single quiz question with multiple choice options
 */

import React from 'react';

const QuizQuestion = ({ question, selectedAnswer, onAnswer }) => {
  const options = [
    { key: 'A', value: question.option_a },
    { key: 'B', value: question.option_b },
    { key: 'C', value: question.option_c },
    { key: 'D', value: question.option_d },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        {question.question}
      </h2>
      
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onAnswer(option.key)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === option.key
                ? 'border-baby-pink bg-baby-pink/10 shadow-pink-glow'
                : 'border-dark-border hover:border-baby-pink/50 hover:bg-dark-surface'
            }`}
          >
            <span className="font-bold text-baby-pink mr-3">
              {option.key}.
            </span>
            <span className="text-lg text-gray-300">
              {option.value}
            </span>
            {selectedAnswer === option.key && (
              <span className="ml-2 text-baby-pink">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
