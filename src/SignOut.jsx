import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignOut = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch('https://fittrackapi-fmwr.onrender.com/api/users/signOut', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` },
          
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Credenciales inválidas');

        // Si todo bien, limpia localStorage y redirige
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
        localStorage.removeItem('id');
        localStorage.removeItem('rol');

        navigate('/SignIn');
      } catch (err) {
        setError(err.message);
      }
    };

    signOut();
  }, [navigate]);

  return (
    <div>
      {error && <p className="text-danger">{error}</p>}
      <p>Desconectando...</p>
    </div>
  );
};

export default SignOut;
