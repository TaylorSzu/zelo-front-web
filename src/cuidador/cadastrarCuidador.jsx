import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Mascara, { removerMascaraDinheiro } from "../utils/mascaras.jsx";
import ModalDisponibilidade from "../utils/disponibilidade.jsx";

export default function CadastroCuidador({ onConfirmar, onCancelar }) {
  const [disponibilidade, setDisponibilidade] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [showModalDisponibilidade, setShowModalDisponibilidade] =
    useState(false);

  const handleConfirmar = async () => {
    if (!disponibilidade || !valorHora || !especialidade.trim()) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const valorDiaria = parseFloat(
        removerMascaraDinheiro(valorHora, "dinheiro")
      );

      await axios.post(
        "http://localhost:5171/cuidador/registrar",
        {
          disponibilidade,
          valorHora: valorDiaria,
          especialidade,
          statusVerificacao: "ativo",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Cadastro realizado com sucesso!");
      if (onConfirmar) onConfirmar();
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Erro ao cadastrar cuidador:", error);
      toast.error("Erro ao cadastrar cuidador. Tente novamente.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />

      {/* Modal backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            {/* Header */}
            <div className="modal-header bg-primary text-white justify-content-center">
              <h5 className="modal-title">Cadastro de Cuidador</h5>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Disponibilidade</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={disponibilidade}
                    placeholder="Clique para definir"
                    disabled
                  />
                  <button
                    className="btn btn-outline-success"
                    onClick={() => setShowModalDisponibilidade(true)}
                  >
                    Editar
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Valor por Diária (R$)</label>
                <Mascara
                  type="dinheiro"
                  value={valorHora}
                  onChange={(e) => setValorHora(e.target.value)}
                  placeholder="Informe seu valor por diária"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Especialidade</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Ex: Cuidados paliativos, Alzheimer, Pós-operatório"
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer d-flex justify-content-center">
              <button className="btn btn-danger me-2" onClick={onCancelar}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleConfirmar}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de disponibilidade */}
      {showModalDisponibilidade && (
        <ModalDisponibilidade
          onConfirmar={({ disponibilidade }) => {
            setDisponibilidade(disponibilidade);
            setShowModalDisponibilidade(false);
          }}
          onCancelar={() => setShowModalDisponibilidade(false)}
        />
      )}
    </>
  );
}
