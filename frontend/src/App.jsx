 import { Navigate, Route, Routes } from 'react-router-dom';
 import { useState } from 'react';
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

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }

  return (
    <div className="App">
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
