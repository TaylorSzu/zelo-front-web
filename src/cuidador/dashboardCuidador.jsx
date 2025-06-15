import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarCuidador from "../utils/sidebarCuidador.jsx";
import AvisoTaxa from "../utils/avisoTaxa.jsx"; // certifique-se de que o caminho esteja correto

const PainelCuidador = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [showAviso, setShowAviso] = useState(false);

  useEffect(() => {
    const cuidadorId = sessionStorage.getItem("cuidadorId");

    if (cuidadorId) {
      const jaViuAviso = sessionStorage.getItem(
        `avisoTaxa_visto_${cuidadorId}`
      );

      if (!jaViuAviso) {
        setShowAviso(true);
      }
    }
  }, []);

  const handleFecharAviso = () => {
    const cuidadorId = sessionStorage.getItem("cuidadorId");
    if (cuidadorId) {
      sessionStorage.setItem(`avisoTaxa_visto_${cuidadorId}`, "true");
    }
    setShowAviso(false);
  };

  return (
    <>
      <AvisoTaxa show={showAviso} onClose={handleFecharAviso} />

      <div className="d-flex">
        {/* Sidebar */}
        <div className="col-auto p-0">
          <SidebarCuidador />
        </div>

        {/* Conteúdo Principal */}
        <div
          className="container-fluid"
          style={{ marginLeft: 20, padding: "80px 20px" }}
        >
          <h2 className="text-primary">Meus Agendamentos</h2>
          <ul className="list-group mb-4">
            {agendamentos.length > 0 ? (
              agendamentos.map((agendamento) => (
                <li key={agendamento.id} className="list-group-item">
                  {agendamento.data} - {agendamento.cliente} -{" "}
                  {agendamento.status}
                </li>
              ))
            ) : (
              <p className="text-primary">Nenhum agendamento encontrado.</p>
            )}
          </ul>

          <h2 className="text-primary">Meus Pagamentos</h2>
          <ul className="list-group">
            {pagamentos.length > 0 ? (
              pagamentos.map((pagamento) => (
                <li key={pagamento.id} className="list-group-item">
                  {pagamento.data} - {pagamento.valor} - {pagamento.status}
                </li>
              ))
            ) : (
              <p className="text-primary">Nenhum pagamento registrado.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PainelCuidador;
