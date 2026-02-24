# Eneba Store Assignment

A game store web application built with React (frontend) and Node.js + Express (backend), using SQLite as the database. Matches the Eneba store design with search functionality.

## Live Demo

- **Frontend:** https://striking-gratitude-production-6809.up.railway.app
- **Backend API:** https://eneba-store-assignment-production.up.railway.app

## Games included

- FIFA 23 (4 listings)
- Red Dead Redemption 2 (4 listings)
- Split Fiction (4 listings)

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)
- **Hosting:** Railway

## Running locally

### Prerequisites

- Node.js v20.19+ or v22+

### Backend

```bash
cd Backend
npm install
node index.js
```

Backend runs at `http://localhost:3000`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

> Note: When running locally, change `BACKEND_URL` in `Frontend/src/App.jsx` to `http://localhost:3000`

## API

| Endpoint | Description |
|----------|-------------|
| `GET /list` | Returns all games |
| `GET /list?search=fifa` | Fuzzy search by game name |

### Example response

```json
{
  "count": 4,
  "results": [
    {
      "id": 1,
      "title": "FIFA 23 EA App Key (PC) GLOBAL",
      "region": "GLOBAL",
      "platform": "EA App",
      "original_price": 59.99,
      "current_price": 14.50,
      "discount_percent": 76,
      "cashback": 1.45,
      "image_url": "...",
      "likes": 1240
    }
  ]
}
```
