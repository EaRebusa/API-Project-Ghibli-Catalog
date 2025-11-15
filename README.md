# 🎬 Ghibli Film Catalog

A beautifully designed, interactive web application for exploring the films of Studio Ghibli. Built with the MERN stack (MongoDB, Express, React, Node.js) and featuring a host of modern animations and UI effects to create a rich, engaging user experience.

---

## ✨ Features

This project is packed with modern, interactive features designed to create a delightful user experience.

#### Film Discovery & Browsing
- **Dynamic Search:** Real-time search with debouncing for efficient filtering.
- **Smart Filters:** Director and Year dropdowns are context-aware, updating their options based on your current selection.
- **Advanced Sorting:** Sort the film catalog by release year or Rotten Tomatoes score, in ascending or descending order.

#### Interactive UI & Animations
- **Full-Width Parallax Banner:** The home page features a stunning full-width banner with a multi-layered parallax scroll effect on both the background and text.
- **GSAP Text Animation:** The "Welcome" title on the home page uses a GSAP-powered shuffle animation for a high-quality entrance.
- **3D Tilting Cards:** Film posters on the details page and in modals have a 3D tilt effect on mouse hover, powered by Framer Motion.
- **WebGL Circular Navigation:** A beautiful, interactive circular gallery (powered by OGL) for navigating between films.
-**Animated Comment List:** The comment section features a gracefully animated list that animates items as they scroll into view.
- **Confetti Celebration:** Clicking the "Clap" button unleashes a celebratory shower of confetti.
- **Typing Effect:** The film synopsis is revealed with a dynamic typing animation.
- **Gradient Text & Hovers:** A theme-aware, animated gradient is used for the user welcome message and for link hover effects in the navigation and footer.

#### User & Engagement System
- **Secure Authentication:** Full user registration and login system using JWT (JSON Web Tokens) for secure sessions.
- **Claps & Comments:** Authenticated users can "clap" for their favorite films and post comments.
- **Optimistic UI Updates:** Posting comments and clapping provides instant feedback to the user, with the UI updating immediately while the backend request is processed.

#### Theming & Design
- **Light & Dark Mode:** A seamless, theme-aware design with a persistent theme toggle. All components, gradients, and icons adapt to the selected mode.
- **Responsive Layout:** The application is designed to be fully responsive and looks great on a variety of screen sizes.

---

## 🛠️ Tech Stack

### Frontend
- **React.js:** Core UI library.
- **React Router:** For client-side routing.
- **Animation Libraries:**
  - **GSAP (GreenSock Animation Platform):** For high-performance text animations.
  - **Framer Motion:** For 3D card tilting and list animations.
  - **OGL (Minimal WebGL Library):** For the circular film navigation gallery.
- **react-confetti:** For the celebratory clap animation.
- **Styling:** Plain CSS with CSS Variables for robust theming.

### Backend
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework.
- **MongoDB:** NoSQL database for storing film data, users, comments, and claps.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **JWT (JSON Web Token):** For secure user authentication.
- **dotenv:** For managing environment variables.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or later)
- npm
- MongoDB (local instance or a cloud service like MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/EaRebusa/API-Project-Ghibli-Catalog.git
   cd API-Project-Ghibli-Catalog
   ```

2. **Setup the Backend:**
   - Navigate to the `backend` directory: `cd backend`
   - Install NPM packages:
     ```sh
     npm install
     ```
   - Create a `.env` file in the `backend` directory and add your environment variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```
   - Seed the database with the initial film data. This script fetches data from the public Ghibli API and populates your local database.
     ```sh
     npm run seed
     ```
   - Start the backend server:
     ```sh
     npm run dev
     ```

3. **Setup the Frontend:**
   - Open a new terminal and navigate to the `frontend` directory: `cd frontend`
   - Install NPM packages:
     ```sh
     npm install
     ```
   - Start the React development server:
     ```sh
     npm start
     ```

The application should now be running on `http://localhost:3000`.

---

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgements
- Film data provided by the Studio Ghibli API.
- Various UI components and animations inspired by the open-source community.