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
  if(rememberme){
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

    try {
      const response = await fetch('https://fittrackapi-fmwr.onrender.com/api/users/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password , rememberme}),
      });
     

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email' ,data.userData.this_user_email);
        localStorage.setItem('username' ,data.userData.this_user_username);
        localStorage.setItem('id' ,data.userData.this_user_id);
        localStorage.setItem('rol', data.userData.this_user_role);
        navigate('/');
      } else {
        throw new Error('Token no recibido');
      }
    } catch (err) {
      setError(err.message);
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
                type="email"
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
