import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/admin/AdminLogin';
import { CardEditor } from './components/admin/CardEditor';
import { auth } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReadingPage from './pages/ReadingPage';
import { HomePage } from './pages/HomePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/cards"
          element={
            <ProtectedRoute>
              <CardEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/reading/:type" element={<ReadingPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;