import React, { useState } from 'react';
import { login } from '../../config/localAuth';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin/cards');
    } else {
      setError('Ongeldige inloggegevens');
    }
  };

  return (
    <div className="min-h-screen bg-[#2D2040] flex items-center justify-center">
      <div className="bg-[#20162F] p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#F1CB78] mb-6">Admin Login</h2>
        <p className="text-sm text-[#B9A9CC] mb-4">Standaard wachtwoord: <code>admin123</code></p>
        {error && (
          <div className="bg-[rgba(200,96,79,0.22)] border border-[#F0A596] text-[#F0A596] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#E0D5E9] text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#F1CB78]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#E0D5E9] text-sm font-bold mb-2">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#F1CB78]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F1CB78] text-[#1C0D06] py-2 px-4 rounded hover:bg-[#FFC653] transition-colors"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
};
