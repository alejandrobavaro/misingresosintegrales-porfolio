// Importación de las bibliotecas principales de React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


if (process.env.NODE_ENV === 'development') {
  window.__googleBrowsingTopicsDisabled = true;
}

//
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'development') {
  window.__googleBrowsingTopicsDisabled = true;
}