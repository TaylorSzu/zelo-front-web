import React, { useState } from "react";

export default function ConfirmarSenha({ onConfirmar, onCancelar }) {
  const [senha, setSenha] = useState("");

  const handleConfirmar = () => {
    onConfirmar(senha);
    setSenha(""); // Limpa a senha depois de confirmar
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
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}>
        <h4 className="text-center mb-4">Confirme sua Senha</h4>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button onClick={onCancelar} className="btn btn-outline-secondary w-45">
            Cancelar
          </button>
          <button onClick={handleConfirmar} className="btn btn-primary w-45">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
