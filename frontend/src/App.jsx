import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminPanel from './pages/AdminPanel';
import '../src/styles/globals.css';

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>
        } />
        <Route path="/organizer" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}><OrganizerDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" toastOptions={{
        style: { background: 'rgba(15,15,25,0.95)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', fontFamily: 'DM Sans, sans-serif', borderRadius: 12 },
        success: { iconTheme: { primary: '#43e97b', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}