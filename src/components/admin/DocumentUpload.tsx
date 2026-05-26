import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export const DocumentUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check bestandstype
    if (!file.type.match('application/pdf') && !file.type.match('application/epub+zip')) {
      setError('Alleen PDF en EPUB bestanden zijn toegestaan');
      return;
    }

    // Check bestandsgrootte (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Bestand mag niet groter zijn dan 10MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Upload naar Firebase Storage
      const storageRef = ref(storage, `tarot-documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Sla referentie op in Firestore
      await addDoc(collection(db, 'tarot-documents'), {
        fileName: file.name,
        fileUrl: downloadUrl,
        uploadDate: new Date(),
        processed: false // Voor latere verwerking
      });

      setSuccess('Document succesvol geüpload! Het zal binnenkort worden verwerkt.');
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Er is een fout opgetreden bij het uploaden');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">
        Document Uploaden
      </h2>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Upload PDF's of e-books met tarot kennis om de interpretaties te verbeteren.
          De inhoud wordt verwerkt en toegevoegd aan de kennisbank.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-purple-400 focus:outline-none">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="font-medium text-gray-600">
                {uploading ? 'Bezig met uploaden...' : 'Klik om een document te kiezen'}
              </span>
              <span className="text-sm text-gray-500">PDF of EPUB (max. 10MB)</span>
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
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
            <Upload className="w-5 h-5" />
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  );
};