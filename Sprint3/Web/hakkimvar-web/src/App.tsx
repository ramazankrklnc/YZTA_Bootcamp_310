import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HomeDashboard } from './pages/HomeDashboard';
import { ContractAnalysis } from './pages/ContractAnalysis';
import { AiChat } from './pages/AiChat';
import { Petition } from './pages/Petition';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<HomeDashboard />} />
          <Route path="/analysis" element={<ContractAnalysis />} />
          <Route path="/chat" element={<AiChat />} />
          <Route path="/petition" element={<Petition />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}