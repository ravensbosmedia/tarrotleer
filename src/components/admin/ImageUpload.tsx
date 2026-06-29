import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Alleen afbeeldingsbestanden zijn toegestaan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Afbeelding mag niet groter zijn dan 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = () => {
      onImageUploaded(reader.result as string);
      setUploading(false);
    };
    reader.onerror = () => {
      setError('Er is een fout opgetreden bij het lezen van de afbeelding');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {currentImageUrl && (
        <div className="relative w-32 h-48 mx-auto">
          <img
            src={currentImageUrl}
            alt="Huidige kaart afbeelding"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload size={20} />
          {uploading ? 'Bezig met laden...' : 'Upload Nieuwe Afbeelding'}
        </button>

        {error && (
          <p className="text-red-600 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};
