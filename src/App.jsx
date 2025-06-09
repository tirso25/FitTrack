import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate,useLocation  } from 'react-router-dom';
import SignIn from './SignIn';
import Register from './Register';
import Profile from './Profile';
import SignOut from './SignOut';
import Admin from './Admin';
import Search from './Search';
import EmailCheck from './EmailCheck';
import Index from '.';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const location = useLocation();

  const SESSION_TIMEOUT = 10 * 60 *  1000; // 10 minutos

  const logoutByInactivity = () => {
    alert("Sesión cerrada por inactividad.");
    navigate("/signOut");
  };

  const resetInactivityTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logoutByInactivity, SESSION_TIMEOUT);
  };


  useEffect(() => {
    if (!token) return;

    fetch('https://fittrackapi-fmwr.onrender.com/api/users/tokenExisting', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async response => {
        const data = await response.json();

        if (response.status === 200) {
          console.log('Usuario autenticado por token');
          setUser(data.userData);
        } else if (response.status === 204) {
          console.log('No hay token de sesión persistente.');
        } else if (response.status === 400) {          
          console.log("No has elegido mantener la sesión iniciada");
        } else {
          const data = await response.json();
          console.warn('Token inválido:', data.message);
        }
      })
      .catch(err => {
        console.error('Error al verificar el token:', err);
      });
  }, [token]);

useEffect(() => {
  if (!user || location.pathname === '/signin') return;

  const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
  events.forEach(event => window.addEventListener(event, resetInactivityTimer));

  resetInactivityTimer();

  return () => {
    events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, [user, location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Index user={user} />} />
        <Route path="/EmailCheck" element={<EmailCheck />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
