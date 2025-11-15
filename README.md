# 🎬 Studio Ghibli Film Catalog

A full-stack MERN (MongoDB, Express, React, Node.js) application that provides a complete, interactive catalog of Studio Ghibli films. This project features user authentication with JWT, a protected 'likes' system, and a dynamic 'comments' section, all built on a professional, scalable MVC (Model-View-Controller) backend architecture.

Features

Full MERN Stack: Built from the ground up with React, Express, Node.js, and MongoDB.

Professional MVC Architecture: Backend logic is cleanly separated into Models, Views, and Controllers for scalability and maintainability.

Full User Authentication: Secure user registration and login using bcrypt for password hashing and jsonwebtoken (JWT) for session management.

Protected Routes: Backend middleware verifies JWTs to protect routes (like "liking" a film), distinguishing between logged-in users and guests.

Role-Based Interaction:

Guests can browse films and post comments as "Anonymous".

Logged-in Users can post comments under their own username and are the only users who can "like" films.

Dynamic Likes & Comments: All user-generated content (likes, comments, users) is persisted in a MongoDB database.

Efficient Backend API: All searching, sorting, and filtering logic is handled server-side to minimize client-side load.

Offline-Ready: Built to run 100% offline, using a local ghibli-data.json file for film data and a local MongoDB instance.

Polished UI: Fully responsive design with a switchable Light/Dark mode theme.

# Tech Stack

Frontend:

React (Hooks, Context API)

React Router

jwt-decode

Backend:

Node.js

Express

MongoDB (with Mongoose)

bcryptjs (Password Hashing)

jsonwebtoken (Auth Tokens)

dotenv

# Project Structure

This project uses a clean, professional file structure to separate concerns.

ghibli-catalog/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   ├── filmController.js
│   │   └── likeController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── comment.js
│   │   ├── like.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── films.js
│   │   └── likes.js
│   ├── ghibli-data.json
│   ├── .env              (You must create this)
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js
    │   ├── assets/
    │   │   └── banner.jpg
    │   ├── components/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── FilmDetails.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── .env.development (You must create this)
    │   └── App.jsx
    └── package.json


# How to Run Locally

1. Prerequisites

Node.js installed

MongoDB Community Server installed and running locally.

2. Clone the Repository

git clone [https://github.com/your-username/ghibli-catalog.git](https://github.com/your-username/ghibli-catalog.git)
cd ghibli-catalog


3. Backend Setup

Navigate to the backend: cd backend

Install dependencies: npm install

Create a .env file in the backend folder and add the following:

# Your local MongoDB connection string
MONGO_URI=mongodb://localhost:27017/ghibli-catalog

# Your secret for signing JWTs (can be any random string)
JWT_SECRET=this_is_a_very_secret_key


Start the backend server: npm start
(It should connect to your local MongoDB and log: Backend running on http://localhost:5000)

4. Frontend Setup

Open a new terminal.

Navigate to the frontend: cd frontend

Install dependencies: npm install

Create a .env.development file in the frontend folder and add the following:

# The URL of your local backend server
REACT_APP_API_URL=http://localhost:5000


Start the frontend app: npm start

# The app will open automatically at http://localhost:3000. You can now register a new user and test all features.

API Endpoints

Auth API (/api/auth)

Method

Endpoint

Description

Access

POST

/register

Register a new user.

Public

POST

/login

Log in a user and get a JWT.

Public

Film API (/api/films)

Method

Endpoint

Description

Access

GET

/

Get all films (with search/sort/filter).

Public

GET

/:id

Get a single film by its ID.

Public

GET

/directors

Get a unique list of all directors.

Public

GET

/years

Get a unique list of all release years.

Public

Like API (/api/likes)

Method

Endpoint

Description

Access

GET

/:filmId

Get the like count for a film.

Public

POST

/:filmId/like

Add a like to a film.

Protected

Comment API (/api/comments)

Method

Endpoint

Description

Access

GET

/:filmId

Get all comments for a film.

Public

POST

/:filmId

Post a new comment.

Public (Logic changes for users)
