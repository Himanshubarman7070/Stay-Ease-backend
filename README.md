# StayEase Backend

REST API for the StayEase Smart Tiffin & Grocery Management System.

## Tech Stack

- Node.js + Express.js
- MongoDB (via Mongoose)
- JWT Authentication

## Quick Start (Local)

```bash
git clone https://github.com/Himanshubarman7070/Stay-Ease-backend.git
cd Stay-Ease-backend
npm install
npm run dev
```

The API will be available at `http://localhost:5000/api`.

> A working `.env` is included in the repo for local development.  
> **Do not use these credentials in production** — replace them with your own.

## Create Admin Account

```bash
npm run create-admin
```

## Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `PORT` | Port to run the server (default: `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with auto-reload (development) |
| `npm start` | Start server (production) |
| `npm run create-admin` | Create the admin account |

## API Overview

| Prefix | Description |
|---|---|
| `/api/auth` | Register, login, profile |
| `/api/tiffin` | Tiffin plan requests |
| `/api/food` | Today's food menu |
| `/api/meals` | Meal delivery & cancellation |
| `/api/payments` | Tiffin payment submission |
| `/api/grocery` | Grocery products & orders |
| `/api/complaints` | Customer complaints |
| `/api/admin` | Admin management endpoints |
