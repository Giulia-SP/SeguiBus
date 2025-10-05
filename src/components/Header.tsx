
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bus, User, LogOut, SlidersHorizontal, Sun, Moon, Type } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, toggleHighContrast, toggleLargeText } = useAccessibility();

  return (
    <header className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-800 dark:to-cyan-700 text-white shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Bus className="h-8 w-8" />
        <h1 className="text-2xl font-bold">SeguiBus</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="hidden sm:block">Olá, {user?.name}</span>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Opções de acessibilidade e usuário"
          >
            <SlidersHorizontal className="h-6 w-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 text-gray-800 dark:text-gray-200">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold">Acessibilidade</p>
              </div>
              <ul className="py-2">
                <li 
                  className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={toggleHighContrast}
                >
                  <div className="flex items-center space-x-2">
                    {settings.highContrast ? <Sun /> : <Moon />}
                    <span>Alto Contraste</span>
                  </div>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.highContrast ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.highContrast ? 'translate-x-4' : ''}`}></div>
                  </div>
                </li>
                <li 
                  className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={toggleLargeText}
                >
                  <div className="flex items-center space-x-2">
                    <Type />
                    <span>Texto Grande</span>
                  </div>
                   <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${settings.largeText ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${settings.largeText ? 'translate-x-4' : ''}`}></div>
                  </div>
                </li>
              </ul>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button onClick={logout} className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-500">
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;