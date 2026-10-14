import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { leesTekstStand, pasTekstStandToe } from './lib/tekstgrootte';

// Gekozen tekstgrootte meteen toepassen (geen verspringen bij het laden)
pasTekstStandToe(leesTekstStand());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
