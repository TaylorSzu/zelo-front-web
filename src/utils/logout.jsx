import React from "react";
import { Spinner } from "react-bootstrap";

const LogoutModal = ({ show, onClose, onConfirm, loading }) => {
  if (!show) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem", // espaçamento para evitar encostar nas bordas em mobile
        zIndex: 2000,
      }}
    >
      <div
        className="modal-content p-4 bg-white rounded text-center"
        style={{
          width: "100%",
          maxWidth: "400px",
          boxSizing: "border-box",
          borderRadius: "0.5rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.25)",
        }}
      >
        <h5>Confirmação de Logout</h5>
        <p>Você realmente deseja sair?</p>

        <div className="d-flex justify-content-center gap-2 align-items-center flex-wrap">
          <button
            className="btn btn-primary"
            onClick={onClose}
            disabled={loading}
            style={{ minWidth: "100px", flex: "1 1 auto" }}
          >
            Cancelar
          </button>

          <button
            className="btn btn-danger d-flex align-items-center justify-content-center"
            onClick={onConfirm}
            disabled={loading}
            style={{ minWidth: "100px", flex: "1 1 auto" }}
          >
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
