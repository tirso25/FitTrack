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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();




  useEffect(() => {
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
        if (data.type === 'error' || data.type === 'warning') {
          console.error(data.message);
        } else {
          setExercises(data);
          setBookmarks(new Array(data.length).fill(false));
        }
      })
      .catch(error => {
        console.error('Error al obtener los ejercicios:', error);
      });
  }, []);

  const toggleBookmark = (index) => {
    const updated = [...bookmarks];
    updated[index] = !updated[index];
    setBookmarks(updated);
  };

  const goToProfile = (coachId) => {
    navigate(`/profile/${coachId}`);
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

      const matchCategory = matchedCategories.some(cat => categoryLower.includes(cat.toLowerCase()));

      return matchName || matchCategory;
    });

    setFilteredExercises(filtered);
  }, [searchTerm, exercises]);


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

      <div className="container mt-4">
        <div className="search-bar d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o zona (hombro, brazo...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="my-3">
          {["Hombro", "Brazo", "Espalda", "Torso", "Pierna"].map((zona) => (
            <button
              key={zona}
              className="filter-btn"
              onClick={() => setSearchTerm(zona.toLowerCase())} // <- aquí asignas el filtro
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
        </div>

      </div>
    </>
  );
};

export default Busqueda;
