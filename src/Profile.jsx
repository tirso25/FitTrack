import React, { useState, useEffect } from 'react';
import './Profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get('id') || localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem("rol");
  const localUserId = localStorage.getItem('id');
  const isOwner = localUserId === profileId && !!token;

  const [userData, setUserData] = useState(null);
  const [isCoach, setIsCoach] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [detallesVisibles, setDetallesVisibles] = useState([]);
  const [bookmarks, setBookmarks] = useState([true]);
  const [editMode, setEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [erroresApi, setErroresApi] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: '',
    password: '',
    status: '',
    public: true,
    role_id: 'ROLE_USER',
  });

  // Estados para formulario de nuevo ejercicio
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDescription, setExerciseDescription] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('');

  useEffect(() => {
    if (!profileId || !token) return;

    const fetchData = async () => {
      setErroresApi("");
      try {
        const userRes = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/seeOneUser/${profileId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!userRes.ok) throw new Error('Error al obtener datos del usuario');

        const userDataArray = await userRes.json();
        const user = userDataArray[0];


        setUserData(user);

        const coachRes = await fetch('https://fittrackapi-fmwr.onrender.com/api/coachs/seeAllCoachs', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!coachRes.ok) throw new Error('Error al obtener la lista de coaches');

        const coaches = await coachRes.json();

        const coachIds = coaches.map(coach => coach.id_ch.toString());
        const isUserCoach = coachIds.includes(profileId.toString());
        setIsCoach(isUserCoach);

        const userExercises = user.exercises || [];
        setExercises(userExercises);

        if (user.id && profileId) {
          const isProfileOwner = user.id === profileId.toString();

              const initialBookmarks = isProfileOwner
                ? user.exercises.map(() => true)  // Todos activos si es el mismo usuario
                : user.exercises.map(() => false); // Ninguno activo si es otro usuario

              setBookmarks(initialBookmarks);
        }
        
        setDetallesVisibles(Array(user.exercises.length).fill(false));

        setFormData({
          username: user.username || '',
          email: user.email || '',
          description: user.description || '',
          password: '',
          status: user.status || '',
          public: user.public ?? true,
          role_id: user.role || 'ROLE_USER',
        });
      } catch (error) {
        setErroresApi(error);
      }
    };

    fetchData();
  }, [profileId, token]); 


  const toggleDetalles = i => setDetallesVisibles(prev => {
    const copy = [...prev];
    copy[i] = !copy[i];
    return copy;
  });

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


  const toggleFavorite = async () => {
    setErroresApi("");
    try {
      // Intentar agregar favorito (POST)
      const urlAdd = `https://fittrackapi-fmwr.onrender.com/api/favoriteCoachs/addFavoritesCoachs/${profileId}`;
      let res = await fetch(urlAdd, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Agregado correctamente
        setIsFavorite(true);
      } else {
        // Leer mensaje de error
        const errorData = await res.json().catch(() => null);

        // Si es error de favorito ya agregado, hacer DELETE para quitar
        if (errorData?.message === 'Coach already added to favorite') {
          const urlDelete = `https://fittrackapi-fmwr.onrender.com/api/favoriteCoachs/undoFavoritesCoachs/${profileId}`;
          const resDelete = await fetch(urlDelete, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (resDelete.ok) {
            setIsFavorite(false);
          } else {
            const deleteError = await resDelete.text();
            setErroresApi('Error al quitar favorito:', deleteError);
          }
        } else {
          setErroresApi('Error al agregar favorito:', errorData ?? await res.text());
        }
      }
    } catch (err) {
      setErroresApi('Error en toggleFavorite:', err);
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
      setErroresApi("");
    try {
      const res = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${profileId}`, {
        method: 'PUT',
        credentials: 'include',
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
      setErroresApi('Error al actualizar perfil:', err);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch('https://fittrackapi-fmwr.onrender.com/api/categories/seeAllCategories', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!res.ok) throw new Error('Error al cargar categorías');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setErroresApi(err);
      }
    };

    fetchCategories();
  }, [token]);

  function handleSubmitExercise(e) {
    e.preventDefault();

    const name = exerciseName.trim().toLowerCase();
    const description = exerciseDescription.trim();
    const category_id = parseInt(exerciseCategory, 10);

    // Regex que coinciden con la validación del backend
    const nameRegex = /^[a-z]{1,30}$/;
    const descriptionRegex = /^[a-zA-Z0-9\s]{10,500}$/;

    if (!nameRegex.test(name)) {
      setErroresApi("El nombre debe tener solo letras minúsculas, sin espacios ni caracteres especiales, y hasta 30 caracteres.");
      return;
    }

    if (!descriptionRegex.test(description) || description.length < 10 || description.length > 500) {
      setErroresApi("La descripción debe tener entre 10 y 500 caracteres alfanuméricos.");
      return;
    }

    if (isNaN(category_id) || category_id <= 0) {
      setErroresApi("Selecciona una categoría válida.");
      return;
    }

    const data = {
      name,
      description,
      category_id
    };
    setErroresApi("");

    fetch("https://fittrackapi-fmwr.onrender.com/api/exercises/addExercise", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.type === "success") {
        alert("Ejercicio creado correctamente");
        // Resetea formulario
        setExerciseName('');
        setExerciseDescription('');
        setExerciseCategory('');
      } else {
        alert(json.message || "Error al crear ejercicio");
      }
    })
    .catch((err) => {
      setErroresApi(err);
    });
  }

  const isPublic = userData?.public ?? true;


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
              {rol !== 'ROLE_ADMIN' && (
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">Perfil</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/search" ? "active" : ""}`} to="/search">Búsqueda</Link>
              </li>
              {rol === 'ROLE_ADMIN' && (
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`} to="/admin">Administrador</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/signout" ? "active" : ""}`} to="/signout">Salir</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {userData ? (
        !isPublic && !isOwner ? (
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
                {isCoach && localUserId !== profileId && (
                  <button className="btn-favorite position-absolute top-0 end-0 m-3" onClick={toggleFavorite}>
                    {isFavorite ? '⭐' : '☆'}
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
                      {erroresApi && (
                        <div className="alert alert-danger" role="alert">
                          {erroresApi}
                        </div>
                      )}
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
                    <p><strong>{userData.username}</strong></p>
                    <p>{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ''}</p>
                    <p>{userData.email}</p>
                    <p>{userData.description}</p>
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

                {creatingExercise && (
                    <div className="container my-4">
                      <h4>Nuevo Ejercicio</h4>
                      <form className="card p-4 shadow-sm bg-light" onSubmit={handleSubmitExercise}>
                        <div className="mb-3">
                          <label htmlFor="exerciseName" className="form-label">Nombre</label>
                          <input
                            type="text"
                            id="exerciseName"
                            className="form-control"
                            value={exerciseName}
                            onChange={e => setExerciseName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="exerciseDescription" className="form-label">Descripción</label>
                          <textarea
                            id="exerciseDescription"
                            className="form-control"
                            rows="3"
                            value={exerciseDescription}
                            onChange={e => setExerciseDescription(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="exerciseCategory" className="form-label">Categoría</label>
                          <select
                            value={exerciseCategory}
                            onChange={e => setExerciseCategory(e.target.value)}
                          >
                            <option value="">Selecciona una categoría</option> 
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => setCreatingExercise(false)}
                          >
                            Cancelar
                          </button>
                          <button type="submit" className="btn btn-primary">Crear</button>
                        </div>
                      </form>
                    </div>
                )}

                {!creatingExercise && (
                  exercises.length === 0 ? (
                    <div role="alert">
                      Aún no hay ejercicios.
                    </div>
                  ) : (
                    exercises.map((exercise, index) => (
                      <div key={exercise.id_exe} className="exercise-card p-3 border mb-3">
                        <div className="d-flex justify-content-end gap-3">
                          <i
                            className={`bi bi-bookmark${bookmarks[index] ? '-fill text-warning' : ''}`}
                            onClick={() => toggleBookmark(index)}
                            style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                            title="Marcar como favorito"
                          ></i>

                          <i
                            className={`fa-solid fa-caret-${detallesVisibles[index] ? 'up' : 'down'}`}
                            onClick={() => toggleDetalles(index)}
                            style={{ cursor: 'pointer' }}
                            aria-label={detallesVisibles[index] ? 'Ocultar detalles' : 'Mostrar detalles'}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter') toggleDetalles(index) }}
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
                                <strong>{exercise.exercise_name}</strong><br />
                                <small>{exercise.exercise_description}</small>
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
                                  <li>{exercise.exercise_description}</li>
                                  <li>Músculo: {exercise.exercise_category}</li>
                                  <li>Likes: {exercise.exercise_likes}</li>
                                  <li>Fecha: {new Date(exercise.exercise_created_at).toLocaleDateString()}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-center p-3">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Cargando perfil...</p>
        </div>
      )}
    </>
  );

}

export default Profile;
