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
    <div className="zf-pagina flex items-center justify-center">
      <div className="zf-kaart p-8 w-full max-w-md">
        <h2 className="zf-sectie mb-6">Admin Login</h2>
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
              className="zf-veld w-full"
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
              className="zf-veld w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="zf-knop w-full"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
};
