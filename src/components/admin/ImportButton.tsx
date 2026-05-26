import React, { useState } from 'react';
import { importCardsToFirebase } from '../../utils/importCards';

export const ImportButton: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    if (importing) return;
    
    setImporting(true);
    setMessage('Bezig met importeren...');
    
    try {
      const result = await importCardsToFirebase();
      setMessage(result.message);
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