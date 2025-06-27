import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ZelloPagamentosCuidador = () => {
  const [saldo, setSaldo] = useState(0);
  const [pendentes, setPendentes] = useState([]);
  const [realizados, setRealizados] = useState([]);

  useEffect(() => {
    const cuidadorId = sessionStorage.getItem("cuidadorId") || 1;

    axios
      .get(
        `http://localhost:5171/pagamentos/listarPagamentoCuidador/${cuidadorId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const pend = res.data.pendentes || [];
        const concluidos = res.data.concluidos || [];

        setPendentes(pend);
        setRealizados(concluidos);

        const total = concluidos.reduce(
          (acc, curr) => acc + (curr.valor || 0),
          0
        );
        setSaldo(total);
      })
      .catch((err) => {
        console.error("Erro ao carregar pagamentos do cuidador:", err);
      });
  }, []);

  const solicitarResgate = (id) => {
    if (window.confirm("Deseja solicitar o resgate deste pagamento?")) {
      console.log("➡️ Resgatar pagamento ID:", id);
      // axios.post(`/pagamentos/resgatar/${id}`).then(...);
    }
  };

  return (
    <div
      className="container px-2 px-sm-3 px-md-4 px-lg-5"
      style={{ minHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white text-center rounded-top-4">
          <h3 className="m-0">Pagamentos do Cuidador</h3>
        </div>

        <div className="card-body">
          {/* SALDO DISPONÍVEL */}
          <div className="card shadow-sm mb-4 p-4 rounded-4 border-0">
            <div className="d-flex align-items-center">
              <div className="fs-1 me-3">💼</div>
              <div>
                <div className="fw-semibold">SALDO DISPONÍVEL</div>
                <div className="fs-4 text-success">R$ {saldo.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* SEÇÃO PAGAMENTOS */}
          <div className="row g-3 justify-content-center">
            {/* Pendentes */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3 rounded-4 border-0 h-100">
                <div className="fw-bold text-warning mb-2 d-flex justify-content-between">
                  <span>PAGAMENTOS PENDENTES</span>
                  <span>({pendentes.length})</span>
                </div>
                {pendentes.length === 0 ? (
                  <div className="text-muted">Nenhum pagamento pendente.</div>
                ) : (
                  pendentes.map((p, idx) => (
                    <div key={idx} className="border-bottom pb-2 mb-2">
                      <div className="fw-semibold">{p.cuidadorNome}</div>
                      <div className="small mt-1">
                        {p.periodo ? (
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
                        ) : (
                          <div className="text-muted">
                            Período não informado
                          </div>
                        )}
                        <div>
                          Vencimento:{" "}
                          {p.vencimento
                            ? new Date(p.vencimento).toLocaleDateString()
                            : "Não informado"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Realizados */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3 rounded-4 border-0 h-100">
                <div className="fw-bold text-success mb-2 d-flex justify-content-between">
                  <span>PAGAMENTOS REALIZADOS</span>
                  <span>({realizados.length})</span>
                </div>

                <div className="text-muted small mb-3">
                  ⏱️ Resgate pode levar até <strong>22 horas</strong> para cair
                  na conta.
                </div>

                {realizados.length === 0 ? (
                  <div className="text-muted">Nenhum pagamento realizado.</div>
                ) : (
                  realizados.map((p, idx) => (
                    <div key={idx} className="border-bottom pb-2 mb-3">
                      <div className="fw-semibold">{p.cuidadorNome}</div>
                      <div className="small mt-1">
                        {p.periodo ? (
                          <div>
                            Período:{" "}
                            {new Date(p.periodo.inicio).toLocaleDateString()}{" "}
                            até {new Date(p.periodo.fim).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-muted">
                            Período não informado
                          </div>
                        )}
                        <div>
                          Vencimento:{" "}
                          {p.vencimento
                            ? new Date(p.vencimento).toLocaleDateString()
                            : "Não informado"}
                        </div>
                      </div>
                      <div className="fw-bold text-success text-end mt-1">
                        R$ {p.valor?.toFixed(2) || "0,00"}
                      </div>
                      <button
                        className="btn btn-outline-success btn-sm mt-2 w-100"
                        onClick={() => solicitarResgate(p.id)}
                      >
                        💸 Resgatar
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

export default ZelloPagamentosCuidador;
