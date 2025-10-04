import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import './styles/tailwind.css';
import App from './App.js';
import UserProvider from './context/user/UserProvider';
import LoadingProvider from './context/loading/LoadingProvider';
import CompanyProvider from './context/company/CompanyProvider';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <UserProvider>
          <CompanyProvider>
            <App />
          </CompanyProvider>
        </UserProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
