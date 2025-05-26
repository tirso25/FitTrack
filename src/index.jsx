import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detallesVisibles, setDetallesVisibles] = useState([false, false]); 
  const [bookmarks, setBookmarks] = useState([false, false]); 

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };

  const toggleDetalles = (index) => {
    setDetallesVisibles(prev => {
      const newVisibles = [...prev];
      newVisibles[index] = !newVisibles[index];
      return newVisibles;
    });
  };

  const toggleBookmark = (index) => {
    setBookmarks(prev => {
      const newBookmarks = [...prev];
      newBookmarks[index] = !newBookmarks[index];
      return newBookmarks;
    });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="./public/assets/img/logoFinal.png" alt="FitTrack" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Inicio</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Perfil</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search">Búsqueda</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Administrador</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#" onClick={toggleLogin}>Salir</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="./SignIn" onClick={toggleLogin}>Iniciar sesión</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8">
            <h3 className="text-center mb-4">Nuevos ejercicios</h3>

            {[0, 1].map(index => (
              <div key={index} className="exercise-card p-3 border mb-3">
                <div className="d-flex justify-content-end gap-3">
                  <i
                    className={`fa-${bookmarks[index] ? 'solid' : 'regular'} fa-bookmark bookmark-toggle ${bookmarks[index] ? 'text-warning' : ''}`}
                    onClick={() => toggleBookmark(index)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                  <i
                    className={`fa-solid fa-caret-${detallesVisibles[index] ? 'up' : 'down'}`}
                    onClick={() => toggleDetalles(index)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                </div>

                {!detallesVisibles[index] ? (
                  <div className="exercise-summary mt-2">
                    <div className="d-flex align-items-center">
                      <img src="./public/assets/img/abdominoplastia.png" alt="ejercicio" className="exercise-img me-3" style={{ width: '80px' }} />
                      <div>
                        <strong>Nombre del ejercicio</strong> por <strong>Nombre entrenador</strong><br />
                        <small>Pequeña descripción</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="exercise-summary mt-2">
                    <div className="row mt-2">
                      <div className="col-md-4 text-center">
                        <img src="./public/assets/img/abdominoplastia.png" alt="Ejercicio" className="img-fluid mb-2" style={{ maxHeight: '120px' }} />
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
            ))}
          </div>
          {isLoggedIn ? (
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
          ) : (
            <div className="col-lg-4 notification-col">
            <div className="notification-box">
              <h4>No puedes ver los entrenadores que te gustan porque : <br/> <b>No has iniciado sesión.</b></h4>
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;