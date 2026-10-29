import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProgressProvider } from './context/AuthProgressContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProgressProvider>
          <App />
        </AuthProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
