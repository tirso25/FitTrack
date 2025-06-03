import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import "./Admin.css";

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const navigate = useNavigate();



  const token = localStorage.getItem("token");

  useEffect(() => {
    var rol = localStorage.getItem('rol');

    if (rol != "ROLE_ADMIN") {
      alert("No eres administrador.\n No deberias estar aquí.");
      navigate("/");

    }
    const obtenerUsuarios = async () => {
      try {
        const res = await fetch("https://fittrackapi-fmwr.onrender.com/api/users/seeAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Fallo al obtener usuarios");
        const data = await res.json();
        setUsuarios(data);

      } catch (error) {
        alert("Error al cargar usuarios: " + error.message);
      }
    };

    obtenerUsuarios();
  }, [token]);

  const abrirModalModificar = async (id) => {
    try {
      const res = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error obteniendo datos del usuario");
      const data = await res.json();
      setUsuarioSeleccionado(data);

      setRolesDisponibles(data.roles);
      setModalVisible(true);
    } catch (err) {
      alert("Error al cargar datos: " + err.message);
    }
  };

  const guardarCambiosUsuario = async () => {
    try {
      const res = await fetch(`https://fittrackapi-fmwr.onrender.com/api/users/modifyUser/${usuarioSeleccionado.id_usr}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: usuarioSeleccionado.username,
          description: usuarioSeleccionado.description,
          status: usuarioSeleccionado.status,
          role_id: usuarioSeleccionado.role_id,
          public: usuarioSeleccionado.public,
          password: usuarioSeleccionado.password,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al guardar cambios");
      alert(result.message);
      setModalVisible(false);
      window.location.reload();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="admin-container">
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#">
            <img src="./public/assets/img/logoFinal.png" alt="FitTrack" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu">
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
      <h1 className="text-center my-4">Panel de Administración</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id_usr}>
              <td>{user.id_usr}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => abrirModalModificar(user.id_usr)}>
                  Modificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && usuarioSeleccionado && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Modificar Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setModalVisible(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>Email (no editable)</label>
                  <input className="form-control" value={usuarioSeleccionado.email} disabled />
                </div>
                <div className="mb-2">
                  <label>Nombre de usuario</label>
                  <input
                    className="form-control"
                    value={usuarioSeleccionado.username}
                    onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, username: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label>Contraseña</label>
                  <input
                    className="form-control"
                    placeholder="Deja el campo vacío si no quieres modificar la contraseña"
                    onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, password: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    value={usuarioSeleccionado.description || ""}
                    onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, description: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label>Estado</label>
                  <select
                    className="form-select"
                    value={usuarioSeleccionado.status}
                    onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, status: e.target.value })}
                  >
                    <option value="active">Activo</option>
                    <option value="deleted">Eliminado</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label>Rol</label>
                  <select
                    className="form-select"
                    value={usuarioSeleccionado.role_id || ""}
                    onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, role_id: parseInt(e.target.value) })}
                  >
                    {rolesDisponibles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={usuarioSeleccionado.public}
                    onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, public: e.target.checked })}
                  />
                  <label className="form-check-label">Perfil público</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={guardarCambiosUsuario}>Guardar</button>
                <button className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
