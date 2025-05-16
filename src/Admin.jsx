import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Administrador() {
    const [vistaEjercicios, setVistaEjercicios] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [botonesFiltro, setBotonesFiltro] = useState([]);
  
    const toggleLogin = () => {
    setIsLoggedIn(prev => !prev);
};

const toggleView = () => {
    setVistaEjercicios(!vistaEjercicios);
};
const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      alert("Has cerrado sesión. Se te redirigirá al inicio.")
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
useEffect(() => {
    const btn1 = {
    texto: vistaEjercicios ? 'Ejercicios' : 'Usuarios',
    clase: 'btn-fit',
    };
    const btn2 = {
    texto: 'Entrenadores',
    clase: 'btn-fit',
    };
    setBotonesFiltro([btn1, btn2]);
}, [vistaEjercicios]);

return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light px-4">
        <a className="navbar-brand mx-auto" href="#">
        <img src="img/logoFinal.png" alt="FitTrack" />
        </a>
        <div className="collapse navbar-collapse justify-content-end">
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
                    <Link className="nav-link active" to="/admin">Administrador</Link>
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
    </nav>

    <div className="container my-4">
        <div className="shadow-box">
        <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
            <input type="text" className="form-control me-3" placeholder="Búsqueda" style={{ maxWidth: '300px' }} />
            <div className="d-flex align-items-center flex-wrap gap-2">
            {botonesFiltro.map((btn, idx) => (
                <button key={idx} className={btn.clase}>{btn.texto}</button>
            ))}
            </div>
            <button className="btn-switch ms-auto" onClick={toggleView}>Cambiar vista</button>
        </div>

        {!vistaEjercicios ? (
            <div id="tabla-usuarios">
            <table className="table align-middle text-center">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Fecha creación</th>
                    <th>Tipo usuario</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>usuario1@correo.com</td>
                    <td>2025-05-15</td>
                    <td>Entrenador</td>
                    <td>
                    <button className="btn-edit">Modificar</button>
                    <button className="btn-delete" title="Eliminar">🗑️</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        ) : (
            <div id="tabla-ejercicios">
            <table className="table align-middle text-center">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fecha creación</th>
                    <th>Entrenador</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Sentadilla</td>
                    <td>2025-05-10</td>
                    <td>entrenador@correo.com</td>
                    <td>
                    <button className="btn-edit">Modificar</button>
                    <button className="btn-delete" title="Eliminar">🗑️</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        )}
        </div>
    </div>
    </>
);
}
