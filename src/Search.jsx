import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { Link,useNavigate } from 'react-router-dom';
import './Search.css';
const exercises = new Array(9).fill({
  nombre: "Nombre ejercicio",
  entrenador: "Nombre entrenador",
  imagen: "./public/assets/img/abdominoplastia.png",
  recomendaciones: "Repeticiones u observaciones del entrenador",
  descripcion: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    "Ut vel diam non enim rutrum pretium. Pellentesque nibh..."
  ],
});

const Busqueda = () => {
  const [bookmarks, setBookmarks] = useState(Array(exercises.length).fill(false));
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const toggleBookmark = (index) => {
    const updated = [...bookmarks];
    updated[index] = !updated[index];
    setBookmarks(updated);
  };
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
  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="./public/assets/img/logoFinal.png" alt="FitTrack" height="40" />
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
                    <Link className="nav-link" to="/profile">Perfil</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/search">Búsqueda</Link>
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

      <div className="container mt-4">
        <div className="search-bar d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" className="form-control" placeholder="Búsqueda" />
        </div>

        <div className="my-3">
          {["Hombro", "Brazo", "Espalda", "Torso", "Pierna"].map((zona) => (
            <button key={zona} className="filter-btn">{zona}</button>
          ))}
        </div>

        <div className="row">
          {exercises.map((ex, i) => (
            <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div
                className="flip-card"
                onClick={(e) => e.currentTarget.classList.toggle("flipped")}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-content text-center p-3">
                      <p className="mb-0">
                        <strong>{ex.nombre}</strong><br />
                        <small>{ex.entrenador}</small>
                      </p>
                      <img src={ex.imagen} className="exercise-img my-2" alt="ejercicio" />
                      <FontAwesomeIcon
                        icon={bookmarks[i] ? solidBookmark : regularBookmark}
                        className={`bookmark ${bookmarks[i] ? "text-warning" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(i);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flip-card-back p-3">
                    <div className="row">
                      <div className="col-12 text-center">
                        <p><strong>Recomendaciones:</strong><br />{ex.recomendaciones}</p>
                      </div>
                      <div className="col-12">
                        <h6><strong>Descripción detallada:</strong></h6>
                        {ex.descripcion.map((linea, idx) => (
                          <p key={idx}>- {linea}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Busqueda;
