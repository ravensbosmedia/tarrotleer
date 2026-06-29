import React, { useState } from 'react';
import { importCardsToLocalStorage } from '../../utils/importCards';

interface ImportButtonProps {
  onImported?: () => void;
}

export const ImportButton: React.FC<ImportButtonProps> = ({ onImported }) => {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = () => {
    if (importing) return;

    setImporting(true);
    setMessage('Bezig met importeren...');

    try {
      const result = importCardsToLocalStorage();
      setMessage(result.message);
      if (result.success && onImported) {
        onImported();
      }
    } catch (error) {
      setMessage('Er is een fout opgetreden.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleImport}
        disabled={importing}
        className={`bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors ${
          importing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {importing ? 'Bezig met importeren...' : 'Importeer Kaarten'}
      </button>
      {message && (
        <p className={`mt-2 ${
          message.includes('succesvol') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};
