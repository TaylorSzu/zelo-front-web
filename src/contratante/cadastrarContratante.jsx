import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CadastroNecessidade({ onConfirmar, onCancelar }) {
  const [necessidade, setNecessidade] = useState("");

  const handleConfirmar = async () => {
    if (!necessidade.trim()) {
      toast.warning("Por favor, preencha a necessidade.");
      return;
    }

    try {
      const token = Cookies.get("token");

      await axios.post(
        "http://localhost:5171/contratante/registrar",
        { necessidades: necessidade },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Necessidade cadastrada com sucesso!");

      if (onConfirmar) onConfirmar(necessidade);

      setNecessidade("");

      setTimeout(() => {
        window.location.reload(); // 🔄 Dá tempo da notificação aparecer antes de recarregar
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar necessidade:", error);
      toast.error("Erro ao cadastrar necessidade. Tente novamente.");
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
          style={{ width: "100%", maxWidth: "400px", borderRadius: "1rem" }}
        >
          <h4 className="text-center mb-4">Descreva sua Necessidade</h4>

          <div className="mb-3">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Digite aqui a necessidade do idoso"
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
