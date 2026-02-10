/**
 * ExcelStarter Ultra - Main App Component
 * Handles routing and navigation between different pages
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import LessonView from './pages/LessonView';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import XlookupTrainer from './pages/XlookupTrainer';
import AiCoach from './pages/AiCoach';
import FileHelper from './pages/FileHelper';
import PracticeGenerator from './pages/PracticeGenerator';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-dark">
        {/* Sidebar Navigation */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonView />} />
            <Route path="/quiz/:lessonId" element={<Quiz />} />
            <Route path="/quiz/:lessonId/results" element={<QuizResults />} />
            <Route path="/xlookup" element={<XlookupTrainer />} />
            <Route path="/ai-coach" element={<AiCoach />} />
            <Route path="/file-helper" element={<FileHelper />} />
            <Route path="/practice-generator" element={<PracticeGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
