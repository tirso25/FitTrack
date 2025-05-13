import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SignIn from './SignIn';
import Register from './Register';
import Index from '.';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  );
}

export default App;