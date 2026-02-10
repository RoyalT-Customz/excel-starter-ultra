/**
 * Home Page Component
 * Welcome page with overview of all features
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const savedXp = localStorage.getItem('excel-xp') || '0';
    const savedStreak = localStorage.getItem('excel-streak') || '0';
    setXp(parseInt(savedXp));
    setStreak(parseInt(savedStreak));
  }, []);

  const features = [
    {
      title: '📚 Excel Lessons',
      description: 'Learn Excel step-by-step with interactive lessons and mini-games',
      link: '/lessons',
      accent: 'border-baby-pink'
    },
    {
      title: '🔍 XLOOKUP Trainer',
      description: 'Master XLOOKUP with interactive sandbox and real data',
      link: '/xlookup',
      accent: 'border-baby-pink-dark'
    },
    {
      title: '🤖 AI Excel Coach',
      description: 'Get instant help from our friendly AI tutor',
      link: '/ai-coach',
      accent: 'border-baby-pink'
    },
    {
      title: '📤 File Helper',
      description: 'Upload your Excel file and get AI-powered explanations',
      link: '/file-helper',
      accent: 'border-baby-pink-dark'
    },
    {
      title: '🧪 Practice Sheets',
      description: 'Download ready-made Excel practice files',
      link: '/practice-generator',
      accent: 'border-baby-pink'
    },
  ];

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-baby-pink mb-4">
          Welcome to ExcelStarter Ultra! 🎉
        </h1>
        <p className="text-2xl text-gray-300 mb-6">
          Your interactive guide to mastering Excel from scratch
        </p>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Learn through immersive lessons, hands-on challenges, and mini-games. 
          Earn XP, level up, and become an Excel pro!
        </p>
      </div>

      {/* XP & Stats Bar */}
      <div className="bg-dark-card rounded-2xl p-6 shadow-pink-glow mb-8 border border-dark-border">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">⚡</div>
            <div>
              <p className="text-baby-pink font-bold text-lg">Level {level}</p>
              <div className="w-48 bg-dark-surface rounded-full h-3 mt-1">
                <div
                  className="bg-baby-pink h-3 rounded-full animate-fill-xp"
                  style={{ width: `${xpInLevel}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{xpInLevel}/100 XP to next level</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-baby-pink">{xp}</p>
              <p className="text-xs text-gray-500">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-baby-pink-dark">{streak}🔥</p>
              <p className="text-xs text-gray-500">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className={`bg-dark-card rounded-2xl p-6 border-2 ${feature.accent} hover:shadow-pink-glow transition-all duration-300 transform hover:scale-105 group`}
          >
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-baby-pink transition-colors">
              {feature.title}
            </h2>
            <p className="text-gray-400 text-lg">
              {feature.description}
            </p>
            <div className="mt-4 text-baby-pink font-semibold group-hover:translate-x-2 transition-transform">
              Get Started →
            </div>
          </Link>
        ))}
      </div>

      {/* Getting Started Section */}
      <div className="bg-dark-card rounded-2xl p-8 border border-dark-border">
        <h2 className="text-3xl font-bold text-baby-pink mb-4">
          🚀 Getting Started
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-lg text-gray-300">
          <li>Start with the <Link to="/lessons" className="text-baby-pink font-semibold underline hover:text-baby-pink-light">Lessons</Link> section to learn the basics</li>
          <li>Complete interactive challenges and mini-games within each lesson</li>
          <li>Take quizzes after each lesson to test your knowledge and earn XP</li>
          <li>Practice with the interactive XLOOKUP trainer</li>
          <li>Ask our AI Coach anytime you have questions</li>
          <li>Download practice sheets to apply your skills in real Excel</li>
        </ol>
      </div>

      {/* Encouragement Section */}
      <div className="mt-12 bg-dark-surface rounded-2xl p-8 text-center border border-baby-pink/20">
        <h2 className="text-2xl font-bold text-baby-pink mb-3">
          💪 You've Got This!
        </h2>
        <p className="text-lg text-gray-300">
          Learning Excel might seem challenging at first, but with interactive lessons and hands-on practice, 
          you'll be amazed at how quickly you progress. Earn XP, unlock achievements, and master Excel! 🌟
        </p>
      </div>
    </div>
  );
};

export default Home;
