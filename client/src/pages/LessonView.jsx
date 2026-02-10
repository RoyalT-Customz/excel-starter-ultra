/**
 * Lesson View Page Component
 * Displays full lesson content with stages, interactive challenges, and XP tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import InteractiveChallenge from '../components/InteractiveChallenge';

const LessonView = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'practice'
  const [readProgress, setReadProgress] = useState(0);
  const [lessonXp, setLessonXp] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lessons/${id}`);
        setLesson(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setLoading(false);
      }
    };

    const fetchAllLessons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lessons`);
        setAllLessons(response.data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLesson();
    fetchAllLessons();
    setActiveTab('learn');
    setReadProgress(0);
    setLessonXp(0);
    setShowComplete(false);
  }, [id]);

  // Track reading progress via scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));
        setReadProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleXpEarned = useCallback((xp) => {
    setLessonXp(prev => prev + xp);
  }, []);

  const currentIndex = allLessons.findIndex(l => l.id === parseInt(id));
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-baby-pink animate-pulse">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl text-baby-pink">Lesson not found</div>
        <Link to="/lessons" className="text-baby-pink underline mt-4 inline-block">
          ← Back to Lessons
        </Link>
      </div>
    );
  }

  // Convert markdown-like content to HTML with image support
  const formatContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let currentParagraph = [];
    let listItems = [];
    let inList = false;
    // Sub-list tracking (reserved for future nested list support)

    const processParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(' ');
        elements.push(
          <p key={`p-${elements.length}`} className="mb-4 text-lg leading-relaxed text-gray-300">
            {formatInlineText(text)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const processList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="mb-4 ml-6 list-disc space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-lg leading-relaxed text-gray-300">
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const formatInlineText = (text) => {
      const parts = [];
      let lastIndex = 0;
      
      const imagePattern = /\[IMAGE:([^\]]+)\]|!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;
      
      while ((match = imagePattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index);
          parts.push(formatBoldText(beforeText));
        }
        
        const imagePath = match[3] || match[1];
        const altText = match[2] || match[1] || 'Lesson image';
        parts.push(
          <img
            key={`img-${parts.length}`}
            src={`/${imagePath.startsWith('images/') ? imagePath : `images/${imagePath}`}`}
            alt={altText}
            className="my-6 mx-auto rounded-lg shadow-lg max-w-full h-auto border-2 border-dark-border"
            style={{ maxWidth: '800px' }}
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'my-6 mx-auto p-8 bg-dark-surface rounded-lg border-2 border-baby-pink/20 text-center';
              placeholder.innerHTML = `<p class="text-baby-pink font-semibold">📷 Image: ${altText}</p><p class="text-sm text-gray-500 mt-2">(Image placeholder)</p>`;
              e.target.parentNode.insertBefore(placeholder, e.target);
            }}
          />
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex);
        parts.push(formatBoldText(remainingText));
      }
      
      return parts.length > 0 ? parts : formatBoldText(text);
    };

    const formatBoldText = (text) => {
      const parts = [];
      const boldPattern = /\*\*([^*]+)\*\*/g;
      let lastIndex = 0;
      let match;
      let key = 0;
      
      while ((match = boldPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`bold-${key++}`} className="font-bold text-baby-pink">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts.length > 0 ? parts : text;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Handle images on their own lines
      const imagePattern = /^!\[([^\]]*)\]\(([^)]+)\)$|^\[IMAGE:([^\]]+)\]$/;
      const imageMatch = trimmed.match(imagePattern);
      if (imageMatch) {
        processParagraph();
        processList();
        const imagePath = imageMatch[3] || imageMatch[2];
        const altText = imageMatch[1] || imageMatch[3] || 'Lesson image';
        
        let normalizedPath = imagePath;
        if (!normalizedPath.startsWith('images/')) {
          normalizedPath = `images/${normalizedPath}`;
        }
        
        const publicUrl = process.env.PUBLIC_URL || '';
        const imageSrc = `${publicUrl}/${normalizedPath}`;
        
        elements.push(
          <div key={`img-container-${elements.length}`} className="my-6 flex justify-center">
            <img
              src={imageSrc}
              alt={altText}
              className="rounded-lg shadow-lg max-w-full h-auto border-2 border-dark-border"
              style={{ maxWidth: '800px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'my-6 mx-auto p-8 bg-dark-surface rounded-lg border-2 border-baby-pink/20 text-center max-w-md';
                placeholder.innerHTML = `
                  <p class="text-baby-pink font-semibold">📷 Image: ${altText}</p>
                  <p class="text-sm text-gray-500 mt-2">(Image not found)</p>
                `;
                e.target.parentNode.insertBefore(placeholder, e.target);
              }}
            />
          </div>
        );
        return;
      }
      
      // Handle sub-list items (lines starting with spaces + -)
      if (trimmed.startsWith('- ') && line.startsWith('   ')) {
        if (inList) {
          // Add as sub-item to current list
          const lastItem = listItems[listItems.length - 1];
          listItems[listItems.length - 1] = lastItem; // Keep parent
        }
        listItems.push('  ' + trimmed.substring(2)); // Indent sub-items
        return;
      }
      
      // Handle list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        processParagraph();
        inList = true;
        listItems.push(trimmed.substring(2));
        return;
      }
      
      // Handle numbered list items
      if (/^\d+\.\s/.test(trimmed)) {
        processParagraph();
        if (!inList) {
          processList();
        }
        inList = true;
        listItems.push(trimmed.replace(/^\d+\.\s/, ''));
        return;
      }
      
      // Process any pending list
      if (inList && trimmed !== '') {
        processList();
      }
      
      // Handle code blocks
      if (trimmed.startsWith('```')) {
        processParagraph();
        processList();
        return;
      }
      
      // Handle bold headers
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        processParagraph();
        processList();
        const headerText = trimmed.replace(/\*\*/g, '');
        elements.push(
          <h3 key={`h3-${elements.length}`} className="font-bold text-2xl mt-8 mb-3 text-baby-pink border-b border-dark-border pb-2">
            {headerText}
          </h3>
        );
        return;
      }
      
      // Handle empty lines
      if (trimmed === '') {
        processParagraph();
        processList();
        return;
      }
      
      // Regular paragraph text
      currentParagraph.push(trimmed);
    });
    
    processParagraph();
    processList();
    
    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Top Reading Progress Bar (fixed) */}
      <div className="fixed top-0 left-0 md:left-64 right-0 h-1 bg-dark-surface z-30">
        <div 
          className="h-1 bg-gradient-to-r from-baby-pink-dark to-baby-pink transition-all duration-200"
          style={{ width: `${readProgress}%` }}
        ></div>
      </div>

      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/lessons" 
          className="text-baby-pink font-semibold hover:underline"
        >
          ← Back to All Lessons
        </Link>
        {lessonXp > 0 && (
          <div className="bg-baby-pink/10 text-baby-pink px-3 py-1 rounded-full text-sm font-bold">
            ⚡ +{lessonXp} XP earned
          </div>
        )}
      </div>

      {/* Lesson Header */}
      <div className="bg-dark-card rounded-xl p-8 border border-dark-border mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-baby-pink/20 flex items-center justify-center">
            <span className="text-xl font-bold text-baby-pink">{lesson.order_index}</span>
          </div>
          <div>
            <span className="text-baby-pink font-bold text-sm uppercase tracking-wide">
              Lesson {lesson.order_index} of {allLessons.length}
            </span>
            <h1 className="text-3xl font-bold text-white mt-1">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              activeTab === 'learn'
                ? 'bg-baby-pink text-black shadow-pink-glow'
                : 'bg-dark-surface text-gray-400 hover:text-baby-pink border border-dark-border'
            }`}
          >
            📖 Learn
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              activeTab === 'practice'
                ? 'bg-baby-pink text-black shadow-pink-glow'
                : 'bg-dark-surface text-gray-400 hover:text-baby-pink border border-dark-border'
            }`}
          >
            🎮 Practice & Play
          </button>
        </div>
      </div>

      {/* Learn Tab */}
      {activeTab === 'learn' && (
        <div className="bg-dark-card rounded-xl p-8 border border-dark-border mb-6">
          <div className="prose max-w-none">
            {formatContent(lesson.content)}
          </div>

          {/* Transition to Practice */}
          <div className="mt-10 pt-6 border-t border-dark-border text-center">
            <h3 className="text-xl font-bold text-baby-pink mb-2">
              🎮 Ready to Practice?
            </h3>
            <p className="text-gray-400 mb-4">
              Now that you've read the lesson, put your knowledge to the test with interactive challenges!
            </p>
            <button
              onClick={() => setActiveTab('practice')}
              className="px-8 py-4 bg-baby-pink text-black rounded-lg font-bold text-lg hover:bg-baby-pink-light transition-colors shadow-pink-glow"
            >
              Start Challenges →
            </button>
          </div>
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="mb-6">
          <InteractiveChallenge 
            lessonOrderIndex={lesson.order_index} 
            onXpEarned={handleXpEarned}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to={`/quiz/${id}`}
          className="px-6 py-3 bg-baby-pink text-black rounded-lg font-bold text-lg hover:bg-baby-pink-light transition-colors shadow-pink-glow"
        >
          📝 Take Quiz
        </Link>
        <button
          onClick={async () => {
            try {
              await axios.post(`${API_BASE_URL}/lessons/${id}/complete`, {
                userId: 'default'
              });
              const currentXp = parseInt(localStorage.getItem('excel-xp') || '0');
              localStorage.setItem('excel-xp', (currentXp + 25).toString());
              setShowComplete(true);
              setTimeout(() => setShowComplete(false), 3000);
            } catch (error) {
              console.error('Error:', error);
            }
          }}
          className="px-6 py-3 bg-dark-surface text-baby-pink border border-baby-pink/30 rounded-lg font-bold text-lg hover:bg-baby-pink hover:text-black transition-colors"
        >
          ✅ Mark as Complete
        </button>
        {showComplete && (
          <span className="flex items-center text-baby-pink font-bold animate-bounce">
            ✨ +25 XP! Lesson complete!
          </span>
        )}
      </div>

      {/* Navigation Between Lessons */}
      <div className="flex justify-between items-center bg-dark-card rounded-xl p-6 border border-dark-border">
        {prevLesson ? (
          <Link
            to={`/lessons/${prevLesson.id}`}
            className="px-6 py-3 bg-dark-surface text-baby-pink border border-dark-border rounded-lg font-semibold hover:border-baby-pink/50 transition-colors"
          >
            ← Previous: {prevLesson.title}
          </Link>
        ) : (
          <div></div>
        )}
        
        {nextLesson ? (
          <Link
            to={`/lessons/${nextLesson.id}`}
            className="px-6 py-3 bg-dark-surface text-baby-pink border border-dark-border rounded-lg font-semibold hover:border-baby-pink/50 transition-colors"
          >
            Next: {nextLesson.title} →
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default LessonView;
