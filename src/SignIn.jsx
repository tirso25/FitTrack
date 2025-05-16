import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Correo:', email);
    console.log('Contraseña:', password);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg w-100">
        <div className="container-fluid justify-content-center">
          <img
            src="./public/assets/img/logoFinal.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: '150px' }}
          />
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ paddingTop: '70px' }}>
        <div className="login-container w-100">
          <h3 className="text-center mb-4">Iniciar Sesión</h3>
          <form id="loginForm" onSubmit={handleSubmit}>
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
            <button type="submit" className="btn custom-btn w-100">
              Iniciar sesión
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" style={{ color: '#294323' }}>
                Regístrate en FitTrack
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
