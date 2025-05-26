import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './EmailCheck.css';

export default function EmailCheck() {
  const location = useLocation();
  const correoInicial = location.state?.email || '';
  const [correo, setCorreo] = useState(correoInicial);
  const modalRef = useRef(null);

  const handleComprobarClick = () => {
    if (correo.trim() === '') {
      alert('Por favor, introduce tu correo electrónico.');
    } else {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();
    }
  };

  return (
    <>
      <nav className="navbar d-flex align-items-center justify-content-center">
        <img src="./public/assets/img/logoFinal.png" alt="Logo" className="img-fluid" />
      </nav>

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: 'calc(100vh - 140px)' }}
      >
        <div className="card-confirm">
          <h5 className="mb-3">Confirmación de correo</h5>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <button className="btn-confirmar w-100" onClick={handleComprobarClick}>
            Comprobar
          </button>
        </div>
      </div>

      <div
        className="modal fade"
        id="codigoModal"
        tabIndex="-1"
        aria-labelledby="codigoModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '12px' }}>
            <div
              className="modal-header"
              style={{ backgroundColor: '#ccf5b0', borderBottom: 'none' }}
            >
              <h5 className="modal-title" id="codigoModalLabel">
                Verificación
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body text-center">
              <p>Introduce el código que te hemos enviado por correo electrónico:</p>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Código de verificación"
              />
              <button className="btn-confirmar w-100">Verificar código</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
