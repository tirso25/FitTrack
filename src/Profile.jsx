import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [exercises, setExercises] = useState([
    {
      id: 1,
      bookmarked: false,
      expanded: false,
    },
    {
      id: 2,
      bookmarked: false,
      expanded: false,
    },
    {
      id: 3,
      bookmarked: false,
      expanded: false,
    },
  ]);
const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      alert("Has cerrado sesión. Se te redirigirá al inicio.")
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };
  const toggleBookmark = (id) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, bookmarked: !ex.bookmarked } : ex
      )
    );
  };

  const toggleDetails = (id) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, expanded: !ex.expanded } : ex
      )
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top bg-light">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="./public/assets/img/logoFinal.png" alt="FitTrack" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/profile">Perfil</Link>
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
                  <Link className="nav-link" to="#" onClick={toggleLogin}>Iniciar sesión</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 sidebar p-4 text-center text-success position-relative">
            <a href="#" className="position-absolute top-0 end-0 m-3 text-dark" title="Editar perfil">
              <i className="fa-solid fa-pen-to-square fa-sm"></i>
            </a>
            <img src="./public/assets/img//usuario.png" className="img-fluid rounded-circle my-3" style={{ maxWidth: "120px" }} alt="Usuario" />
            <p><strong>Nombre</strong></p>
            <p>Fecha</p>
            <p>correo@ejemplo.com</p>
            <p>Descripción</p>
          </div>

          <div className="col-md-9 offset-md-3 p-5">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card p-3 border mx-auto mb-4" style={{ maxWidth: "700px" }}>
                {!exercise.expanded ? (
                  <div className="exercise-summary">
                    <div className="d-flex justify-content-end gap-3">
                      <i
                        className={`fa-${exercise.bookmarked ? 'solid' : 'regular'} fa-bookmark bookmark-toggle ${exercise.bookmarked ? 'text-warning' : ''}`}
                        onClick={() => toggleBookmark(exercise.id)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                      <i
                        className="fa-solid fa-caret-down"
                        onClick={() => toggleDetails(exercise.id)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <div className="d-flex align-items-center">
                        <img src="./public/assets/img//abdominoplastia.png" alt="ejercicio" className="exercise-img me-3" />
                        <div>
                          <strong>Nombre del ejercicio</strong> por <strong>Nombre entrenador</strong><br />
                          <small>Pequeña descripción</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="exercise-summary">
                    <div className="d-flex justify-content-end gap-3 mb-3">
                      <i
                        className="fa-solid fa-caret-up"
                        onClick={() => toggleDetails(exercise.id)}
                        style={{ cursor: 'pointer' }}
                      ></i>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-4 text-center">
                        <img src="./public/assets/img//abdominoplastia.png" alt="Ejercicio" className="img-fluid mb-2" style={{ maxHeight: "120px" }} />
                        <p><strong>Recomendaciones:</strong><br />Repeticiones u observaciones del entrenador</p>
                      </div>
                      <div className="col-md-8">
                        <h5>Nombre del ejercicio</h5>
                        <h6 className="text-muted">Nombre entrenador</h6>
                        <p><strong>Descripción detallada:</strong></p>
                        <p>- Lossrem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                        <p>- Ut vel diam non enim rutrum pretium. Pellentesque nibh...</p>
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
}

export default Profile;
