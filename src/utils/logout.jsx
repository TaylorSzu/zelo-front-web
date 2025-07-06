import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const LogoutModal = ({ show, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setLoading(true);
    Cookies.remove("token");
    sessionStorage.clear();

    await new Promise((resolve) => setTimeout(resolve, 3000));
    navigate("/login");
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg position-relative overflow-hidden">
            {/* Cabeçalho */}
            <div className="modal-header bg-primary text-white justify-content-center rounded-top-4">
              <h5 className="modal-title fw-semibold">Logout</h5>
            </div>

            {/* Corpo da modal */}
            <div className="modal-body text-center px-4 py-5">
              <h5 className="fw-semibold">Você realmente deseja sair?</h5>
            </div>

            {/* Rodapé com botões */}
            <div className="modal-footer d-flex justify-content-center gap-3 pb-4">
              <button
                className="btn btn-secondary rounded-3 px-4"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger rounded-3 px-4"
                onClick={handleConfirm}
                disabled={loading}
              >
                Sair
              </button>
            </div>

            {/* SOBREPOSIÇÃO: Saindo... */}
            {loading && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-primary bg-opacity-95 text-white"
                style={{ zIndex: 10 }}
              >
                <Spinner animation="border" variant="light" className="mb-3" />
                <h5 className="fw-semibold">Saindo...</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
