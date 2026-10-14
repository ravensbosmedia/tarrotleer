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
        className={`bg-[#F1CB78] text-[#1C0D06] py-2 px-4 rounded hover:bg-[#FFC653] transition-colors ${
          importing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {importing ? 'Bezig met importeren...' : 'Importeer Kaarten'}
      </button>
      {message && (
        <p className={`mt-2 ${
          message.includes('succesvol') ? 'text-[#9BD49B]' : 'text-[#F0A596]'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};
