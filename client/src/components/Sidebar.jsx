/**
 * Sidebar Navigation Component
 * Provides easy navigation between all sections of the app
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '🏠 Home', icon: '🏠' },
    { path: '/lessons', label: '📚 Lessons', icon: '📚' },
    { path: '/xlookup', label: '🔍 XLOOKUP Trainer', icon: '🔍' },
    { path: '/ai-coach', label: '🤖 AI Coach', icon: '🤖' },
    { path: '/file-helper', label: '📤 File Helper', icon: '📤' },
    { path: '/practice-generator', label: '🧪 Practice Sheets', icon: '🧪' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-20 bg-baby-pink text-black p-3 rounded-lg shadow-pink-glow font-bold"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-70 z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar / Mobile Menu */}
      <aside
        className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border z-20 transition-transform duration-300`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-baby-pink mb-8">
            ExcelStarter Ultra
          </h1>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-baby-pink text-black shadow-pink-glow'
                      : 'text-gray-300 hover:bg-dark-surface hover:text-baby-pink'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label.replace(/^[^\s]+\s/, '')}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-dark-border">
          <p className="text-sm text-gray-500 text-center">
            Made with ❤️ for beginners
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
