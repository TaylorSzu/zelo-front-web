import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function Dashboard() {
  const [cuidadores, setCuidadores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCuidadores();
  }, []);

  const fetchCuidadores = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5171/cuidador/listar", {
        withCredentials: true
      });
      if (response.status === 200) {
        setCuidadores(response.data);
      } else {
        setError("Erro ao buscar cuidadores");
      }
    } catch (error) {
      setError("Erro ao carregar dados. Tente novamente.");
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Conteúdo principal */}
      <div className="container" style={{ marginLeft: 320, padding: "80px 20px" }}>
        <h2 className="mb-4">Dashboard - Cuidadores</h2>

        {loading && <p>Carregando...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {cuidadores.length > 0 ? (
            cuidadores.map((cuidador) => (
              <div className="col-md-4" key={cuidador.id}>
                <div className="card shadow-lg p-4 mb-4 border-0 rounded">
                  <div className="card-body">
                    <h4 className="card-title text-primary fw-bold">{cuidador.User?.nome}</h4>
                    <p className="text-muted"><strong>Endereço:</strong> {cuidador.User?.endereco}</p>
                    <hr/>
                    <p><strong>Especialidade:</strong> {cuidador.especialidade}</p>
                    <p><strong>Disponibilidade:</strong> {cuidador.disponibilidade}</p>
                    <p><strong>Valor/Hora de Serviço:</strong> <span className="badge bg-success">R$ {cuidador.valorHora}</span></p>
                    <a role="button" className="btn btn-primary" href={`/agendamentos/marcar`} 
                      onClick={() => localStorage.setItem("cuidadorId", cuidador.id)}>Agendar</a>
                    <a role="button" className="btn btn-secondary" href="{`/cuidador/perfil`}" style={{marginLeft: "10px"}}>Ver perfil</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum cuidador encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
