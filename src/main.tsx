import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProgressProvider } from './context/AuthProgressContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProgressProvider>
        <App />
      </AuthProgressProvider>
    </LanguageProvider>
  </React.StrictMode>
);
