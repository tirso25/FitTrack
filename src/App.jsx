import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SignIn from './SignIn';
import Register from './Register';
import Profile from './Profile';
import Index from '.';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;