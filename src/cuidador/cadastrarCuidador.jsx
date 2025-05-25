import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Mascara, { removerMascara, removerMascaraDinheiro } from "../utils/mascaras.jsx";

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
      console.log("disponibilidade: ", disponibilidade, "valor periodo:", valorHora, "especialidade: ", especialidade);

      const valorDiaria = parseFloat(removerMascaraDinheiro(valorHora, 'dinheiro'));
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
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1050,
        }}
      >
        <div
          className="card p-4 shadow-lg"
          style={{ width: "100%", maxWidth: "500px", borderRadius: "1rem" }}
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
            <label className="form-label">Valor por Diaria (R$)</label>
            <Mascara
              type="dinheiro"
              value={valorHora}
              onChange={(e) => setValorHora(e.target.value)}
              placeholder="Infome o seu valor por diaria"
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

          <div className="d-flex justify-content-between">
            <button
              onClick={onCancelar}
              className="btn btn-outline-secondary w-45"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="btn btn-primary w-45"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
