# StayEase Backend

REST API for the StayEase Smart Tiffin & Grocery Management System.

## Tech Stack

- Node.js + Express.js
- MongoDB (via Mongoose)
- JWT Authentication

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A MongoDB database (free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) works)

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Himanshubarman7070/Stay-Ease-backend.git
cd Stay-Ease-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

| Variable | Description |
|---|---|
| `PORT` | Port to run the server (default: `5000`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any long random string for signing tokens |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |

### 4. Create the admin account

```bash
npm run create-admin
```

### 5. Start the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000/api`.

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
