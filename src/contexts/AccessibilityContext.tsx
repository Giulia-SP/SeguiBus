
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    textToSpeech: 'speechSynthesis' in window,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (settings.highContrast) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.highContrast]);
  
  useEffect(() => {
    const root = document.documentElement;
    if (settings.largeText) {
      root.classList.add('text-xl');
    } else {
      root.classList.remove('text-xl');
    }
  }, [settings.largeText]);

  const toggleHighContrast = () => {
    setSettings(s => ({ ...s, highContrast: !s.highContrast }));
  };
  
  const toggleLargeText = () => {
    setSettings(s => ({ ...s, largeText: !s.largeText }));
  };

  const speak = (text: string) => {
    if (!settings.textToSpeech) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, toggleHighContrast, toggleLargeText, speak }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};