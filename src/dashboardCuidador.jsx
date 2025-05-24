import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebBarCuidador from "./utils/sidebarCuidador.jsx";

const PainelCuidador = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [usuario, setUsuario] = useState(null);

    return (
        <div>
        {/* Sidebar */}
        <div className="col-auto p-0">
          <SidebBarCuidador />
        </div>

            {/* Conteúdo Principal */}
            <div className="container-content" style={{ marginLeft: 260, padding: "80px 20px" }}>
                <h2>Meus Agendamentos</h2>
                <ul className="list-group mb-4">
                    {agendamentos.length > 0 ? agendamentos.map((agendamento) => (
                        <li key={agendamento.id} className="list-group-item">
                            {agendamento.data} - {agendamento.cliente} - {agendamento.status}
                        </li>
                    )) : <p>Nenhum agendamento encontrado.</p>}
                </ul>
                
                <h2>Meus Pagamentos</h2>
                <ul className="list-group">
                    {pagamentos.length > 0 ? pagamentos.map((pagamento) => (
                        <li key={pagamento.id} className="list-group-item">
                            {pagamento.data} - {pagamento.valor} - {pagamento.status}
                        </li>
                    )) : <p>Nenhum pagamento registrado.</p>}
                </ul>
            </div>
        </div>
    );
};

export default PainelCuidador;
