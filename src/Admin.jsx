import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import './Admin.css';

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showExercises, setShowExercises] = useState(false);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [erroresApi, setErroresApi] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Filtrado dinámico según si mostramos ejercicios o usuarios
  const filteredUsuarios = usuarios.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredEjercicios = ejercicios.filter((ejercicio) =>
    Object.values(ejercicio).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  

  useEffect(() => {
    const rol = localStorage.getItem("rol");

    if (rol !== "ROLE_ADMIN") {
      alert("No eres administrador.\nNo deberías estar aquí.");
      return navigate("/");
    }

    const obtenerDatos = async () => {
      try {
        // Obtener usuarios
        const resUsuarios = await fetch(
          "https://fittrackapi-fmwr.onrender.com/api/users/seeAllUsers",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resUsuarios.ok) throw new Error("Fallo al obtener usuarios");
        const dataUsuarios = await resUsuarios.json();
        setUsuarios(dataUsuarios);

        // Obtener ejercicios
        const resEjercicios = await fetch(
          "https://fittrackapi-fmwr.onrender.com/api/exercises/seeAllExercises",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resEjercicios.ok) throw new Error("Fallo al obtener ejercicios");
        const dataEjercicios = await resEjercicios.json();
        setEjercicios(dataEjercicios);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Error al cargar datos: " + error.message);
      }
    };

    obtenerDatos();
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      setErroresApi("");
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
        setErroresApi("Error al guardar cambios: " + err.message);
      }
    };

    fetchCategories();
  }, [token]);

  const abrirModalModificar = async (id) => {
    setErroresApi("");
    try {
      const res = await fetch(
        `https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error obteniendo datos del usuario");
      const data = await res.json();
      setUsuarioSeleccionado(data);
      setRolesDisponibles(data.roles || []);
      setEjercicioSeleccionado(null);
      setModalVisible(true);
    } catch (err) {
      setErroresApi("Error al guardar cambios: " + err.message);
    }
  };

  const guardarCambiosUsuario = async () => {
    setErroresApi("");
    try {
      const payload = {
        username: usuarioSeleccionado.username,
        description: usuarioSeleccionado.description,
        status: usuarioSeleccionado.status,
        role_id: usuarioSeleccionado.role_id,
        public: usuarioSeleccionado.public,
      };

      if (usuarioSeleccionado.password?.trim()) {
        payload.password = usuarioSeleccionado.password;
      }

      const res = await fetch(
        `https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${usuarioSeleccionado.id_usr}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al guardar cambios");

      alert(result.message);
      setModalVisible(false);
      setUsuarioSeleccionado(null);

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usr === usuarioSeleccionado.id_usr ? { ...u, ...payload } : u
        )
      );
    } catch (err) {
      setErroresApi("Error al guardar cambios: " + err.message);
    }
  };

  const abrirModalModificarEjercicio = async (id) => {
    setErroresApi("");
    try {
      const res = await fetch(
        `https://fittrackapi-fmwr.onrender.com/api/exercises/seeOneExercise/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error obteniendo datos del ejercicio");
      const data = await res.json();

      setEjercicioSeleccionado(data[0]);
      setUsuarioSeleccionado(null);
      setModalVisible(true);
    } catch (err) {
      setErroresApi("Error al guardar cambios: " + err.message);
    }
  };

  const guardarCambiosEjercicio = async () => {
    setErroresApi("");
    try {
      const payload = {
        name: ejercicioSeleccionado.name,
        description: ejercicioSeleccionado.description,
        category_id: parseInt(ejercicioSeleccionado.category), 
        coach_id: ejercicioSeleccionado.coach_id,
        active:
          ejercicioSeleccionado.active === true ||
          ejercicioSeleccionado.active === "true" ||
          ejercicioSeleccionado.active === 1
            ? 1
            : 0, 
      };

      const res = await fetch(
        `https://fittrackapi-fmwr.onrender.com/api/exercises/modifyExercise/${ejercicioSeleccionado.id_exe}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );


      if (!res.ok) {
        const errorText = await res.text(); 
        console.error("Respuesta del servidor:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorText);
        } catch {
          throw new Error(errorText);
        }
      }

      const data = await res.json();
      setShowModalEdit(false);
      obtenerEjercicios(); // recargar la lista
    } catch (err) {
        let mensaje = err.message;
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.message) {
            mensaje = parsed.message;
          }
        } catch {}
        setErroresApi("Error al guardar cambios: " + mensaje);
    }
  };


  const columnsEjercicios = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Categoría",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Creador",
      selector: (row) => row.creator,
      sortable: true,
    },
    {
      name: "Likes",
      selector: (row) => row.likes,
      sortable: true,
    },
    {
      name: "Fecha de creación",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("es-ES"),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button
          className="btn-edit"
          onClick={() => abrirModalModificarEjercicio(row.id_exe)}
        >
          Modificar
        </button>
      ),
    },
  ];

  const columnsUsuarios = [
    {
      name: "ID",
      selector: (row) => row.id_usr,
      sortable: true,
      width: "70px",
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button
          className="btn-edit"
          onClick={() => abrirModalModificar(row.id_usr)}
        >
          Modificar
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
      <>
      {/* NAVBAR */}
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

      {/* Contenido principal */}
      <div className="container my-4">
        <div className="shadow-box">
          {/* Toggle Usuarios/Ejercicios */}
          <h1>Panel de control</h1>
          <br />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className={`btn-toggle ${!showExercises ? "active" : ""}`}
              onClick={() => {
                setShowExercises(false);
                setSearchTerm("");
              }}
            >
              Usuarios
            </button>
            <button
              className={`btn-toggle ${showExercises ? "active" : ""}`}
              onClick={() => {
                setShowExercises(true);
                setSearchTerm("");
              }}
            >
              Ejercicios
            </button>

            {/* Buscador */}
            <input
              type="text"
              className="form-control w-50"
              placeholder={`Buscar en ${showExercises ? "Ejercicios" : "Usuarios"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabla */}
          {showExercises ? (
            <DataTable
              columns={columnsEjercicios}
              data={filteredEjercicios}
              pagination
              highlightOnHover
              striped
              persistTableHead
            />
          ) : (
            <DataTable
              columns={columnsUsuarios}
              data={filteredUsuarios}
              pagination
              highlightOnHover
              striped
              persistTableHead
            />
          )}

          {/* Modal único para usuario o ejercicio */}
          {modalVisible && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {modalVisible &&  usuarioSeleccionado ? "Modificar Usuario" : "Modificar Ejercicio"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Cerrar"
                      onClick={() => {
                        setModalVisible(false);
                        setUsuarioSeleccionado(null);
                        setEjercicioSeleccionado(null);
                      }}
                    />
                  </div>
                  <div className="modal-body">
                    {usuarioSeleccionado && (
                      <>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={usuarioSeleccionado.username || ""}
                            onChange={(e) =>
                              setUsuarioSeleccionado({
                                ...usuarioSeleccionado,
                                username: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Descripción
                          </label>
                          <textarea
                            id="description"
                            className="form-control"
                            rows="3"
                            value={usuarioSeleccionado.description || ""}
                            onChange={(e) =>
                              setUsuarioSeleccionado({
                                ...usuarioSeleccionado,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">
                            Estado
                          </label>
                          <select
                            id="status"
                            className="form-select"
                            value={usuarioSeleccionado.status || ""}
                            onChange={(e) =>
                              setUsuarioSeleccionado({
                                ...usuarioSeleccionado,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="role" className="form-label">
                            Rol
                          </label>
                          <select
                            id="role"
                            className="form-select"
                            value={usuarioSeleccionado.role_id || ""}
                            onChange={(e) =>
                              setUsuarioSeleccionado({
                                ...usuarioSeleccionado,
                                role_id: e.target.value,
                              })
                            }
                          >
                            {rolesDisponibles.map((rol) => (
                              <option key={rol.id} value={rol.id}>
                                {rol.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="public" className="form-label">
                            Público
                          </label>
                          <select
                            id="public"
                            className="form-select"
                            value={usuarioSeleccionado.public ? "true" : "false"}
                            onChange={(e) =>
                              setUsuarioSeleccionado({
                                ...usuarioSeleccionado,
                                public: e.target.value === "true",
                              })
                            }
                          >
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Contraseña (solo si quieres cambiarla)
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            onChange={(e) =>
                              setUsuarioSeleccionado({
                                ...usuarioSeleccionado,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    {modalVisible && ejercicioSeleccionado && (
                      <>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={ejercicioSeleccionado.name || ""}
                            onChange={(e) =>
                              setEjercicioSeleccionado({
                                ...ejercicioSeleccionado,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">
                            Descripción
                          </label>
                          <textarea
                            id="description"
                            className="form-control"
                            rows="3"
                            value={ejercicioSeleccionado.description || ""}
                            onChange={(e) =>
                              setEjercicioSeleccionado({
                                ...ejercicioSeleccionado,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <select
                            id="category"
                            className="form-control"
                            value={ejercicioSeleccionado?.category || ""}
                            onChange={(e) =>
                              setEjercicioSeleccionado({
                                ...ejercicioSeleccionado,
                                category: e.target.value,
                              })
                            }
                          >
                            <option value="">Selecciona una categoría</option> 
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                    {erroresApi && (
                      <div className="alert alert-danger" role="alert">
                        {erroresApi}
                      </div>
                    )}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setModalVisible(false);
                        setUsuarioSeleccionado(null);
                        setEjercicioSeleccionado(null);
                      }}
                    >
                      Cancelar
                    </button>

                    {usuarioSeleccionado && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={guardarCambiosUsuario}
                      >
                        Guardar cambios
                      </button>
                    )}

                    {ejercicioSeleccionado && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={guardarCambiosEjercicio}
                      >
                        Guardar cambios
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </>
  );
};

export default Admin;
