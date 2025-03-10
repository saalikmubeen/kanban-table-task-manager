import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AppDataContextProvider } from './context/AppContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDataContextProvider>
      <App />
    </AppDataContextProvider>
  </StrictMode>
);
