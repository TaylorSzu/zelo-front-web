import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { FaClipboardList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HistoricoServicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cuidadorId = sessionStorage.getItem("cuidadorId");

    axios
      .get(`http://localhost:5171/servicos/concluidos/${cuidadorId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setServicos(res.data || []);
      })
      .catch((err) => {
        console.error("Erro ao carregar serviços concluídos:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="container px-3 px-md-4"
      style={{ minHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white text-center rounded-top-4 d-flex align-items-center justify-content-center gap-2">
          <h3 className="m-0">Serviços Concluídos</h3>
        </div>

        <div className="card-body">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 200 }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          ) : servicos.length === 0 ? (
            <div className="alert alert-info text-center rounded-4">
              Nenhum serviço concluído encontrado.
            </div>
          ) : (
            <div className="row g-4">
              {servicos.map((servico, idx) => (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="card shadow-sm p-3 rounded-4 border-0 h-100">
                    <div className="fw-bold text-primary mb-1">
                      {servico.nomeCliente}
                    </div>

                    {servico.nomeIdoso && (
                      <div className="text-muted small mb-1">
                        👴 Idoso: {servico.nomeIdoso}
                      </div>
                    )}

                    <div className="text-muted small mb-1">
                      📅 Data:{" "}
                      {new Date(servico.dataHoraExecucao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>

                    <div className="text-muted small mb-1">
                      🕒 Hora:{" "}
                      {new Date(servico.dataHoraExecucao).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>

                    <div className="fw-semibold mb-1">
                      💰 Valor:{" "}
                      <span className="text-success">
                        {servico.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>

                    <div
                      className={`fw-semibold ${
                        servico.statusPagamento === "Pago"
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      Status: {servico.statusPagamento}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
