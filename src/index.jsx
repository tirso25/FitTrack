import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [erroresApi, setErroresApi] = useState("");
  const email = localStorage.getItem('email');
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const navigate = useNavigate();

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  useEffect(() => {
    setErroresApi("");
    fetch('https://fittrackapi-fmwr.onrender.com/api/exercises/seeAllActiveExercises', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExercises(data);
          setDetallesVisibles(Array(data.length).fill(false));
          setBookmarks(Array(data.length).fill(false));
        } else {
          setErroresApi(data.message);
        }
      })
      .catch(error => {
        setErroresApi('Error al obtener los ejercicios:', error);
      });
  }, []);


  const toggleDetalles = (index) => {
    setDetallesVisibles(prev => {
      const newVisibles = [...prev];
      newVisibles[index] = !newVisibles[index];
      return newVisibles;
    });
  };

  const toggleBookmark = async (i) => {
    const exe = exercises[i];
    const addUrl = `https://fittrackapi-fmwr.onrender.com/api/favoriteExercises/addFavoriteExercise/${exe.id_exe}`;
    const removeUrl = `https://fittrackapi-fmwr.onrender.com/api/favoriteExercises/undoFavorite/${exe.id_exe}`;
    setErroresApi("");

    try {
      const method = bookmarks[i] ? 'DELETE' : 'POST';
      const url = bookmarks[i] ? removeUrl : addUrl;

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      // Si la petición fue exitosa, actualizamos el estado
      if (res.ok) {
        setBookmarks(prev => {
          const updated = [...prev];
          updated[i] = !updated[i];
          return updated;
        });
      } else {
        const data = await res.json();

        // Si el ejercicio ya estaba en favoritos, lo quitamos
        if (data.message?.includes('already added to favorite')) {
          const undoRes = await fetch(removeUrl, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          if (undoRes.ok) {
            setBookmarks(prev => {
              const updated = [...prev];
              updated[i] = false;
              return updated;
            });
          } else {
            setErroresApi('Error al eliminar favorito tras conflicto:', await undoRes.text());
          }
        } else {
          setErroresApi('Error al actualizar favoritos:', data);
        }
      }
    } catch (err) {
      setErroresApi('Error inesperado al actualizar favoritos:', err);
    }
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg sticky-top ${menuOpen ? 'expanded' : ''}`}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/assets/img/logoFinal.png" alt="FitTrack" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarMenu">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                  Inicio
                </Link>
              </li>

              {isLoggedIn ? (
                <>
                  {rol !== 'ROLE_ADMIN' && (
                    <li className="nav-item">
                      <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Perfil</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === "/search" ? "active" : ""}`} to="/search">
                      Búsqueda
                    </Link>
                  </li>
                  {rol === 'ROLE_ADMIN' && (
                    <li className="nav-item">
                      <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin">Administrador</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === "/signout" ? "active" : ""}`} to="/signout">
                      Salir
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/SignIn" onClick={toggleLogin}>
                    Iniciar sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>


      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8">
            {erroresApi && (
              <div className="alert alert-danger" role="alert">
                {erroresApi}
              </div>
            )}
            <h3 className="text-center mb-4">Nuevos ejercicios</h3>

            {exercises.map((exercise, index) => (
              <div key={exercise.id_exe} className="exercise-card p-3 border mb-3">
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
                        <strong>{exercise.name}</strong> por <strong>{exercise.creator}</strong><br />
                        <small>{exercise.description}</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="exercise-summary mt-2">
                    <div className="row mt-2">
                      <div className="col-md-4 text-center">
                        <img src="/assets/img/abdominoplastia.png" alt="Ejercicio" className="img-fluid mb-2" style={{ maxHeight: '120px' }} />
                        <p><strong>Recomendaciones:</strong><br />Ejemplo: series, repeticiones, tips</p>
                      </div>
                      <div className="col-md-8">
                        <h5>{exercise.name}</h5>
                        <h6 className="text-muted">{exercise.creator}</h6>
                        <p><strong>Descripción detallada:</strong></p>
                        <ul>
                          <li>{exercise.description}</li>
                          <li>Músculo: {exercise.category}</li>
                          <li>Likes: {exercise.likes}</li>
                          <li>Fecha: {new Date(exercise.created_at).toLocaleDateString()}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            ))}
          </div>
          {email ? (
            <div className="col-lg-4 notification-col">
              <div className="notification-box">
                {exercises.map((exercise, i) => (
                  <div className="mb-3" key={i}>
                    <strong>{exercise.creator}</strong><br />
                    <small>Ha subido un nuevo ejercicio de {exercise.category}</small>
                    <i
                      className="fa-regular fa-eye float-end"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/profile?id=${exercise.coach_id}`)}
                    ></i>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="col-lg-4 notification-col">
              <div className="notification-box">
                <h4>No puedes ver los entrenadores que te gustan porque: <br /> <b>No has iniciado sesión.</b></h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
