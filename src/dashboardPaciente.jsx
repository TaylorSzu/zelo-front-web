import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import SidebarContratante from "./utils/sideBarContratanate.jsx";

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
<SidebarContratante>
      <div className="container" style={{ padding: "20px" }}>
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
                    <p><strong>Valor/Hora:</strong> <span className="badge bg-success">R$ {cuidador.valorHora}</span></p>
                    <p><strong>Valor/Período:</strong> <span className="badge bg-info">R$ {cuidador.valorPeriodo}</span></p>
                    <a role="button" className="btn btn-primary" href={`/agendamentos/marcar`} 
                      onClick={() => localStorage.setItem("cuidadorId", cuidador.id)}>Agendar</a>
                    <a role="button" className="btn btn-secondary" href={`/cuidador/perfil`} style={{marginLeft: "10px"}}>Ver perfil</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum cuidador encontrado.</p>
          )}
        </div>
      </div>
    </SidebarContratante>
  );
}
