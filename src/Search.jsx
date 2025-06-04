import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import './Search.css';

const categoryMap = {
  hombro: "SHOULDER",
  brazo: "ARM",
  espalda: "BACK",
  torso: "TORSO",
  pierna: "LEG"
};

const Busqueda = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [coachs, setCoachs] = useState([]);
  const [activeTab, setActiveTab] = useState("ejercicios"); // Nueva pestaña activa
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
   const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (!["ROLE_ADMIN", "ROLE_USER", "ROLE_COACH"].includes(rol)) {
      alert("No estás registrado, si quieres buscar ejercicios, inicia sesión");
      navigate("/");
    }

    fetch('https://fittrackapi-fmwr.onrender.com/api/exercises/seeAllExercises', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExercises(data);
          setBookmarks(new Array(data.length).fill(false));
        } else {
          console.warn('Respuesta inesperada:', data);
          setExercises([]);
        }
      })
      .catch(error => {
        console.error('Error al obtener los ejercicios:', error);
        setExercises([]);
      });
  }, []);

  useEffect(() => {
    fetch('https://fittrackapi-fmwr.onrender.com/api/coachs/seeAllCoachs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCoachs(data);
        } else {
          console.warn(data.message);
        }
      })
      .catch(err => console.error('Error al obtener coachs:', err));
  }, []);

  const toggleBookmark = (index) => {
    const updated = [...bookmarks];
    updated[index] = !updated[index];
    setBookmarks(updated);
  };

  const goToProfile = (coachId) => {
    navigate(`/profile?id=${coachId}`);
  };

  useEffect(() => {
    const search = searchTerm.toLowerCase().trim();
    const matchedCategories = Object.entries(categoryMap)
      .filter(([es]) => es.includes(search))
      .map(([, en]) => en);

    const filtered = exercises.filter(exercise => {
      const nameLower = exercise.name.toLowerCase();
      const categoryLower = exercise.category.toLowerCase();
      const matchName = nameLower.includes(search);
      const matchCategory = matchedCategories.some(cat =>
        categoryLower.includes(cat.toLowerCase())
      );
      return matchName || matchCategory;
    });

    setFilteredExercises(filtered);
  }, [searchTerm, exercises]);

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

      {/* Pestañas para móvil */}
      <div className="container d-block d-lg-none mt-3">
        <div className="btn-group w-100">
          <button
            className={`btn btn-outline-primary ${activeTab === "ejercicios" ? "active" : ""}`}
            onClick={() => setActiveTab("ejercicios")}
          >
            Ejercicios
          </button>
          <button
            className={`btn btn-outline-primary ${activeTab === "coachs" ? "active" : ""}`}
            onClick={() => setActiveTab("coachs")}
          >
            Entrenadores
          </button>
        </div>
      </div>

      <div className="container mt-4 d-flex flex-column flex-lg-row gap-4">
        {(activeTab === "ejercicios" || window.innerWidth >= 992) && (
          <div className="flex-grow-1">
            <div className="search-bar d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o zona (hombro, brazo...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-3">
              {["Hombro", "Brazo", "Espalda", "Torso", "Pierna"].map((zona) => (
                <button
                  key={zona}
                  className="filter-btn me-2 mb-2"
                  onClick={() => setSearchTerm(zona.toLowerCase())}
                >
                  {zona}
                </button>
              ))}
            </div>

            <div className="row">
              {filteredExercises.map((ex, i) => (
                <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div
                    className="flip-card"
                    onClick={(e) => e.currentTarget.classList.toggle("flipped")}
                  >
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <div className="card-content text-center p-3">
                          <p className="mb-0">
                            <strong>{ex.name}</strong><br />
                            <small>{ex.creator}</small>
                          </p>
                          <img src="/assets/img/abdominoplastia.png" className="exercise-img my-2" alt="ejercicio" />
                          <FontAwesomeIcon
                            icon={bookmarks[i] ? solidBookmark : regularBookmark}
                            className={`bookmark ${bookmarks[i] ? "text-warning" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(i);
                            }}
                          />
                          <i
                            className="fa-regular fa-eye float-end"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToProfile(ex.coach_id);
                            }}
                            style={{ cursor: "pointer", marginLeft: '10px' }}
                          ></i>
                        </div>
                      </div>
                      <div className="flip-card-back p-3">
                        <div className="row">
                          <div className="col-12 text-center">
                            <p><strong>Recomendaciones:</strong><br />{ex.recommendations ?? 'Sin especificar'}</p>
                          </div>
                          <div className="col-12">
                            <h6><strong>Descripción detallada:</strong></h6>
                            <p>{ex.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredExercises.length === 0 && (
                <p className="text-muted">No se encontraron ejercicios.</p>
              )}
            </div>
          </div>
        )}

        {(activeTab === "coachs" || window.innerWidth >= 992) && (
          <div className="col-lg-3">
            <h5 className="mb-3">Entrenadores</h5>
            <div className="d-flex flex-column gap-3">
              {coachs.map((coach, index) => (
                <div key={index} className="card p-2">
                  <h6 className="mb-1">{coach.username}</h6>
                  <p className="mb-2 text-muted">{coach.description || "Sin descripción"}</p>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => goToProfile(coach.id_ch)}
                  >
                    Ver perfil
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Busqueda;
