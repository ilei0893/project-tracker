# Project Tracker

🌐 <a href="https://projecttracker.ivanlei.com" target="_blank" rel="noopener noreferrer">Live site here!</a>

A full-stack Kanban-style task management app. Built primarily to strengthen React fundamentals, deepen understanding of how JWTs work end-to-end, and lay the groundwork for real-time peer-to-peer collaboration via WebSockets.

## Goals

- **React fundamentals** — practice component architecture, state management with Context API, hooks, and routing
- **JWT authentication** — implement the full auth flow: registration, login, token signing, storage, and protected routes
- **WebSockets (planned)** — add live collaboration so multiple users can see board updates in real time

## Tech Stack

| Layer    | Technology                                |
| -------- | ----------------------------------------- |
| Frontend | React 19 + TypeScript, Vite, React Router |
| Backend  | Ruby on Rails 8 (API-only)                |
| Database | PostgreSQL                                |
| Auth     | JWT + bcrypt                              |
| Testing  | Vitest + Testing Library (FE), RSpec (BE) |

## Features

- User registration and login with JWT authentication
- Kanban board with four columns: Backlog, Todo, In Progress, Completed
- CRUD operations for tasks
- Drag tasks between columns to update their state
- Tokens expire after 15 minutes

## Getting Started

### Prerequisites

- Ruby 3.4.x
- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
bundle install
bin/rails db:create db:migrate
bin/rails server
# API available at http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

Create a `frontend/.env.local` file if you need to override the API URL:

```
VITE_BASE_URL=http://localhost:3000
```

## API Endpoints

| Method | Path               | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/v1/register` | Register a new user     |
| POST   | `/api/v1/login`    | Login and receive a JWT |
| GET    | `/tasks`           | List all tasks          |
| POST   | `/tasks`           | Create a task           |
| PATCH  | `/tasks/:id`       | Update a task           |
| DELETE | `/tasks/:id`       | Delete a task           |

## Running Tests

```bash
# Backend
cd backend && bundle exec rspec

# Frontend
cd frontend && npm run test
```

## Roadmap

- [ ] WebSocket integration for real-time board sync
- [ ] Peer-to-peer live collaboration (multiple users editing simultaneously)
- [ ] Refresh token flow

## Learnings

### JWTs

- Session based auth is generally superior to JWTs on **web** because they are tried and true and are simpler.
- Frameworks usually have Session based auth out of the box whereas JWTs need to be implemented manually or through a library.
- JWTs are great for mobile apps or third party APIs
