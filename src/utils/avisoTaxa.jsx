import React from "react";

const AvisoTaxa = ({ show, onClose }) => {
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
        padding: "1rem",
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
        <h5 className="mb-3">Aviso Importante</h5>
        <p>
          Informamos que o cuidador tem uma taxa de <strong>15%</strong> cobrada
          pelo app sobre o valor dos serviços realizados. Ao clicar no botão
          abaixo você confirma que concorda com estes termos.
        </p>
        <button
          className="btn btn-primary mt-3"
          onClick={onClose}
          style={{ minWidth: "100px" }}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default AvisoTaxa;
