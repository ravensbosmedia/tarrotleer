import React, { useState } from 'react';
import { addDocument } from '../../config/localDB';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export const DocumentUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match('application/pdf') && !file.type.match('application/epub+zip')) {
      setError('Alleen PDF en EPUB bestanden zijn toegestaan');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Bestand mag niet groter zijn dan 10MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    reader.onload = () => {
      try {
        addDocument({
          fileName: file.name,
          fileUrl: reader.result as string,
          uploadDate: new Date().toISOString(),
          processed: false
        });
        setSuccess('Document succesvol opgeslagen in lokale opslag!');
      } catch (err) {
        setError('Er is een fout opgetreden bij het opslaan');
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setError('Er is een fout opgetreden bij het lezen van het bestand');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#20162F] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-[#F1CB78] mb-4">
        Document Uploaden
      </h2>

      <div className="mb-4">
        <p className="text-[#CFC2DC]">
          Upload PDF's of e-books met tarot kennis om de interpretaties te verbeteren.
          De bestanden worden lokaal opgeslagen.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <div className="flex items-center justify-center w-full h-32 px-4 transition bg-[#20162F] border-2 border-[rgba(194,146,189,0.45)] border-dashed rounded-lg appearance-none cursor-pointer hover:border-[#EFB4FF] focus:outline-none">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-[#F1CB78]" />
              <span className="font-medium text-[#CFC2DC]">
                {uploading ? 'Bezig met opslaan...' : 'Klik om een document te kiezen'}
              </span>
              <span className="text-sm text-[#B9A9CC]">PDF of EPUB (max. 10MB)</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.epub"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        </label>

        {error && (
          <div className="flex items-center gap-2 text-[#F0A596] bg-[rgba(200,96,79,0.15)] p-3 rounded">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-[#9BD49B] bg-[rgba(95,167,119,0.15)] p-3 rounded">
            <Upload className="w-5 h-5" />
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};
