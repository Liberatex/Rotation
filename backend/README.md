# ROTATION Backend API

Backend API server for the ROTATION mobile application.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **WebSocket**: Socket.io
- **Authentication**: JWT + Firebase Auth

## Setup

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with your database credentials and API keys.

4. Run database migrations:
```bash
npm run migrate:up
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Sessions
- `POST /api/v1/sessions` - Create session
- `GET /api/v1/sessions/:id` - Get session details
- `PUT /api/v1/sessions/:id` - Update session (MBA only)
- `DELETE /api/v1/sessions/:id` - Delete session (MBA only)
- `POST /api/v1/sessions/:id/join` - Join session
- `POST /api/v1/sessions/:id/leave` - Leave session
- `GET /api/v1/sessions/:id/participants` - Get participants

### Rotations
- `POST /api/v1/rotations` - Create rotation
- `GET /api/v1/rotations/:id` - Get rotation details
- `PUT /api/v1/rotations/:id` - Update rotation (MBA only)
- `POST /api/v1/rotations/:id/start` - Start rotation (MBA only)
- `POST /api/v1/rotations/:id/pause` - Pause rotation (MBA only)
- `POST /api/v1/rotations/:id/resume` - Resume rotation (MBA only)
- `POST /api/v1/rotations/:id/end` - End rotation (MBA only)
- `POST /api/v1/rotations/:id/pass` - Pass turn to next person
- `GET /api/v1/rotations/:id/turns` - Get turn history
- `GET /api/v1/rotations/:id/history` - Get rotation history

## WebSocket Events

### Client → Server
- `join_session` - Join a session room
- `leave_session` - Leave a session room
- `rotation_started` - Notify rotation started
- `turn_changed` - Notify turn changed
- `timer_alert` - Notify timer alert

### Server → Client
- `joined_session` - Confirmation of joining session
- `participant_joined` - New participant joined
- `participant_left` - Participant left
- `rotation_started` - Rotation started
- `turn_changed` - Turn changed
- `timer_alert` - Timer alert

## Database Schema

See `migrations/001_initial_schema.sql` for the complete database schema.

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## License

Proprietary - All rights reserved

