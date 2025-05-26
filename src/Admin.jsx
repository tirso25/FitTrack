import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Admin.css";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import { Link } from "react-router-dom";

function Admin() {
  const usuariosMock = [
    { email: "usuario1@correo.com", fecha: "2025-05-15", tipo: "Entrenador" },
    { email: "usuario2@correo.com", fecha: "2025-04-20", tipo: "Administrador" },
  ];

  const ejerciciosMock = [
    { nombre: "Sentadilla", fecha: "2025-05-10", entrenador: "entrenador@correo.com" },
    { nombre: "Flexiones", fecha: "2025-04-22", entrenador: "coach@correo.com" },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [vistaEjercicios, setVistaEjercicios] = useState(false);
  const tablaUsuariosRef = useRef(null);
  const tablaEjerciciosRef = useRef(null);

  useEffect(() => {
    let tabla;
    if (!vistaEjercicios) {
      tabla = $(tablaUsuariosRef.current).DataTable();
    } else {
      tabla = $(tablaEjerciciosRef.current).DataTable();
    }

    return () => {
      if (tabla) tabla.destroy();
    };
  }, [vistaEjercicios]);

  const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
  };

  const toggleView = () => {
    setVistaEjercicios(prev => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="./public/assets/img/logoFinal.png" alt="FitTrack" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
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
                    <Link className="nav-link" to="/search">Búsqueda</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${window.location.pathname === "/admin" ? "active" : ""}`} to="/admin">Administrador</Link>
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

      <div className="container my-4">
        <div className="shadow-box">
          <div className="switch-container mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="switchVista"
              checked={vistaEjercicios}
              onChange={toggleView}
              aria-label="Cambiar vista"
            />
          </div>

          {!vistaEjercicios && (
            <div id="tabla-usuarios">
              <div className="table-title">Usuarios</div>
              <table
                ref={tablaUsuariosRef}
                id="tablaUsuarios"
                className="table display align-middle text-center"
              >
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Fecha creación</th>
                    <th>Tipo usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosMock.map((user, i) => (
                    <tr key={i}>
                      <td>{user.email}</td>
                      <td>{user.fecha}</td>
                      <td>{user.tipo}</td>
                      <td>
                        <button className="btn-edit">Modificar</button>
                        <button className="btn-delete" title="Eliminar">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {vistaEjercicios && (
            <div id="tabla-ejercicios">
              <div className="table-title">Ejercicios</div>
              <table
                ref={tablaEjerciciosRef}
                id="tablaEjercicios"
                className="table display align-middle text-center"
              >
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha creación</th>
                    <th>Entrenador</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ejerciciosMock.map((ej, i) => (
                    <tr key={i}>
                      <td>{ej.nombre}</td>
                      <td>{ej.fecha}</td>
                      <td>{ej.entrenador}</td>
                      <td>
                        <button className="btn-edit">Modificar</button>
                        <button className="btn-delete" title="Eliminar">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;


