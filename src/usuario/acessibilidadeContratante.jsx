import React, { useContext } from "react";
import { AcessibilidadeContext } from "../context/acessibilidadeContext.jsx";

const Acessibilidade = () => {
  const { modoEscuro, setModoEscuro, tamanhoFonte, setTamanhoFonte } =
    useContext(AcessibilidadeContext);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h3 className="mb-4 text-center">Configurações de Acessibilidade</h3>

        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="modoEscuro"
            checked={modoEscuro}
            onChange={(e) => setModoEscuro(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="modoEscuro">
            Ativar modo escuro
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="tamanhoFonte" className="form-label">
            Tamanho da Fonte: <strong>{tamanhoFonte}px</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="tamanhoFonte"
            min="12"
            max="24"
            value={tamanhoFonte}
            onChange={(e) => setTamanhoFonte(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Acessibilidade;
