import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Polyfill for SpeechRecognition
// FIX: Cast window to 'any' to access non-standard SpeechRecognition APIs and rename to avoid shadowing the type.
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface VoiceCommand {
  command: string;
  payload?: any;
}

interface VoiceCommandContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  lastCommand: VoiceCommand | null;
  clearLastCommand: () => void;
  isSupported: boolean;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

export const VoiceCommandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  // FIX: The variable 'SpeechRecognition' was being used as a type, causing an error. After renaming the variable, the type is unavailable, so 'any' is used.
  const recognitionRef = useRef<any | null>(null);
  
  const navigate = useNavigate();
  const { logout } = useAuth();

  const processCommand = useCallback((rawTranscript: string) => {
    const command = rawTranscript.toLowerCase().trim();
    console.log('Voice command received:', command);
    setTranscript(command);

    if (command.includes('ir para comunicação')) {
      navigate('/communication');
    } else if (command.includes('ir para o painel') || command.includes('voltar ao início')) {
      navigate('/dashboard');
    } else if (command.includes('gerenciar rotas')) {
      navigate('/admin/routes');
    } else if (command.includes('sair') || command.includes('deslogar')) {
      logout();
    } else if (command.includes('ler ônibus') || command.includes('ler rotas próximas')) {
      setLastCommand({ command: 'READ_ROUTES' });
    } else {
        console.log("Command not recognized.");
    }
  }, [navigate, logout]);

  useEffect(() => {
    if (!SpeechRecognitionAPI) {
        console.error("Speech Recognition API not supported in this browser.");
        return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript;
      processCommand(command);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setTranscript('');
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [processCommand]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Could not start listening:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearLastCommand = () => setLastCommand(null);

  return (
    <VoiceCommandContext.Provider value={{
      isListening,
      transcript,
      startListening,
      stopListening,
      lastCommand,
      clearLastCommand,
      isSupported: !!SpeechRecognitionAPI
    }}>
      {children}
    </VoiceCommandContext.Provider>
  );
};

export const useVoiceCommand = (): VoiceCommandContextType => {
  const context = useContext(VoiceCommandContext);
  if (!context) {
    throw new Error('useVoiceCommand must be used within a VoiceCommandProvider');
  }
  return context;
};
