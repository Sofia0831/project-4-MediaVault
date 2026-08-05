# 🎬 MediaVault

MediaVault is a full-stack web application that allows users to organize and track their favorite media in one place. Instead of using multiple websites for movies, and books, MediaVault provides a single platform where users can search, save, rate, review, and manage their personal media library.

---

## Features

- 🔐 Secure user authentication (Register, Login, Logout)
- 👤 Personalized user profiles
- 🎥 Movie search using TMDB API
- 📚 Book search using Google Books API
- ⭐ Rate and review saved media
- 📌 Track media status (Plan to Watch/Read, Currently Watching/Reading, Completed)
- 📂 Personal media library (Shelf)
- 🔍 Search
- 📱 Responsive user interface

---

## Technologies Used

### Frontend

- React
- Vite
- React Router
- CSS / Tailwind CSS

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Cookie Parser

### Database

- PostgreSQL

### External APIs

- TMDB API
- Google Books API

---

## Project Structure

```
MediaVault
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── src
│   │   ├── db
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── package.json
│
└── README.md
```

---

## Installation

## Backend Setup

Navigate to the server folder.

```bash
cd server
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=5050

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Start the backend.

```bash
npm run dev
```

---

## Frontend Setup

Open another terminal.

```bash
cd client
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

Start the frontend.

```bash
npm run dev
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/protected
```

### Media Library

```
GET    /api/media
POST   /api/media
PUT    /api/media/:id
DELETE /api/media/:id
```

### Movies

```
GET /api/movies/search
GET /api/movies/:id
```

### Books

```
GET /api/books/search
GET /api/books/:id
```


## Team Members

- **Sofia Florylle S. Pantas** – Frontend Lead
- **Faith Oluwatise Idowu** – Backend Lead
- **Faharetana Andriatsiva Rakotomamonjy** – Database Lead
- **Daniel Ezra Rivera** – Frontend Integration & UI

---

## Future Improvements

- Recommendation system
- User favorites
- Advanced filtering
- Watchlist statistics
- Dark mode
- Social sharing

---

# project-4-MediaVault
This is the repo for MediaVault, a personal collection website. Senior Project for CSE499. Project 4

Faith Oluwatise Idowu: "Never Give up, never give in, we gotta fight for what we believe in" - (Beyblde Burst Evolution)

Sofia Florylle Pantas: "Even if the ending has been predetermined, that's fine. There are countless things that humans cannot change. But before that, on the road towards the end, there are still many things that we can do. And because of this, the "end" will thus reveal a completely different meaning. This is the meaning of "journey." - Raiden Bosenmori Mei (Honkai Star Rail)


Daniel Ezra Rivera “If you only do what you can do, you will never be more than you are now.” -Master Shifu - (Kung Fu Panda)

Rakotomamonjy Faharetana Andriatsiva "What is impossible with man is possible with God" - Luke 18:27