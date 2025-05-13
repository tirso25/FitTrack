import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para manejar la redirección
import { Link } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const navigate = useNavigate();

  // Manejar el submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar las contraseñas
    if (password !== passwordVerify) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Aquí podrías agregar lógica para enviar los datos al backend
    alert("Cuenta creada exitosamente");

    // Redirigir al login o al home después del registro
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg w-100">
        <div className="container-fluid justify-content-center">
          <img src="img/logoFinal.png" alt="Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ paddingTop: '70px' }}>
        <div className="register-container w-100">
          <h3 className="text-center mb-4">Crea una cuenta</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
                id="passwordVerify"
                placeholder="Verifica contraseña"
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
                required
              />
            </div>
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
