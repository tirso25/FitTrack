import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function Index() {
  const [exercises, setExercises] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const email = localStorage.getItem('email');
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
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
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error('Error al obtener los ejercicios:', error);
      });
  }, []);


  const toggleDetalles = (index) => {
    setDetallesVisibles(prev => {
      const newVisibles = [...prev];
      newVisibles[index] = !newVisibles[index];
      return newVisibles;
    });
  };

  const toggleBookmark = async (index) => {
    const exercise = exercises[index];
    const isFavorited = bookmarks[index];
    const urlBase = 'https://fittrackapi-fmwr.onrender.com/api/favoriteExercises';

    try {
      const response = await fetch(
        `${urlBase}/${isFavorited ? 'undoFavorite' : 'addFavoriteExercise'}/${exercise.id_exe}`, 
        {
          method: isFavorited ? 'DELETE' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al actualizar favorito:', errorData.message || response.statusText);
        return;
      }

      setBookmarks(prev => {
        const newBookmarks = [...prev];
        newBookmarks[index] = !isFavorited;
        return newBookmarks;
      });

    } catch (error) {
      console.error('Error en la petición de favorito:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="/assets/img/logoFinal.png" alt="FitTrack" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Inicio</Link>
              </li>
              {email ? (
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
                    <Link className={`nav-link ${location.pathname === "/signout" ? "active" : ""}`} to="/signout">Salir</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/signIn">Iniciar Sesión</Link>
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
