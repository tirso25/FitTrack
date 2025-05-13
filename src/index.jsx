import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Index() {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para determinar si el usuario está logueado

  // Función para alternar la visibilidad de la descripción detallada
  const toggleDetalles = () => {
    setMostrarDetalles(prev => !prev);
  };

  // Función para manejar el inicio y cierre de sesión
  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="/img/logoFinal.png" alt="FitTrack" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Inicio</Link>
              </li>

              {/* Enlaces solo visibles si el usuario está logueado */}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/perfil">Perfil</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/busqueda">Búsqueda</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#" onClick={toggleLogin}>Salir</Link>
                  </li>
                </>
              )}

              {/* Enlaces solo visibles si el usuario no está logueado */}
              {!isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="#" onClick={toggleLogin}>Iniciar sesión</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="exercise-card p-3 border">
              <h3 className="text-center mb-4">Nuevos ejercicios</h3>

              {/* Botón de abrir/cerrar */}
              <div className="d-flex justify-content-end mb-2">
                <button onClick={toggleDetalles} className="btn btn-link p-0">
                  {mostrarDetalles ? 'Cerrar' : 'Abrir'}
                </button>
              </div>

              {/* Mostrar la pequeña descripción o la descripción detallada */}
              {!mostrarDetalles ? (
                <div className="exercise-summary">
                  <div className="d-flex align-items-center">
                    <img
                      src="/img/abdominoplastia.png"
                      alt="ejercicio"
                      className="exercise-img me-3"
                      style={{ width: '80px' }}
                    />
                    <div>
                      <strong>Nombre del ejercicio</strong> por <strong>Nombre entrenador</strong><br />
                      <small>Pequeña descripción del ejercicio.</small>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="exercise-summary">
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <img
                        src="/img/abdominoplastia.png"
                        alt="Ejercicio"
                        className="img-fluid mb-2"
                        style={{ maxHeight: '120px' }}
                      />
                      <p><strong>Recomendaciones:</strong><br />Repeticiones u observaciones del entrenador</p>
                    </div>
                    <div className="col-md-8">
                      <h5>Nombre del ejercicio</h5>
                      <h6 className="text-muted">Nombre entrenador</h6>
                      <p><strong>Descripción detallada:</strong></p>
                      <ul>
                        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</li>
                        <li>Ut vel diam non enim rutrum pretium. Pellentesque nibh...</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4 notification-col">
            <div className="notification-box">
              {[1, 2, 3].map((_, i) => (
                <div className="mb-3" key={i}>
                  <strong>Nombre entrenador</strong><br />
                  <small>Ha subido un nuevo ejercicio de (músculo)</small>
                  <i className="fa-regular fa-eye float-end"></i>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
