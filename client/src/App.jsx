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
  
  // const localUser = {
  //   username: 'Alice',
  //   id: 'socket_1'
  // }

  // const mockGameState = {
  //   // --- 1. GAME META ---
  //   roomCode: 'A23F',
  //   gamePhase: 'PLAYING',
  //   round: 1, // bidding round 1, 2 dealing round 1, 2, 3 playing rounds 1 - up to 13
  //   activePlayerIndex: 0,

  //   // --- 2. TEAMS (Objective Server Data) ---
  //   // No color data here! Just abstract team identifiers and optional display names.
  //   teams: {
  //     'team_1': { name: 'Alpha' },
  //     'team_2': { name: 'Bravo' }
  //   },

  //   // --- 3. ROSTER (Clockwise Order) ---
  //   players: [
  //     { id: 'socket_1', index: 0, username: 'Alice', teamId: 'team_1', tricksWon: 12 }, 
  //     { id: 'socket_2', index: 1, username: 'Bob',   teamId: 'team_2', tricksWon: 12 }, 
  //     { id: 'socket_3', index: 2, username: 'Char',  teamId: 'team_1', tricksWon: 13 }, 
  //     { id: 'socket_4', index: 3, username: 'David', teamId: 'team_2', tricksWon: 13 }  
  //   ],

  //   // --- 4. LOCAL PLAYER INFO ---
  //   // Assuming the local player is Alice (id: 'socket_1', teamId: 'team_1')
  //   hand: [
  //     { suit: 'hearts', rank: 'A' },
  //     { suit: 'hearts', rank: 'K' },
  //     { suit: 'spades', rank: '9' },
  //     { suit: 'diamonds', rank: '4' },
  //     { suit: 'clubs', rank: 'J' },
  //     { suit: 'clubs', rank: '7' },
  //     { suit: 'clubs', rank: '2' },
  //     { suit: 'hearts', rank: 'A' },
  //     { suit: 'hearts', rank: 'K' },
  //     { suit: 'spades', rank: '9' },
  //     { suit: 'diamonds', rank: '4' },
  //     { suit: 'clubs', rank: 'J' },
  //     { suit: 'clubs', rank: '7' },
  //   ],

  //   // --- 5. BIDDING HISTORY ---
  //   biddingData: {
  //     history: [
  //       { bidderIndex: 0, bid: '7H' },
  //       { bidderIndex: 1, bid: 'Pass' },
  //       { bidderIndex: 2, bid: '8H' },
  //       { bidderIndex: 3, bid: 'Pass' },
  //       { bidderIndex: 0, bid: 'Pass' }
  //     ]
  //   },

  //   // --- 6. ACTIVE CONTRACT ---
  //   contract: {
  //     suit: 'Hearts',
  //     tricks: 8,
  //     declarerIndex: 2, 
  //     teamId: 'team_2' // Points to which team owns the bid
  //   },

  //   // --- 7. ACTIVE TABLE (The current trick) ---
  //   playingData: {
  //     ledSuit: 'hearts', 
  //     cardsOnTable: [
  //       { playerIndex: 0, suit: 'spades', rank: 'Q' }, 
  //       { playerIndex: 1, suit: 'spades', rank: '2' },
  //       { playerIndex: 2, suit: 'spades', rank: '8' },
  //       { playerIndex: 3, suit: 'spades', rank: 'A' }  
  //     ]
  //   },

  //   // --- 8. SCORING ---
  //   currentHandTricks: {
  //     team_1: 2,
  //     team_2: 1
  //   },

  //   matchScore: {
  //     team_1: 1,
  //     team_2: 0
  //   }
  // };

  // // 1. We create a fake function to act as our walkie-talkie
  // const handleTestPlay = (card) => {
  //   console.log("BOOM! You played:", card);
  // };

  // const mockPlayers = [
  //   {
  //     id:'user-1',
  //     username: 'CardShark99',
  //     isReady: 'true'
  //   },
  //   {
  //   id: 'user-2',
  //   username: 'BridgeMaster',
  //   isReady: true,
  // },
  // {
  //   id: 'user-3',
  //   username: 'TrickTaker',
  //   isReady: false,
  // },
  // {
  //   id: 'user-4',
  //   username: 'DummyHand',
  //   isReady: true,
  // }
  // ]

  // const mockReady = (localUser) => { cdccsac
  //   console.log(`${username} is ready`)
  // }

  // const mockLocalUser = {
  //   id: 'user-1',
  //   username: 'DummyHand',
  // }

  return (
    //<BridgeGameBoard gameState={mockGameState} localUser={localUser}></BridgeGameBoard>
    //<Lobby localUser={mockLocalUser} toggleReady={mockReady} roundsInMatch={5} roomCode={mockGameState?.roomCode ?? "DFLT"} players={mockPlayers} />
    //<LoadingScreen></LoadingScreen>
    //<LandingPage></LandingPage>
    //<HomePage></HomePage>
    <AuthProvider>
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
      </Router>
    </AuthProvider>
  );
}

export default App