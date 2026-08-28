# Bridge: Sudden Death

> A real-time, four-player multiplayer card game that puts a fast, sudden-death twist on Bridge.

[Play Bridge: Sudden Death](https://bridge.adeelhussain.com)

<!-- Add a short gameplay video or GIF here once recorded. -->

## Overview

Bridge: Sudden Death is a full-stack web application for live 2v2 card matches. Players sign in, create or join a room with a code, ready up, bid on a contract, and play through a synchronized match in the browser. The server is authoritative: it validates every move, determines trick winners, and sends each player only the game state they are allowed to see.

## Highlights

- Real-time four-player rooms with Socket.IO synchronization, reconnection support, ready checks, and host-controlled match length.
- Server-authoritative game engine that validates turn order, card ownership, bidding rules, following suit, and the trump-break rule.
- Three-stage deal and two-stage auction that build from five to thirteen cards per player.
- Sudden-death round resolution: the declarer's team wins when it makes its contract; defenders win as soon as the contract becomes impossible.
- Live game log, trick table, turn indicators, bidding controls, responsive game board, and end-of-round/match summaries.
- Supabase authentication, public player profiles, persistent match history, and lifetime match, round, and trick statistics.
- Tests for core deck, shuffle, trick-winner, bidding-order, dealing, and card-play validation logic.

## Tech stack

| Area | Technology |
| --- | --- |
| Client | React, Vite, Tailwind CSS, React Router |
| Real-time server | Node.js, Express, Socket.IO |
| Authentication and data | Supabase Auth, PostgreSQL, Row Level Security |
| Deployment | Vercel (client), Render (server), Supabase (database/auth) |
| Testing | Vitest |

## How a match works

1. Four players form two opposing partnerships.
2. Each player receives five cards and bids a target number of tricks with a trump suit.
3. Four more cards are dealt, followed by a second bidding phase.
4. The highest bid sets the contract and declarer; a final four cards complete each 13-card hand.
5. Players must follow the led suit when able. When void in that suit, they can trump or discard.
6. The round ends as soon as the contract is made or cannot be made. The first partnership to the chosen number of round wins takes the match.

## Architecture

```text
React client
  ├─ Supabase Auth ──────────────┐
  └─ Socket.IO client ───────────┼─> Express + Socket.IO server
                                 │      ├─ socket handlers
                                 │      ├─ room service
                                 │      └─ pure game engine
Supabase PostgreSQL <────────────┘
  ├─ profiles and aggregate player statistics
  ├─ matches
  └─ match_players
```

The socket handlers route events to services. `roomService` owns active room/lobby state, while `gameService` applies game rules using the pure functions in `server/src/game/engine.js`. Before broadcasting, the server removes every other player's hand so clients cannot inspect hidden cards.

## Local development

### Prerequisites

- Node.js 22 or newer
- A Supabase project configured with Auth and the `profiles`, `matches`, and `match_players` tables
- A Supabase `increment_profile_stats` RPC function for atomically updating player aggregates

### 1. Clone and install

```bash
git clone https://github.com/hussain-adeel/bridge.git
cd bridge

cd server
npm install

cd ../client
npm install
```

### 2. Configure the backend

Create `server/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
PORT=3001
```

The service role key is server-only. Never put it in the client or commit it to Git.

Start the server:

```bash
cd server
npm run dev
```

### 3. Configure the client

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SERVER_URL=http://localhost:3001
```

Start the client:

```bash
cd client
npm run dev
```

Open the local Vite URL, usually `http://localhost:5173`.

## Testing

Run the server test suite:

```bash
cd server
npm test
```

The current suite covers core game-engine behavior and game-service validation, including 52-card deck integrity, shuffle preservation, trick winner selection, staged dealing, invalid plays, follow-suit enforcement, and trump rules.

## Production deployment

The production client is available at [bridge.adeelhussain.com](https://bridge.adeelhussain.com).

- **Vercel** builds and hosts `client`. Its production environment needs `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and the public Render server URL in `VITE_SERVER_URL`.
- **Render** runs `server` with `npm start`. It needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `FRONTEND_URL` set to the exact production client origin, such as `https://bridge.adeelhussain.com` (no trailing slash).
- **Supabase** provides OAuth/email authentication and PostgreSQL persistence. Client-facing Supabase keys are publishable by design; database access remains protected with Row Level Security. The service-role key stays on Render only.

## Project structure

```text
bridge/
├─ client/
│  └─ src/
│     ├─ components/       # Lobby, game board, profiles, and UI
│     ├─ context/          # Authentication state
│     ├─ hooks/            # Room/game actions and data hooks
│     └─ utils/            # Supabase and Socket.IO clients
├─ server/
│  └─ src/
│     ├─ game/             # Pure game engine and in-memory state store
│     ├─ services/         # Room, game, and statistics workflows
│     ├─ socket/           # Socket event handlers and broadcasts
│     └─ utils/            # Supabase and room validation helpers
└─ shared/
   └─ gameConstants.js     # Shared events, phases, cards, and rules
```

## Demo

A short end-to-end gameplay video will be added here soon. It will cover authentication, room creation, joining from a second browser, bidding, trick play, match completion, and persisted profile statistics.

## Author

Built by [Adeel Hussain](https://github.com/hussain-adeel).
