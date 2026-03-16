import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './pages/LoginPage';
import Portal from './components/Portal';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <DataProvider>
            <Portal />
          </DataProvider>
        ) : (
          <LoginPage />
        )}
      </AnimatePresence>
      <Toaster
        position="top-right"
        containerStyle={{ top: 20, right: 16 }}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15,15,25,0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
