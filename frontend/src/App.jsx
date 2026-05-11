 import { Navigate, Route, Routes } from 'react-router-dom';
 import { useState, useEffect } from 'react';
 import { RefreshHandler } from './RefreshHandler';
import './App.css';
 import { Home } from "./pages/Home";
 import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Notes } from "./pages/Notes";
import { CreateNote } from "./pages/CreateNote";
import { EditNote } from "./pages/EditNote";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="App">
      <button className="darkModeToggle" onClick={toggleDarkMode} title="Toggle Dark Mode">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute element={<Home />} />} />  
        <Route path='/notes' element={<PrivateRoute element={<Notes />} />} />
        <Route path='/create-note' element={<PrivateRoute element={<CreateNote />} />} />
        <Route path='/edit-note/:id' element={<PrivateRoute element={<EditNote />} />} />
      </Routes>
    </div>
  )
}

export default App
