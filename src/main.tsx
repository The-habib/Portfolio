import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught Error:', error, errorInfo);
    fetch('/api/client-error', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'react_uncaught', error: String(error) }) }).catch(()=>{});
  },
  onCaughtError: (error, errorInfo) => {
    console.error('Caught Error:', error, errorInfo);
    fetch('/api/client-error', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'react_caught', error: String(error) }) }).catch(()=>{});
  }
}).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
