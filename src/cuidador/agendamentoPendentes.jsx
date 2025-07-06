import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaNotesMedical,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AgendamentosPendentes() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    listarAgendamentos();
  }, []);

  const listarAgendamentos = async () => {
    setLoading(true);
    setError("");
    try {
      const cuidadorId = sessionStorage.getItem("cuidadorId");
      if (!cuidadorId) {
        throw new Error("Cuidador não encontrado na sessão.");
      }

      const { data } = await axios.get(
        `http://localhost:5171/agendamento/listar/pendente/cuidador/${cuidadorId}`,
        { withCredentials: true }
      );
      setAgendamentos(data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setError(err.message || "Erro ao buscar os agendamentos.");
    } finally {
      setLoading(false);
    }
  };

const confirmar = async (id) => {
  try {
    // 1 - Confirma o agendamento
    const { data } = await axios.put(
      "http://localhost:5171/agendamento/confirmar",
      { id, cuidadorId: sessionStorage.getItem("cuidadorId") },
      { withCredentials: true }
    );

    toast.success("✅ Agendamento confirmado!");

    // 2 - Usa os dados retornados diretamente
    const { agendamentoId, cuidadorId, contratanteId } = data.dados;

    // 3 - Registra o pagamento
    await axios.post(
      "http://localhost:5171/pagamento/contratante/registrar",
      {
        agendamentoId,
        cuidadorId,
        contratanteId
      },
      { withCredentials: true }
    );

    toast.success("💰 Pagamento registrado com sucesso!");

    // 4 - Atualiza a lista
    setAgendamentos((prev) => prev.filter((item) => item.id !== id));

  } catch (err) {
    console.error("Erro na confirmação ou pagamento:", err);
    toast.error("❌ Erro ao confirmar ou registrar pagamento.");
  }
};


  const cancelar = async (id) => {
    if (!id) {
      console.error("❌ Tentativa de cancelar com ID inválido:", id);
      toast.error(
        "ID do agendamento inválido. Verifique o evento selecionado."
      );
      return;
    }

    try {
      const cuidadorId = sessionStorage.getItem("cuidadorId");
      if (!cuidadorId) {
        toast.error("Cuidador não encontrado na sessão.");
        return;
      }

      console.log("📝 Cancelando agendamento:", {
        id,
        cuidadorId: Number(cuidadorId),
      });

      await axios.put(
        "http://localhost:5171/agendamento/cancelar",
        {
          id: Number(id),
          cuidadorId: Number(cuidadorId),
        },
        { withCredentials: true }
      );

      toast.success("✅ Agendamento cancelado!");

      // Atualiza o estado removendo o agendamento cancelado da lista
      setAgendamentos((prev) => prev.filter((evento) => evento.id !== id));
    } catch (err) {
      console.error("❌ Erro ao cancelar o agendamento:", err);
      toast.error(err.response?.data?.msg || "Erro ao cancelar o agendamento.");
    }
  };

  return (
    <div
      className="container py-4"
      style={{ minHeight: "100vh", maxWidth: "7680px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white rounded-top-4">
          <h2 className="m-0 text-center fw-bold"> Agendamentos Pendentes</h2>
        </div>
        <div className="card-body">
          {loading && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-3">Carregando agendamentos...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && agendamentos.length === 0 && (
            <div className="text-center text-muted fs-5 my-5">
              Nenhum agendamento pendente no momento.
            </div>
          )}

          <div className="row g-4 mt-3">
            {agendamentos.map((item) => (
              <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                <div className="card border border-primary rounded-4 shadow h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-semibold text-primary mb-3">
                      {item.nome}
                    </h5>

                    <div className="mb-2">
                      <FaMapMarkerAlt className="me-2 text-danger" />
                      <strong>Endereço:</strong> {item.endereco}
                    </div>

                    <div className="mb-2">
                      <FaCalendarAlt className="me-2 text-success" />
                      <strong>Data:</strong>{" "}
                      {new Date(item.data).toLocaleDateString()}
                    </div>

                    <div className="mb-2">
                      <FaClock className="me-2 text-warning" />
                      <strong>Horário:</strong>{" "}
                      {new Date(item.dataHoraInicio).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      às{" "}
                      {new Date(item.dataHoraFim).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="mb-3">
                      <FaNotesMedical className="me-2 text-info" />
                      <strong>Observações:</strong>{" "}
                      {item.observacoesMedicas || "Nenhuma"}
                    </div>

                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-success w-50 d-flex align-items-center justify-content-center"
                        onClick={() => confirmar(item.id)}
                      >
                        <FaCheckCircle className="me-2" />
                        Confirmar
                      </button>
                      <button
                        className="btn btn-danger w-50 d-flex align-items-center justify-content-center"
                        onClick={() => cancelar(item.id)}
                      >
                        <FaTimesCircle className="me-2" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}
