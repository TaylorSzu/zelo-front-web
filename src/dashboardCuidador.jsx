import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PainelCuidador = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [usuario, setUsuario] = useState(null);

    return (
        <div>
            {/* Top Bar */}
            <div className="top-bar bg-primary text-white p-2 d-flex justify-content-between align-items-center fixed-top">
                <div className="d-flex align-items-center">
                    <img src="/logo.jpg" alt="Logo" height="40" className="me-2" />
                    <span className="fs-4">zElo</span>
                </div>
                <div>
                    {usuario && <span>Bem-vindo, {usuario.nome}</span>}
                </div>
            </div>
            
            {/* Sidebar */}
            <div className="sidebar bg-primary text-white p-3 position-fixed" style={{ top: 55, width: 250, height: "100vh" }}>
                <h4>Menu</h4>
                <ul className="nav flex-column">
                    <li className="nav-item"><a href="#" className="nav-link text-white">Meus Agendamentos</a></li>
                    <li className="nav-item"><a href="#" className="nav-link text-white">Meus Pagamentos</a></li>
                    <li className="nav-item"><a href="#" className="nav-link text-white">Perfil</a></li>
                    <li className="nav-item"><a href="#" className="nav-link text-white">Suporte</a></li>
                </ul>
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
