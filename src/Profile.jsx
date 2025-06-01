import React, { useState,useEffect } from 'react';
import './Profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
const Profile = () => {
  const [detallesVisibles, setDetallesVisibles] = useState([false, false]); 
  const [bookmarks, setBookmarks] = useState([false, false]); 
  const location = useLocation();
  const email = localStorage.getItem('email');
  const username = localStorage.getItem('username');


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
          <Link className="navbar-brand" to="/">
            <img src="/assets/img/logoFinal.png" alt="FitTrack" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Perfil</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/search" ? "active" : ""}`} to="/search">Búsqueda</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin">Administrador</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/signout" ? "active" : ""}`} to="/signout">Salir</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="sidebar">
            <a href="#" className="position-absolute top-0 end-0 m-3 text-dark" title="Editar perfil">
              <i className="fa-solid fa-pen-to-square fa-sm"></i>
            </a>
            <img src="/assets/img/usuario.png" className="img-fluid rounded-circle my-3" style={{ maxWidth: '120px' }} alt="Usuario" />
            <p><strong>{ username }</strong></p>
            <p>Fecha</p>
            <p>{ email }</p>
            <p>Descripción</p>
          </div>

          <div className="content-right">
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
                      <img src="/assets/img/abdominoplastia.png" alt="ejercicio" className="exercise-img me-3" style={{ width: '80px' }} />
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
                        <img src="/assets/img/abdominoplastia.png" alt="Ejercicio" className="img-fluid mb-2" style={{ maxHeight: '120px' }} />
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
        </div>
      </div>
    </>
  );
};

export default Profile;
