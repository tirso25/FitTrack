import React, { useState, useEffect } from 'react';
import './Profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get('id') || localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const localUserId = localStorage.getItem('id');
  const isOwner = localUserId === profileId && !!token;

  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState([]);

  const [bookmarksCoaches, setBookmarksCoaches] = useState([]);
  const [coachesWarning, setCoachesWarning] = useState(null);
  const [exercisesWarning, setExercisesWarning] = useState(null);

  const [creatingExercise, setCreatingExercise] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: '',
    password: '',
    status: '',
    public: true,
    role_id: 'ROLE_USER',
  });

  useEffect(() => {
    if (!profileId || !token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/seeOneUser/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error("Error en la respuesta:", response.status);
          throw new Error("Error al obtener datos del usuario");
        }

        const data = await response.json();
        // data es un array con un objeto con user + favoritos
        setUserData(data[0]);

      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUser();
  }, [profileId, token]);

  const isPublic = userData?.public ?? true;

  // Procesar favoritos para ejercicios y coaches según esquema backend
  useEffect(() => {
    if (!userData) return;

    const processFavorites = (favoritesArray) => {
      if (!Array.isArray(favoritesArray) || favoritesArray.length === 0) {
        return { items: [], warning: "This user has a private profile or no bookmarks" };
      }
      if (favoritesArray[0]?.type === 'warning') {
        return { items: [], warning: favoritesArray[0].message };
      }
      const items = favoritesArray
        .filter(fav => fav.type === 'success' && fav.message)
        .map(fav => fav.message);
      if (items.length === 0) {
        return { items: [], warning: "This user has a private profile or no bookmarks" };
      }
      return { items, warning: null };
    };

    const { items: exercisesList, warning: exercisesWarn } = processFavorites(userData.exercisesFavorites);
    const { items: coachesList, warning: coachesWarn } = processFavorites(userData.coachsFavorites);

    setExercises(exercisesList);
    setBookmarks(Array(exercisesList.length).fill(false));
    setDetallesVisibles(Array(exercisesList.length).fill(false));

    setBookmarksCoaches(coachesList);
    setExercisesWarning(exercisesWarn);
    setCoachesWarning(coachesWarn);

  }, [userData]);

  useEffect(() => {
    if (userData?.role === 'ROLE_COACH') {
      setIsCoach(true);
    } else {
      setIsCoach(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        description: userData.description || '',
        password: '',
        status: userData.status || '',
        public: userData.public ?? true,
        role_id: userData.role || 'ROLE_USER',
      });
    }
  }, [userData]);

  const toggleDetalles = i => setDetallesVisibles(prev => {
    const copy = [...prev];
    copy[i] = !copy[i];
    return copy;
  });

  const toggleBookmark = async (i) => {
    const exe = exercises[i];
    const url = `https://fittrackapi-fmwr.onrender.com/api/favoriteExercises/${bookmarks[i] ? 'undoFavorite' : 'addFavoriteExercise'}/${exe.id_exe}`;

    try {
      const res = await fetch(url, {
        method: bookmarks[i] ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error(await res.text());

      setBookmarks(prev => {
        const updated = [...prev];
        updated[i] = !updated[i];
        return updated;
      });
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
    }
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !profileId) return;

    const desc = (formData.description || '').trim().substring(0, 500);

    const role = formData.role_id;
    if (!['ROLE_USER', 'ROLE_COACH', 'ROLE_ADMIN'].includes(role)) return alert("Rol no válido");

    const body = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      description: desc,
      status: formData.status || userData?.status || 'active',
      public: formData.public,
      role,
    };

    if (formData.password?.trim()) body.password = formData.password.trim();

    try {
      const res = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      const updated = await res.json();
      setEditMode(false);
      setUserData(updated);
      setFormData({
        username: updated.username,
        email: updated.email,
        description: updated.description || '',
        password: '',
        status: updated.status,
        public: updated.public,
        role_id: updated.role || 'ROLE_USER',
      });
      alert("Perfil actualizado correctamente");
      window.location.reload();
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
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

    {!isPublic && !isOwner ? (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          <h3>Este perfil es privado y no puedes entrar a verlo</h3>
        </div>
      </div>
    ) : (
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="sidebar">
            {isOwner && (
              <button
                className="btn btn-link position-absolute top-0 end-0 m-3 text-dark"
                title="Editar perfil"
                onClick={() => setEditMode(!editMode)}
                style={{ fontSize: '1.2rem' }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            )}

            <img
              src="/assets/img/usuario.png"
              className="img-fluid rounded-circle my-3"
              style={{ maxWidth: '120px' }}
              alt="Usuario"
            />

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label htmlFor="username" className="form-label"><strong>Usuario:</strong></label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label"><strong>Email:</strong></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="description" className="form-label"><strong>Descripción:</strong></label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-sm me-2">Guardar</button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditMode(false)}
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <p><strong>{userData?.username || 'Usuario'}</strong></p>
                <p>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ''}</p>
                <p>{userData?.email || ''}</p>
                <p>{userData?.description || ''}</p>
              </>
            )}
          </div>

          <div className="content-right">
  {isOwner && isCoach && !creatingExercise && (
    <div className="text-end me-3">
      <button
        className="btn btn-success my-3"
        onClick={() => setCreatingExercise(true)}
      >
        Crear Ejercicio
      </button>
    </div>
  )}

  {creatingExercise ? (
    <div className="container my-4">
      <h4>Nuevo Ejercicio</h4>
      <form className="card p-4 shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Nombre del ejercicio</label>
          <input type="text" className="form-control" placeholder="Ej: Sentadillas" />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" rows="3" placeholder="Describe el ejercicio..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input type="text" className="form-control" placeholder="Ej: Piernas" />
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCreatingExercise(false)}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  ) : exercises.length === 0 ? (
    <div role="alert">
      Aún no hay ejercicios.
    </div>
  ) : (
    exercises.map((exercise, index) => (
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
              <img
                src="/assets/img/abdominoplastia.png"
                alt="ejercicio"
                className="exercise-img me-3"
                style={{ width: '80px' }}
              />
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
                <img
                  src="/assets/img/abdominoplastia.png"
                  alt="Ejercicio"
                  className="img-fluid mb-2"
                  style={{ maxHeight: '120px' }}
                />
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
    ))
  )}
</div>

        </div>
      </div>
    )}
  </>
);

}

export default Profile;
