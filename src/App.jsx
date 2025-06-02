import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Index />} />
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