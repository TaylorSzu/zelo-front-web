import React, { useContext } from "react";
import { AcessibilidadeContext } from "../context/acessibilidadeContext";

const ModalAcessibilidade = ({ onClose }) => {
  const { modoEscuro, setModoEscuro, tamanhoFonte, setTamanhoFonte } =
    useContext(AcessibilidadeContext);

  const handleChangeFonte = (e) => {
    setTamanhoFonte(Number(e.target.value));
  };

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
          <div className="modal-content shadow">
            <div className="modal-header bg-primary text-white justify-content-center">
              <h5 className="modal-title">Acessibilidade</h5>
            </div>
            <div className="modal-body">
              <div className="mb-3 form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={modoEscuro}
                  onChange={() => setModoEscuro(!modoEscuro)}
                  id="modoEscuroSwitch"
                />
                <label className="form-check-label" htmlFor="modoEscuroSwitch">
                  Ativar Modo Escuro
                </label>
              </div>

              <div className="mb-3">
                <label htmlFor="sliderFonte" className="form-label">
                  Tamanho da Fonte: <strong>{tamanhoFonte}px</strong>
                </label>
                <input
                  type="range"
                  className="form-range slider-custom"
                  id="sliderFonte"
                  min="12"
                  max="24"
                  step="1"
                  value={tamanhoFonte}
                  onChange={handleChangeFonte}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={onClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAcessibilidade;
