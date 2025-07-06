import React, { useEffect, useState } from "react";
import axios from "axios";

const ZelloPagamentosStatus = () => {
  const [pendentes, setPendentes] = useState([]);
  const [cancelados, setCancelados] = useState([]);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const contratanteId = sessionStorage.getItem("contratanteId");
    if (!contratanteId) {
      console.error("❌ Contratante não encontrado na sessão.");
      return;
    }

    axios
      .get(`http://localhost:5171/pagamentos/listarPagamentoContratante/${contratanteId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setPendentes(res.data.pendentes || []);
        setCancelados(res.data.cancelados || []);
        setPagos(res.data.concluidos || []);
      })
      .catch((err) => {
        console.error("Erro ao buscar pagamentos:", err);
      });
  }, []);

  // Função para solicitar reembolso
  const solicitarReembolso = (id) => {
    if (window.confirm("Deseja realmente solicitar o reembolso?")) {
      console.log("Solicitando reembolso para pagamento id:", id);
      // Aqui você pode chamar sua API para solicitar reembolso
      // Exemplo:
      // axios.post(`/pagamentos/reembolso/${id}`).then(...)
    }
  };

  return (
    <div
      className="container px-2 px-sm-3 px-md-4 px-lg-5"
      style={{ minHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white rounded-top-4 text-center">
          <h3 className="m-0">Status dos Pagamentos</h3>
        </div>

        <div className="card-body">
          <div className="row g-3">
            {/* PENDENTES */}
            <div className="col-sm-6 col-md-4">
              <div className="card shadow-sm p-3 rounded-4">
                <div className="fw-bold text-warning mb-2 d-flex justify-content-between">
                  <span>PENDENTES</span>
                  <span>({pendentes.length})</span>
                </div>
                {pendentes.length === 0 ? (
                  <div className="text-muted">Nenhum pagamento pendente.</div>
                ) : (
                  pendentes.map((p, idx) => (
                    <div key={idx} className="border-bottom pb-2 mb-2">
                      <div className="fw-semibold">{p.cuidadorNome}</div>
                      <div className="small mt-1">
                        <div>
                          Período:{" "}
                          {new Date(p.periodo.inicio).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          às{" "}
                          {new Date(p.periodo.fim).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div>
                          Vencimento: {new Date(p.vencimento).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="fw-bold text-danger text-end">
                        R$ {p.valor.toFixed(2)}
                      </div>
                      <button
                        className="btn btn-primary btn-sm mt-2 w-100"
                        onClick={() => window.open(p.link, "_blank")}
                      >
                        💳 Pagar Cuidador
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CANCELADOS */}
            <div className="col-sm-6 col-md-4">
              <div className="card shadow-sm p-3 rounded-4">
                <div className="fw-bold text-secondary mb-2 d-flex justify-content-between">
                  <span>CANCELADOS</span>
                  <span>({cancelados.length})</span>
                </div>
                {cancelados.length === 0 ? (
                  <div className="text-muted">Nenhum pagamento cancelado.</div>
                ) : (
                  cancelados.map((p, idx) => (
                    <div key={idx} className="border-bottom pb-2 mb-2">
                      <div className="fw-semibold">{p.cuidadorNome}</div>
                      <div className="small mt-1">
                        <div>Motivo: {p.motivo}</div>
                        <div>
                          Data cancelamento: {new Date(p.dataCancel).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="fw-bold text-muted text-end">
                        R$ {p.valor.toFixed(2)}
                      </div>
                      {/* Botão de "Ver Detalhes" removido */}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PAGOS */}
            <div className="col-sm-6 col-md-4">
              <div className="card shadow-sm p-3 rounded-4">
                <div className="fw-bold text-success mb-2 d-flex justify-content-between">
                  <span>PAGOS</span>
                  <span>({pagos.length})</span>
                </div>
                {pagos.length === 0 ? (
                  <div className="text-muted">Nenhum pagamento realizado.</div>
                ) : (
                  pagos.map((p, idx) => (
                    <div key={idx} className="border-bottom pb-2 mb-2">
                      <div className="fw-semibold">{p.cuidadorNome}</div>
                      <div className="small mt-1">
                        <div>
                          Data pagamento: {new Date(p.dataRealizada).toLocaleDateString()}
                        </div>
                        <div>Método: {p.metodo}</div>
                      </div>
                      <div className="fw-bold text-success text-end">
                        R$ {p.valor.toFixed(2)}
                      </div>
                      <button
                        className="btn btn-success btn-sm mt-2 w-100"
                        onClick={() => solicitarReembolso(p.id)}
                      >
                        🔁 Reembolso
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZelloPagamentosStatus;
