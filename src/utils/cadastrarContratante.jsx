import React, { useState } from "react";

export default function CadastrarContratante({ onCadastrar, onCancelar }) {
  const [necessidade, setNecessidade] = useState("");

  const handleCadastrar = () => {
    if (necessidade.trim() === "") return;
    onCadastrar(necessidade);
    setNecessidade(""); // Limpa depois de cadastrar
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 1050,
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
      >
        <h4 className="text-center mb-4">Cadastrar Contratante</h4>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Descreva sua necessidade"
            value={necessidade}
            onChange={(e) => setNecessidade(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            onClick={onCancelar}
            className="btn btn-outline-secondary w-45"
          >
            Cancelar
          </button>
          <button
            onClick={handleCadastrar}
            className="btn btn-primary w-45"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
