import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './pages/index';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element #root was not found');
}
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Home />
  </StrictMode>
);
