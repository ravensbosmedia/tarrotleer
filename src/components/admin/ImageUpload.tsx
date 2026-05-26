import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, currentImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Controleer bestandstype
    if (!file.type.startsWith('image/')) {
      setError('Alleen afbeeldingsbestanden zijn toegestaan');
      return;
    }

    // Controleer bestandsgrootte (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Afbeelding mag niet groter zijn dan 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileName = `card-images/${uuidv4()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      onImageUploaded(downloadUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Er is een fout opgetreden bij het uploaden van de afbeelding');
    } finally {
      setUploading(false);
    }
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
          {uploading ? 'Bezig met uploaden...' : 'Upload Nieuwe Afbeelding'}
        </button>
        
        {error && (
          <p className="text-red-600 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};