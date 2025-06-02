import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('https://fittrackapi-fmwr.onrender.com/api/users/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, repeatPassword })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar');
      }
      
      alert('Cuenta creada exitosamente');
      navigate('/EmailCheck', { state: { email } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg w-100">
        <div className="container-fluid justify-content-center">
          <img src="/assets/img/logoFinal.png" alt="Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="register-container w-100">
          <h3 className="text-center mb-4">Crea una cuenta</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Nombre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="repeatPassword"
                placeholder="Verifica contraseña"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn custom-btn w-100">Crear cuenta</button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/signin" style={{ color: '#294323' }}>
              ¿Ya tienes cuenta en FitTrack?<br />Ingresa aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

