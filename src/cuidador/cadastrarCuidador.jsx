import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Mascara, { removerMascaraDinheiro } from "../utils/mascaras.jsx";

export default function CadastroCuidador({ onConfirmar, onCancelar }) {
  const [disponibilidade, setDisponibilidade] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const handleConfirmar = async () => {
    if (!disponibilidade.trim() || !valorHora || !especialidade.trim()) {
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

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar cuidador:", error);
      toast.error("Erro ao cadastrar cuidador. Tente novamente.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />

      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2"
        style={{
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1050,
        }}
      >
        <div
          className="card p-4 shadow-lg w-100"
          style={{
            maxWidth: "500px",
            width: "90vw",
            borderRadius: "1rem",
          }}
        >
          <h4 className="text-center mb-4">Cadastro de Cuidador</h4>

          <div className="mb-3">
            <label className="form-label">Disponibilidade</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Segunda a Sexta, 08:00 - 18:00"
              value={disponibilidade}
              onChange={(e) => setDisponibilidade(e.target.value)}
            />
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

          <div className="d-flex gap-2">
            <button
              onClick={onCancelar}
              className="btn btn-outline-secondary flex-grow-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="btn btn-primary flex-grow-1"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
