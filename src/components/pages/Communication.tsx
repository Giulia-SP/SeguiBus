import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { COMMUNICATION_PHRASES } from '../../constants';

const Communication: React.FC = () => {
  const { speak } = useAccessibility();
  const [customText, setCustomText] = useState('');

  const handleSpeakCustomText = () => {
    if (customText.trim()) {
      speak(customText.trim());
      setCustomText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
       <Link to="/dashboard" className="inline-flex items-center mb-6 text-blue-600 dark:text-cyan-400 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o Dashboard
      </Link>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-center">Comunicação Rápida</h1>
        
        <div className="my-8">
            <h2 className="text-xl font-semibold mb-3 text-center">Fale o que quiser</h2>
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSpeakCustomText()}
                    placeholder="Digite sua mensagem aqui..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Caixa de texto para mensagem personalizada"
                />
                <button
                    onClick={handleSpeakCustomText}
                    disabled={!customText.trim()}
                    className="bg-green-500 text-white px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Falar texto digitado"
                >
                    <Send className="h-5 w-5" />
                    <span>Falar</span>
                </button>
            </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Ou toque em uma frase para que o sistema fale por você.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMUNICATION_PHRASES.map((phrase) => {
            const Icon = phrase.icon;
            return (
              <button
                key={phrase.id}
                onClick={() => speak(phrase.text)}
                className="bg-blue-500 dark:bg-blue-700 text-white rounded-lg p-6 flex flex-col items-center justify-center text-center h-40 hover:bg-blue-600 dark:hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-md"
                aria-label={`Falar a frase: ${phrase.text}`}
              >
                <Icon className="h-10 w-10 mb-3" />
                <span className="font-semibold">{phrase.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Communication;