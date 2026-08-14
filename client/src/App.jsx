import { useAuth } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { socket } from './utils/socket';
import { SOCKET_EVENTS } from '../../shared/gameConstants.js';


import RoomManger from './components/RoomManager';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import Profile from './components/Profile';

function ProtectedRoute({children}) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen></LoadingScreen>

  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const savedSession = localStorage.getItem('bridge_session');
    
    if (savedSession) {
        const { roomCode, userId } = JSON.parse(savedSession);
        
        socket.emit(SOCKET_EVENTS.RECONNECT_TO_ROOM, { roomCode, userId }, (response) => {
            if (response.success) {
              navigate(`/room/${roomCode}`, { 
                  state: { recoveredGameState: response.gameState } 
              });
            } 
            else localStorage.removeItem('bridge_session');
        });
    }
  }, [navigate]);

  return (
      <Routes>
        <Route
          path="/"
          element={<LandingPage></LandingPage>}
        />

        <Route
          path="/profile/:username"
          element={<Profile />}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room/:code"
          element={
            <ProtectedRoute>
              <RoomManger />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

function App() {
  return (
    <Router>
        <AppRoutes />
    </Router>
  );
}

export default App
