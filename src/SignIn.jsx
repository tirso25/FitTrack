import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';
import { faTable } from '@fortawesome/free-solid-svg-icons';
function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  var [rememberme, setRememberme] = useState('');
  if (rememberme) {
    rememberme = true;
  } else {
    rememberme = false;
  }
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#f8f9fa';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{5,}$/;
    const usernameRegex = /^[a-z0-9]{5,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isEmail = email.includes('@');

    if (isEmail && !emailRegex.test(email)) {
      setError("Correo electrónico inválido.");
      return;
    }

    if (!isEmail && !usernameRegex.test(email)) {
      setError("Nombre de usuario inválido. Debe tener entre 5 y 20 caracteres, solo minúsculas y números.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 5 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.");
      return;
    }

    try {
      const response = await fetch('https://fittrackapi-fmwr.onrender.com/api/users/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberme }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.userData.this_user_email);
        localStorage.setItem('username', data.userData.this_user_username);
        localStorage.setItem('id', data.userData.this_user_id);
        localStorage.setItem('rol', data.userData.this_user_role);
        navigate('/');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || 'Error del servidor');
    }
  };

  return (
    <>
      <nav className="navbar sticky-top custom-navbar">
        <div className="container position-relative d-flex align-items-center justify-content-center">
          <div className="logo-centered">
            <a className="navbar-brand" href="/" aria-label="FitTrack Home">
              <img src="/assets/img/logoFinal.png" alt="FitTrack" />
            </a>
          </div>
          <div className="ms-auto">
            <Link className="btn custom-btn" to="/">
              Inicio
            </Link>
          </div>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-container w-100" style={{ maxWidth: '400px' }}>
          <h3 className="text-center mb-4">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Correo electrónico o nombre de usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn custom-btn w-100">
              Iniciar sesión
            </button>
            <div className="mb-3">
              <br />
              Mantener la sesión iniciada &nbsp;
              <input
                type="checkbox"
                onChange={(e) => setRememberme(e.target.value)}
              />
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="link-register">
              Regístrate en FitTrack
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
