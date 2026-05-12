import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './routes/AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CountryProvider } from './context/CountryContext.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CountryProvider>
        <AppRouter />
      </CountryProvider>
    </AuthProvider>
  </React.StrictMode>
);
