/**
 * Formula Challenge Component
 * Interactive formula building exercise where users type formulas to solve problems
 */

import React, { useState } from 'react';

const FormulaChallenge = ({
  challenges = [], // [{ prompt, data: {}, answer, hint, explanation }]
  title = "Formula Challenge",
  onComplete = () => {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isAllComplete, setIsAllComplete] = useState(false);

  const current = challenges[currentIndex];
  if (!current) return null;

  const checkAnswer = () => {
    const normalizedInput = userInput.trim().toUpperCase().replace(/\s+/g, '');
    const normalizedAnswer = current.answer.toUpperCase().replace(/\s+/g, '');
    
    // Check for multiple valid answers
    const validAnswers = current.altAnswers 
      ? [normalizedAnswer, ...current.altAnswers.map(a => a.toUpperCase().replace(/\s+/g, ''))]
      : [normalizedAnswer];

    if (validAnswers.includes(normalizedInput)) {
      setFeedback('correct');
      if (!completedChallenges.includes(currentIndex)) {
        const newCompleted = [...completedChallenges, currentIndex];
        setCompletedChallenges(newCompleted);
        
        // Award XP
        const currentXp = parseInt(localStorage.getItem('excel-xp') || '0');
        localStorage.setItem('excel-xp', (currentXp + 5).toString());
        
        if (newCompleted.length === challenges.length) {
          setIsAllComplete(true);
          onComplete();
        }
      }
    } else {
      setFeedback('incorrect');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const goToNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setFeedback(null);
      setShowHint(false);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserInput('');
      setFeedback(null);
      setShowHint(false);
    }
  };

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-baby-pink">{title}</h3>
        <span className="text-xs text-gray-500">
          {completedChallenges.length}/{challenges.length} solved
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-4">
        {challenges.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              completedChallenges.includes(i)
                ? 'bg-baby-pink'
                : i === currentIndex
                ? 'bg-baby-pink/50'
                : 'bg-dark-border'
            }`}
          />
        ))}
      </div>

      {/* Challenge */}
      <div className="bg-dark-card rounded-lg p-4 border border-dark-border mb-4">
        <p className="text-sm text-gray-500 mb-1">Challenge {currentIndex + 1} of {challenges.length}</p>
        <p className="text-gray-200 font-medium mb-3">{current.prompt}</p>

        {/* Data Display */}
        {current.data && Object.keys(current.data).length > 0 && (
          <div className="mb-3 overflow-x-auto rounded border border-dark-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-baby-pink/20">
                  <th className="border border-dark-border px-3 py-1 text-baby-pink text-left text-xs">Cell</th>
                  <th className="border border-dark-border px-3 py-1 text-baby-pink text-left text-xs">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(current.data).map(([cell, value]) => (
                  <tr key={cell} className="bg-dark-card">
                    <td className="border border-dark-border px-3 py-1 text-baby-pink font-mono text-xs">{cell}</td>
                    <td className="border border-dark-border px-3 py-1 text-gray-300 font-mono text-xs">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formula Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-baby-pink font-mono font-bold">=</span>
            <input
              type="text"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                setFeedback(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your formula here..."
              className={`w-full pl-8 pr-4 py-2 bg-dark-surface border-2 rounded-lg font-mono text-sm text-white placeholder-gray-600 focus:outline-none ${
                feedback === 'correct' ? 'border-green-500' :
                feedback === 'incorrect' ? 'border-red-500' :
                'border-dark-border focus:border-baby-pink'
              }`}
            />
          </div>
          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-baby-pink text-black rounded-lg font-bold text-sm hover:bg-baby-pink-light transition-colors"
          >
            Check
          </button>
        </div>

        {/* Feedback */}
        {feedback === 'correct' && (
          <div className="mt-3 p-2 bg-green-900/20 border border-green-700/50 rounded-lg">
            <p className="text-green-300 text-sm font-semibold">✅ Correct! +5 XP</p>
            {current.explanation && (
              <p className="text-gray-400 text-xs mt-1">{current.explanation}</p>
            )}
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className="mt-3 p-2 bg-red-900/20 border border-red-700/50 rounded-lg">
            <p className="text-red-300 text-sm font-semibold">❌ Not quite. Try again!</p>
          </div>
        )}

        {/* Hint */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-gray-500 hover:text-baby-pink transition-colors"
          >
            {showHint ? 'Hide Hint' : '💡 Need a hint?'}
          </button>
        </div>
        {showHint && current.hint && (
          <div className="mt-2 p-2 bg-baby-pink/5 border border-baby-pink/10 rounded-lg">
            <p className="text-gray-400 text-xs">{current.hint}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="px-3 py-1 text-sm text-gray-400 hover:text-baby-pink disabled:opacity-30 transition-colors"
        >
          ← Previous
        </button>
        {currentIndex < challenges.length - 1 ? (
          <button
            onClick={goToNext}
            className="px-3 py-1 text-sm text-baby-pink hover:text-baby-pink-light transition-colors"
          >
            Next →
          </button>
        ) : isAllComplete ? (
          <span className="text-baby-pink font-bold text-sm animate-bounce">🎉 All complete!</span>
        ) : (
          <span className="text-xs text-gray-500">Complete all challenges</span>
        )}
      </div>
    </div>
  );
};

export default FormulaChallenge;
