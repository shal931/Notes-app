# Auth-app 📝

A full-stack Notes Workspace application built using the MERN stack. This project provides secure user authentication and a modern workspace where users can create, manage, organize, and search notes efficiently.

The application includes JWT authentication, protected routes, note filtering, favorites, tags, responsive UI, and full CRUD functionality.

---

# 🚀 Features

## 🔐 Authentication System
- User Signup
- User Login
- JWT-based Authentication
- Protected Routes
- Secure API Access using Middleware

## 📝 Notes Workspace
- Create Notes
- Edit Existing Notes
- Delete Notes
- Favorite Important Notes ⭐
- Add Tags to Notes
- Search Notes
- Filter & Sort Notes
- Responsive Notes Layout

## 🎨 User Interface
- Clean and modern design
- Responsive across devices
- Quick actions for note management
- SPA (Single Page Application)

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- CSS Modules

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## Authentication
- JWT (JSON Web Tokens)

---

# 📂 Project Structure

```bash
Auth-app/
│
├── backend/
│   ├── Controllers/
│   ├── Routes/
│   ├── Models/
│   ├── Middlewares/
│   ├── index.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── main.jsx
│   │   └── index.css
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notesDB
JWT_SECRET=mysecretkey
```

---

# 📦 Installation

## 1️⃣ Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

---

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

# ▶️ Running the Application

## Start Backend Server

```bash
cd backend
npm start
```

Backend will run on:

```bash
http://localhost:5000
```

---

## Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔗 API Endpoints

## Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login user |

---

## Notes Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes/all` | Fetch all notes |
| POST | `/notes` | Create a note |
| PUT | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Delete a note |

---

# 📝 Notes Model

Each note contains:

```js
{
  title: String,
  description: String,
  tags: [String],
  color: String,
  isFavorite: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

# 🔒 Authentication Flow

1. User signs up or logs in
2. Backend validates credentials
3. JWT token is generated
4. Token is stored on client side
5. Protected routes verify token using middleware
6. Users can only access their own notes

---

# 🎯 Frontend Pages

| Page | Description |
|------|-------------|
| Login | User login page |
| Signup | User registration page |
| Notes | Main notes dashboard |
| CreateNote | Create a new note |
| EditNote | Update an existing note |

---

# 🧩 Common Issues & Fixes

## MongoDB Connection Error
- Make sure MongoDB is installed
- Ensure MongoDB server is running
- Verify `MONGO_URI` in `.env`

---

## JWT Authentication Error
- Check if `JWT_SECRET` is properly configured
- Ensure token is sent correctly in headers

---

## UI Clipping / Layout Problems
- Check `frontend/src/index.css`
- Avoid globally centering the `body`

---

# 🏗️ Build Frontend for Production

```bash
npm run build
```

---

# 🌟 Future Improvements

- Dark Mode 🌙
- Rich Text Editor
- Drag & Drop Notes
- Cloud File Uploads
- Archive & Trash
- Note Sharing
- Markdown Support
- Real-time Sync

---

# 👨‍💻 Author

Developed as a MERN Stack learning project focused on authentication, REST APIs, MongoDB integration, and modern frontend development.
 

 
