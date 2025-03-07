import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format, parseISO } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";

const AgendamentosDashboard = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    // Simulação de agendamentos
    setAgendamentos([
      { id: 1, contratante_nome: "João Silva", cuidador_nome: "Maria Oliveira", data_hora_inicio: "2025-02-20T09:00:00", data_hora_fim: "2025-02-20T12:00:00", status: "confirmado", created_at: "2025-02-18T08:30:00", updated_at: "2025-02-18T09:00:00" },
      { id: 2, contratante_nome: "Ana Souza", cuidador_nome: "Carlos Silva", data_hora_inicio: "2025-02-21T10:00:00", data_hora_fim: "2025-02-21T14:00:00", status: "pendente", created_at: "2025-02-19T11:15:00", updated_at: "2025-02-19T11:30:00" }
    ]);
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-primary text-white p-3 vh-100 position-fixed" style={{ width: '250px', marginTop: '55px' }}>
        <h4>Menu</h4>
        <ul className="nav flex-column">
          <li className="nav-item"><a href="#" className="nav-link text-white">Dashboard</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Meus Agendamentos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Pagamentos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Suporte</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Configurações</a></li>
        </ul>
      </div>

      {/* Top Bar */}
      <div className="top-bar bg-primary text-white p-3 d-flex justify-content-between fixed-top w-100">
        <div className="d-flex align-items-center">
          <img src="logo.jpg" alt="Logo" height="40" />
          <span className="fs-4 ms-2">zElo</span>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="content flex-grow-1 p-4" style={{ marginLeft: '250px', marginTop: '30px', overflowX: 'auto', minWidth: 'calc(90vw - 250px)' }}>
        <div className="container mt-5">
          <h2>Agendamentos</h2>

          <div className="row">
            <div className="col-md-8">
              <div className="card p-3">
                <h5>Calendário de Agendamentos</h5>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={agendamentos.map((a) => ({
                    title: `Agendamento ${a.id}`,
                    start: a.data_hora_inicio,
                    end: a.data_hora_fim
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Detalhes dos Agendamentos */}
          <div className="card p-3 mt-3">
            <h5>Detalhes dos Agendamentos</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Contratante</th>
                  <th>Cuidador</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Status</th>
                  <th>Data de Criação</th>
                  <th>Data de Atualização</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a) => (
                  <tr key={a.id}>
                    <td>{a.contratante_nome}</td>
                    <td>{a.cuidador_nome}</td>
                    <td>{format(parseISO(a.data_hora_inicio), "dd/MM/yyyy HH:mm")}</td>
                    <td>{format(parseISO(a.data_hora_fim), "dd/MM/yyyy HH:mm")}</td>
                    <td>
                      <span className={`badge bg-${a.status === "confirmado" ? "success" : a.status === "pendente" ? "warning" : "danger"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{format(parseISO(a.created_at), "dd/MM/yyyy HH:mm")}</td>
                    <td>{format(parseISO(a.updated_at), "dd/MM/yyyy HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendamentosDashboard;
