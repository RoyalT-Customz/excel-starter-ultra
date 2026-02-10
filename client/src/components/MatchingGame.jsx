/**
 * Matching Game Component
 * Drag-and-match terms to their definitions
 */

import React, { useState, useEffect } from 'react';

const MatchingGame = ({ 
  pairs = [], // [{ term: "Cell", definition: "A box where you type data" }]
  title = "Match the Terms!",
  onComplete = () => {}
}) => {
  const [shuffledDefinitions, setShuffledDefinitions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrongMatch, setWrongMatch] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const shuffled = [...pairs.map(p => p.definition)].sort(() => Math.random() - 0.5);
    setShuffledDefinitions(shuffled);
    setMatches({});
    setIsComplete(false);
    setAttempts(0);
  }, [pairs]);

  const handleTermClick = (index) => {
    if (matches[index] !== undefined) return;
    setSelectedTerm(index);
    setWrongMatch(null);
  };

  const handleDefinitionClick = (definition) => {
    if (selectedTerm === null) return;
    
    setAttempts(prev => prev + 1);
    const correctDefinition = pairs[selectedTerm].definition;
    
    if (definition === correctDefinition) {
      const newMatches = { ...matches, [selectedTerm]: definition };
      setMatches(newMatches);
      setSelectedTerm(null);
      setWrongMatch(null);
      
      if (Object.keys(newMatches).length === pairs.length) {
        setIsComplete(true);
        onComplete();
      }
    } else {
      setWrongMatch(definition);
      setTimeout(() => setWrongMatch(null), 800);
    }
  };

  const isDefinitionUsed = (definition) => {
    return Object.values(matches).includes(definition);
  };

  const matchedCount = Object.keys(matches).length;
  const accuracy = attempts > 0 ? Math.round((matchedCount / attempts) * 100) : 0;

  return (
    <div className="bg-dark-surface rounded-xl p-4 border border-baby-pink/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-baby-pink">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{matchedCount}/{pairs.length} matched</span>
          {isComplete && (
            <span className="text-baby-pink font-bold text-sm animate-bounce">✨ +15 XP</span>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        Click a term on the left, then click its matching definition on the right.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Terms Column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Terms</p>
          {pairs.map((pair, index) => (
            <button
              key={`term-${index}`}
              onClick={() => handleTermClick(index)}
              disabled={matches[index] !== undefined}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${
                matches[index] !== undefined
                  ? 'border-green-700/50 bg-green-900/20 text-green-300 opacity-70'
                  : selectedTerm === index
                  ? 'border-baby-pink bg-baby-pink/10 text-white shadow-pink-glow'
                  : 'border-dark-border bg-dark-card text-gray-300 hover:border-baby-pink/50'
              }`}
            >
              {matches[index] !== undefined && <span className="mr-1">✓</span>}
              <span className="font-semibold">{pair.term}</span>
            </button>
          ))}
        </div>

        {/* Definitions Column */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Definitions</p>
          {shuffledDefinitions.map((definition, index) => (
            <button
              key={`def-${index}`}
              onClick={() => handleDefinitionClick(definition)}
              disabled={isDefinitionUsed(definition)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${
                isDefinitionUsed(definition)
                  ? 'border-green-700/50 bg-green-900/20 text-green-300 opacity-70'
                  : wrongMatch === definition
                  ? 'border-red-500 bg-red-900/20 text-red-300 animate-pulse'
                  : 'border-dark-border bg-dark-card text-gray-400 hover:border-baby-pink/50 hover:text-gray-300'
              }`}
            >
              {isDefinitionUsed(definition) && <span className="mr-1">✓</span>}
              {definition}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-dark-card rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-baby-pink-dark to-baby-pink h-2 rounded-full transition-all duration-300"
            style={{ width: `${(matchedCount / pairs.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {isComplete && (
        <div className="mt-4 p-3 bg-baby-pink/10 border border-baby-pink/30 rounded-lg text-center">
          <p className="text-baby-pink font-bold">🎉 All matched! Accuracy: {accuracy}%</p>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
