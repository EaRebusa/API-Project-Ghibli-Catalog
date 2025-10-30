# 🎬 Studio Ghibli Film Catalog

- REBUSA, PACATANG, ESTABILLO

A full-stack web application built with React, Node.js, and Express that allows users to browse, search, and discuss their favorite Studio Ghibli films.

This project features a responsive React frontend and an Express backend that serves as a proxy to the Studio Ghibli API. It also includes a dedicated MongoDB database for user-generated content like likes and comments, (USERS WIP Guest Mode/With Accounts).


Preview

(Insert Samples ayaw kalimot)

✨ Features

Browse & Discover: View all Studio Ghibli films in a responsive, animated grid.

Server-Side Logic: Backend handles all searching, sorting, and filtering—the frontend just sends the query.

Smart Search: Filter by film title.

Dynamic Filtering: Filter by director and release year.

Advanced Sorting: Sort by release date (asc/desc) and Rotten Tomatoes score (asc/desc).

Film Details: Click on any film to see a dedicated page with a synopsis, original titles, and more.

Full-Stack "Likes": Like your favorite films. The count is stored in the database and is persistent for all users.

Full-Stack "Comments": Leave comments on any film. The comment section is live and shared by all users.

Reactive UI: Light & Dark theme toggle that respects user preferences.

(In Progress): User registration and login (Register, Login, Guest accounts).

🛠️ Tech Stack

Frontend:

React

React Router

CSS (with CSS Variables for theming)

JS(Add more animations/redesigning ui)

Backend:

Node.js

Express

Mongoose

MongoDB

dotenv (for environment variables)

bcryptjs (for password hashing)

jsonwebtoken (for auth tokens)

cors

Database:

MongoDB Atlas

Deployment (WIP - Still Learning):

Frontend deployed to Netlify

Backend deployed to Render

🚀 How to Run Locally

To get this project running on your local machine, follow these steps.

Prerequisites

Node.js (v18 or newer)

npm

A free MongoDB Atlas account

1. Clone the Repository

git clone [https://github.com/EaRebusa/API-Project-Ghibli-Catalog.git](https://github.com/EaRebusa/API-Project-Ghibli-Catalog.git)
cd API-Project-Ghibli-Catalog


2. Set Up the Backend

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


Create a .env file in the /backend folder.

Add your MongoDB connection string to the .env file. (Make sure to whitelist all IPs 0.0.0.0/0).

# /backend/.env
MONGO_URI=your_mongodb_connection_string_here


Start the backend server:

npm start


Your backend will be running at http://localhost:5000.

3. Set Up the Frontend

In a new terminal, navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Create a .env.development file in the /frontend folder.

Add the local backend URL:

# /frontend/.env.development
REACT_APP_API_URL=http://localhost:5000


Start the frontend app:

npm start


Your React app will open automatically at http://localhost:3000.
