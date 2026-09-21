import { Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import GlobalHeader from './components/GlobalHeader';
import Dashboard from './pages/Dashboard';
import Module1Chapter1 from './pages/Module1Chapter1';
import Module1Chapter2 from './pages/Module1Chapter2';
import Module1Chapter5 from './pages/Module1Chapter5';
import Module2Chapter1 from './pages/Module2Chapter1';
import Module2Chapter2 from './pages/Module2Chapter2';
import Module2Chapter4 from './pages/Module2Chapter4';
import Module2Chapter5 from './pages/Module2Chapter5';
import Module3Chapter1 from './pages/Module3Chapter1';
import Module3Chapter2 from './pages/Module3Chapter2';
import Module3Chapter3 from './pages/Module3Chapter3';
import Module4Chapter2 from './pages/Module4Chapter2';
import Module4Chapter3 from './pages/Module4Chapter3';
import Module4Chapter4 from './pages/Module4Chapter4';
import Module5Chapter2 from './pages/Module5Chapter2';
import Module5Chapter3 from './pages/Module5Chapter3';
import Module6Chapter2 from './pages/Module6Chapter2';
import Module6Chapter4 from './pages/Module6Chapter4';
import Module6Chapter5 from './pages/Module6Chapter5';

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* GlobalHeader is deliberately rendered OUTSIDE any max-width container
          so it spans the full browser viewport, edge to edge. */}
      <GlobalHeader />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/module-1-chapter-1" element={<Module1Chapter1 />} />
        <Route path="/module-1-chapter-2" element={<Module1Chapter2 />} />
        <Route path="/module-1-chapter-5" element={<Module1Chapter5 />} />
        <Route path="/module-2-chapter-1" element={<Module2Chapter1 />} />
        <Route path="/module-2-chapter-2" element={<Module2Chapter2 />} />
        <Route path="/module-2-chapter-4" element={<Module2Chapter4 />} />
        <Route path="/module-2-chapter-5" element={<Module2Chapter5 />} />
        <Route path="/module-3-chapter-1" element={<Module3Chapter1 />} />
        <Route path="/module-3-chapter-2" element={<Module3Chapter2 />} />
        <Route path="/module-3-chapter-3" element={<Module3Chapter3 />} />
        <Route path="/module-4-chapter-2" element={<Module4Chapter2 />} />
        <Route path="/module-4-chapter-3" element={<Module4Chapter3 />} />
        <Route path="/module-4-chapter-4" element={<Module4Chapter4 />} />
        <Route path="/module-5-chapter-2" element={<Module5Chapter2 />} />
        <Route path="/module-5-chapter-3" element={<Module5Chapter3 />} />
        <Route path="/module-6-chapter-2" element={<Module6Chapter2 />} />
        <Route path="/module-6-chapter-4" element={<Module6Chapter4 />} />
        <Route path="/module-6-chapter-5" element={<Module6Chapter5 />} />
      </Routes>
    </Box>
  );
}
