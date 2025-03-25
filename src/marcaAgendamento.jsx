import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function Dashboard() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tipoAgendamento, setTipoAgendamento] = useState("hora");
  const [cuidador, setCuidador] = useState(null);

  useEffect(() => {
    const fetchCuidadorInfo = async () => {
      const id = localStorage.getItem("cuidadorId");
      console.log("ID do cuidador recuperado:", id);
      try {
        const response = await axios.get(`http://localhost:5171/cuidador/encontrar/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setCuidador(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar as informações do cuidador:", error);
      }
    };

    fetchCuidadorInfo();
  }, []);

  return (
    <div>
      <div className="top-bar bg-primary text-white p-2 d-flex justify-content-between align-items-center fixed-top">
        <div className="d-flex align-items-center">
          <img src="/logo.jpg" alt="Logo" height="40" className="me-2" />
          <span className="fs-4">zElo</span>
        </div>
      </div>

      <div className="sidebar bg-primary text-white p-3 position-fixed" style={{ top: 55, width: 250, height: "100vh" }}>
        <h4>Menu</h4>
        <ul className="nav flex-column">
          <li className="nav-item"><a href="#" className="nav-link text-white">Meus Agendamentos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Meus Pagamentos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Perfil</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Suporte</a></li>
        </ul>
      </div>

      <div className="container" style={{ marginLeft: 320, padding: "80px 20px" }}>
        <h2 className="mb-4">Agendar Cuidador</h2>

        {cuidador ? (
          <div className="card mb-4 p-4 shadow-lg">
            <h4 className="text-primary fw-bold">{cuidador?.User?.nome || "Nome não informado"}</h4>
            <p><strong>Especialidade:</strong> {cuidador?.especialidade || "Não informado"}</p>
            <p><strong>Disponibilidade:</strong> {cuidador?.disponibilidade || "Não informado"}</p>
            <p><strong>Valor/Hora:</strong> <span className="badge bg-success">R$ {cuidador?.valorHora || "0,00"}</span></p>
            <p><strong>Valor/Período:</strong> <span className="badge bg-info">R$ {cuidador?.valorPeriodo || "0,00"}</span></p>
          </div>
        ) : (
          <p>Carregando informações do cuidador...</p>
        )}

        <form className="card p-4 shadow-lg">
          <div className="mb-3">
            <label className="form-label">Tipo de Agendamento</label>
            <select className="form-control" value={tipoAgendamento} onChange={(e) => setTipoAgendamento(e.target.value)}>
              <option value="hora">Por Hora</option>
              <option value="periodo">Por Período</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Data do Agendamento</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Hora do Agendamento</label>
            <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
        </form>
      </div>
    </div>
  );
}
