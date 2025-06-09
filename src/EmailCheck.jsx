import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './EmailCheck.css';

const EmailCheck = () => {
  const location = useLocation();
  const emailInicial = location.state?.email || '';
  const [email, setEmail] = useState(emailInicial);
  const [codigo, setCodigo] = useState(''); // Estado para el código
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleComprobarClick = async () => {
    if (email.trim() === '') {
      alert('Por favor, introduce tu email electrónico.');
      return;
    }

    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();

    const response = await fetch('https://fittrackapi-fmwr.onrender.com/api/users/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json();
    }
  };

  const handleVerificarCodigo = async () => {
    const response = await fetch('https://fittrackapi-fmwr.onrender.com/api/users/checkCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verificationCode: codigo }),
    });

    if (response.status === 201) {
      navigate('/SignIn');
    } else {
      const data = await response.json();
      alert(data.message || 'Código incorrecto. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <nav className="navbar d-flex align-items-center justify-content-center">
        <img src="/assets/img/logoFinal.png" alt="Logo" className="img-fluid" />
      </nav>

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: 'calc(100vh - 140px)' }}
      >
        <div className="card-confirm">
          <h5 className="mb-3">Confirmación de email</h5>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="email electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              <p>Introduce el código que te hemos enviado por email electrónico:</p>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Código de verificación"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              <button className="btn-confirmar w-100" onClick={handleVerificarCodigo}>
                Verificar código
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailCheck;
