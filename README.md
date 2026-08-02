# Bridge: Sudden Death 🃏

> A full-stack, real-time multiplayer web application featuring a fast-paced, sudden-death variant of the classic card game Bridge.

This project is a complete 4-player, 2v2 multiplayer experience built with a strictly decoupled architecture. It separates the real-time networking layer from the pure game state engine, ensuring a scalable, cheat-proof server environment. Player data, authentication, and lifetime statistics are handled securely via PostgreSQL row-level security.

---

## 🚀 Tech Stack

| Environment | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express, Socket.io |
| **Database & Auth** | Supabase, PostgreSQL |
| **State Management** | Custom Domain-Driven Engine (`RoomService` / `BridgeGame`) |

---

## ✨ Key Features

*   **Real-Time Sync:** Lightning-fast socket communication for room lobbies, bidding phases, and card playing.
*   **Secure State Management:** The server acts as the single source of truth. Clients are only broadcasted sanitized game states (their own hand and public board data) to prevent network-sniffing exploits.
*   **Persistent Profiles:** Integrated authentication and personalized dashboards displaying lifetime matches, win rates, and recent match histories.
*   **Custom Ruleset:** A modernized, aggressive take on Bridge featuring a 3-stage dealing process and sudden-death match resolution.

---

## 📖 Custom Game Rules

This application implements a highly modified, faster-paced version of standard Bridge. Four players are divided into two partnerships sitting across from one another. 

### Phase 1: The Deal & The Auction
*   **The First Deal:** Each player is dealt an initial 5 cards.
*   **The Opening Auction:** A random player opens. Bids must declare a trump suit and a target number of hands (minimum opening bid is **6 hands**). Play proceeds clockwise.
*   **The Second Deal:** Players receive 4 additional cards (9 total).
*   **The Second Auction:** Initiated by the player holding the highest bid from the first round.
*   **The Final Deal:** The highest bid becomes the official contract. The winner is the **Declarer**. The final 4 cards are dealt, completing the 13-card hands.

### Phase 2: The Play
*   **The Lead:** The Declarer plays the first card. The suit of this card becomes the "lead suit."
*   **Following Suit:** Players must play a card in the lead suit if they have one.
*   **Trumping & Discarding:** If void in the lead suit, a player may play a trump card to win, or discard any other suit to intentionally lose.
*   **Winning the Trick:** The highest trump card wins. If no trump is played, the highest card of the lead suit wins.

### Phase 3: Sudden-Death Resolution
*   **Declarer Victory:** The game ends immediately the moment the Declarer's team secures enough hands to meet their bid.
*   **Defender Victory:** The game ends immediately the moment the Defenders win enough hands to make the Declarer's bid mathematically impossible.

---

## 🏗️ Architecture Overview

The backend is built using a domain-driven approach to keep networking code separate from game logic:

*   **`server.js`:** Initializes Express and Socket.io.
*   **`socket/`:** Traffic controllers. Listens for client events and passes data to the game engine.
*   **`game/RoomService.js`:** The source of truth map. Manages all active lobbies, enforces the 4-player limit, and sanitizes states before broadcasting.
*   **`game/BridgeGame.js`:** The pure game engine. Handles the 52-card deck, phase transitions, valid move verification, and sudden-death triggers without any knowledge of the network layer.

---

## 🛠️ Local Installation

**1. Clone the repository**
```bash
git clone https://github.com/hussain-adeel/bridge
cd bridge
```

**2. Set up the Backend**
```bash
cd server
npm install
```
*Create a `.env` file in the backend directory with your Supabase credentials.*
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
```
*Start the server:*
```bash
npm run dev
```

**3. Set up the Frontend**
```bash
cd ../client
npm install
```
*Create a `.env` file in the frontend directory.*
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SERVER_URL=http://localhost:3001
```
*Start the Vite development server:*
```bash
npm run dev
```