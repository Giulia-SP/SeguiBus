
import React from 'react';
import { useVoiceCommand } from '../contexts/VoiceCommandContext';
import { Mic, MicOff } from 'lucide-react';

const VoiceControl: React.FC = () => {
  const { isListening, startListening, stopListening, transcript, isSupported } = useVoiceCommand();

  if (!isSupported) {
    return null; // Don't render if the browser doesn't support the API
  }
  
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggleListening}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
            isListening ? 'bg-red-500 focus:ring-red-300' : 'bg-blue-500 focus:ring-blue-300'
          }`}
          aria-label={isListening ? 'Parar de ouvir' : 'Ativar comando de voz'}
        >
          {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </button>
      </div>
      {isListening && (
         <div className="fixed bottom-24 right-6 bg-black bg-opacity-70 text-white text-sm px-4 py-2 rounded-lg z-50 animate-pulse">
            Ouvindo...
         </div>
      )}
      {transcript && !isListening && (
        <div className="fixed bottom-24 right-6 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg z-50"
          // Hide the transcript message after a few seconds
          onAnimationEnd={(e) => (e.currentTarget.style.display = 'none')}
          style={{animation: 'fadeOut 4s forwards'}}
        >
            Comando recebido: "{transcript}"
        </div>
      )}
    </>
  );
};

export default VoiceControl;
