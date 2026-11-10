import { MotionConfig } from 'framer-motion';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { MetaProvider } from './context/MetaContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter><MetaProvider><AuthProvider><App /></AuthProvider></MetaProvider></BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
