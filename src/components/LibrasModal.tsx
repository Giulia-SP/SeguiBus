
import React from 'react';
import { X } from 'lucide-react';

interface LibrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeName: string;
}

const LibrasModal: React.FC<LibrasModalProps> = ({ isOpen, onClose, routeName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="libras-modal-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-11/12 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          aria-label="Fechar modal"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 id="libras-modal-title" className="text-xl font-bold mb-4 text-center">
          Tradução em Libras
        </h2>
        <p className="text-center mb-4">Informações sobre: <span className="font-semibold">{routeName}</span></p>
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          {/* Placeholder for Libras video/animation. Using a GIF for demonstration. */}
          <img 
            src="https://media.tenor.com/f0u5dY3F2SIAAAAC/libras-brazilian-sign-language.gif" 
            alt="Animação de uma pessoa se comunicando em Libras"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Conteúdo em Libras fornecido por Hand Talk.
        </p>
      </div>
    </div>
  );
};

export default LibrasModal;