# DeskFlow — Support Ticket Triage Board

A full-stack MERN application for managing support tickets with status transitions, SLA tracking, and an interactive board UI with drag-and-drop.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas)

## Features

- **Board View**: Kanban-style board with 4 columns (Open, In Progress, Resolved, Closed)
- **Drag & Drop**: Move tickets between columns with transition validation
- **SLA Tracking**: Priority-based response time targets with breach indicators
- **Filters**: Filter by priority and SLA breach status (combinable)
- **Stats**: Real-time aggregate counts per status and breached tickets
- **Validation**: Enforced status transition rules and input validation

## SLA Response Time Targets

| Priority | Target |
|----------|--------|
| Urgent   | 1 hour |
| High     | 4 hours |
| Medium   | 24 hours |
| Low      | 72 hours |

## Status Transition Rules

- Forward (one step): `open → in_progress → resolved → closed`
- Backward (one step): allowed (e.g., `resolved → in_progress`)
- Skipping steps is not allowed

## Setup

### Backend

```bash
cd backend
npm install
# Create .env with MONGO_URI, PORT, CORS_ORIGIN
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Optionally set VITE_API_URL in .env
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tickets | Create a ticket |
| GET | /tickets | List tickets (supports ?status, ?priority, ?breached filters) |
| PATCH | /tickets/:id | Update ticket (status transitions enforced) |
| DELETE | /tickets/:id | Delete a ticket |
| GET | /tickets/stats | Aggregate counts per status, priority, and SLA breached |

## Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas (Free Tier)
