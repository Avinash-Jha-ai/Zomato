import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { store } from './states/store.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import App from './app/App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);
