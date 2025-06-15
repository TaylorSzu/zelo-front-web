import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CadastroContratante({ onConfirmar, onCancelar }) {
  const [idade, setIdade] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoesMedicas, setObservacoesMedicas] = useState("");

  const handleConfirmar = async () => {
    if (!idade.trim() || !dataNascimento.trim() || !observacoesMedicas.trim()) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const token = Cookies.get("token");

      const contratante = {
        idade: parseInt(idade),
        dataNascimento: dataNascimento,
        observacoesMedicas: observacoesMedicas,
      };

      await axios.post(
        "http://localhost:5171/contratante/registrar",
        contratante,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Contratante cadastrado com sucesso!");

      if (onConfirmar) onConfirmar(observacoesMedicas);

      setIdade("");
      setDataNascimento("");
      setObservacoesMedicas("");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar contratante:", error);
      toast.error("Erro ao cadastrar contratante. Tente novamente.");
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
            maxWidth: "400px",
            width: "90vw",
            borderRadius: "1rem",
          }}
        >
          <h4 className="text-center mb-4">Cadastro de Contratante</h4>

          <div className="mb-3">
            <label className="form-label">Idade</label>
            <input
              type="number"
              className="form-control"
              placeholder="Digite sua idade"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data de Nascimento</label>
            <input
              type="date"
              className="form-control"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Observações Médicas</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Digite aqui suas observações médicas"
              value={observacoesMedicas}
              onChange={(e) => setObservacoesMedicas(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            {/* <button
              onClick={onCancelar}
              className="btn btn-outline-secondary flex-grow-1"
            >
              Cancelar
            </button> */}
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
