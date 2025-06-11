import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { FrameworkProvider } from './context/FrameworkProvider';
import App from './App';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FrameworkProvider>
          <App />
        </FrameworkProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);