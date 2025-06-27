import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditarIdoso({ id, onConfirmar, onCancelar }) {
  const [contratanteId, setContratanteId] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoesMedicas, setObservacoesMedicas] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDadosIdoso();
  }, [id]);

  const carregarDadosIdoso = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:5171/idoso/encontrar/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const idoso = response.data;
        setContratanteId(idoso.contratanteId);
        setNome(idoso.nome);
        setIdade(idoso.idade);
        setDataNascimento(idoso.dataNascimento);
        setObservacoesMedicas(idoso.observacoesMedicas);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do idoso:", error);
      toast.error("Erro ao carregar dados do idoso. Tente novamente.");
    }
  };

  const handleConfirmar = async () => {
    if (
      !nome.trim() ||
      !idade ||
      !dataNascimento ||
      !observacoesMedicas.trim()
    ) {
      toast.warning("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true); // Ativa o spinner

    try {
      const token = Cookies.get("token");

      await axios.put(
        `http://localhost:5171/idoso/alterar/${id}`,
        {
          contratanteId,
          nome,
          idade: parseInt(idade),
          dataNascimento,
          observacoesMedicas,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Idoso atualizado com sucesso!");

      setTimeout(() => {
        setLoading(false);
        if (onConfirmar) onConfirmar();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar idoso:", error);
      toast.error("Erro ao atualizar idoso. Tente novamente.");
      setLoading(false);
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
          <h4 className="text-center mb-4">Editar Idoso</h4>

          <input
            type="hidden"
            value={contratanteId}
            className="form-control"
            onChange={(e) => setContratanteId(e.target.value)}
          />

          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Idade</label>
            <input
              type="number"
              className="form-control"
              placeholder="Digite a idade"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              min={0}
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
              rows="3"
              placeholder="Descreva as condições médicas, medicações, restrições..."
              value={observacoesMedicas}
              onChange={(e) => setObservacoesMedicas(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              onClick={onCancelar}
              className="btn btn-secondary w-45"
              disabled={loading}
            >
              <i className="bi bi-x-circle-fill me-2"></i>
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="btn btn-primary w-45"
              disabled={loading}
            >
              <i class="bi bi-check-circle me-2"></i>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
