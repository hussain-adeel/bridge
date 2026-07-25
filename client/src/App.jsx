import { AuthProvider, useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import RoomManger from './components/RoomManager';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
//import Profile from './components/Profile';

function ProtectedRoute({children}) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen></LoadingScreen>

  return user ? children : <Navigate to="/" replace />;
}

function App() {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LandingPage></LandingPage>}
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage onJoinRoom={() => console.log("Join Room")} onCreateRoom={() => console.log("Create Room")} />
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
    </Router>

  );
}

export default App