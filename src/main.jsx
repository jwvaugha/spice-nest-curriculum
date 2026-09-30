import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* HashRouter, not BrowserRouter -- GitHub Pages is a static file
          host with no server-side rewrite rule, so a direct load or
          refresh on a client-side route like /dashboard would 404 (GitHub
          Pages has no way to know that path should fall back to
          index.html). HashRouter keeps all real routing state after the
          "#", which the browser never sends to the server at all, so every
          URL resolves to the same actual file (index.html) regardless of
          which in-app route it represents. Trade-off: URLs now look like
          .../#/dashboard instead of .../dashboard -- an intentional,
          necessary concession for a shareable static-hosted link, not an
          oversight. */}
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
