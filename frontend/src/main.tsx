import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { FinancialProvider } from './context/FinancialContext';
import './styles/index.css';
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add('is-capacitor');
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <FinancialProvider>
          <App />
        </FinancialProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
