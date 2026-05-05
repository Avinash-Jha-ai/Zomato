import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { store } from './states/store.js';
import App from './app/App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </Provider>
);
