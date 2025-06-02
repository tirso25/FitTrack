import React, { useState, useEffect } from 'react';
import './Profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';

const Profile = () => {
  const [detallesVisibles, setDetallesVisibles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get('id') || localStorage.getItem('id');

  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: '',
    password: '',
    status: '',
    public: true,
    role_id: 1,
  });
  const [exercises, setExercises] = useState([]);

  const localUserId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const isOwner = localUserId === profileId && !!token;

  useEffect(() => {
    if (!profileId) return;
    async function fetchUser() {
      try {
        const res = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/seeOneUser/${profileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Error al cargar usuario');
        const data = await res.json();
        const user = Array.isArray(data) ? data[0] : data;
        setUserData(user);
        setFormData({
          username: user?.username || '',
          email: user?.email || '',
          description: user?.description || '',
          password: '',
          status: user?.status || '',
          public: user?.public ?? true,
          role_id: user?.role?.role_id || 1,
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [profileId, token]);

useEffect(() => {
  async function fetchExercises() {
    if (!profileId || !token) return;

    try {
      let url = '';
      if (formData.role_id === 2) {
        url = `https://fittrackapi-fmwr.onrender.com/api/coachs/seeAllExercisesByCoach/${profileId}`;
      } else {
        url = `https://fittrackapi-fmwr.onrender.com/api/favoriteExercises/seeFavoritesExercises`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("La API no devolvió un array:", data);
        setExercises([]);
        setBookmarks([]);
        setDetallesVisibles([]);
        return;
      }

      setExercises(data);
      setBookmarks(new Array(data.length).fill(false));
      setDetallesVisibles(new Array(data.length).fill(false));
    } catch (error) {
      console.error(error);
    }
  }

  fetchExercises();
}, [formData.role_id, profileId, token]);

  const toggleDetalles = (index) => {
    setDetallesVisibles(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const toggleBookmark = (index) => {
    setBookmarks(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !profileId) {
      console.error("Token o ID de usuario no encontrado");
      return;
    }

    const cleanDescription = (desc) => {
      if (typeof desc !== "string") return "";
      return desc.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,-]/g, "");
    };

    const safeDescription = cleanDescription(formData.description);

    const roleId = Number(formData.role_id);
    if (isNaN(roleId) || roleId <= 0) {
      console.error("role_id inválido:", formData.role_id);
      alert("Selecciona un rol válido");
      return;
    }

    const bodyData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      description: safeDescription.substring(0, 500),
      status: formData.status || userData?.status || "active",
      public: typeof formData.public !== "undefined" ? formData.public : (userData?.public ?? true),
      role: roleId,
    };

    if (formData.password?.trim()) {
      bodyData.password = formData.password.trim();
    }

    try {
      const response = await fetch(
        `https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${profileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Hubo un error al actualizar el perfil.");
      } else {
        const updatedUser = await response.json();
        alert("Perfil actualizado correctamente");
        setEditMode(false);
        setUserData(updatedUser);
        setFormData({
          username: updatedUser.username,
          email: updatedUser.email,
          description: updatedUser.description || "",
          password: '',
          status: updatedUser.status,
          public: updatedUser.public,
          role_id: updatedUser.role?.role_id || roleId,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
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
                    value={formData.description}
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
            {exercises.length === 0 ? (
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
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
