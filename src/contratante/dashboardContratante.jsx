import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import SidebarContratante from "../utils/sidebarContratante";

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
      const response = await axios.get("https://127.0.0.1/cuidador/listar", {
        withCredentials: true,
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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-auto p-0">
          <SidebarContratante />
        </div>

        {/* Conteúdo principal */}
        <div className="col p-4">
          <div className="container" style={{ padding: "20px" }}>
            <h2 className="mb-4">Dashboard - Cuidadores</h2>

            {/* Exibir erro, se houver */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Loading Spinner */}
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "300px" }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
              <div className="row justify-content-start">
                {cuidadores.length > 0 ? (
                  cuidadores.map((cuidador) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={cuidador.id}>
                      <div
                        className="card shadow-lg p-4 border-0 h-100"
                        style={{ borderRadius: "30px" }}
                      >
                        <div className="card-body d-flex flex-column justify-content-between align-items-center">
                          {/* Foto do cuidador */}
                          <img
                            src={
                              cuidador.User?.fotoPerfil ||
                              "../src/assets/perfil.png"
                            }
                            alt="Foto do Cuidador"
                            className="rounded-circle mb-3"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "cover",
                            }}
                          />

                          <div className="text-center">
                            <h4 className="card-title text-primary fw-bold">
                              {cuidador.User?.nome}
                            </h4>
                            <p className="text-muted">
                              <strong>Endereço:</strong>{" "}
                              {cuidador.User?.endereco}
                            </p>
                          </div>

                          <hr className="w-100" />

                          {/* Estrelas de avaliação */}
                          <div className="mb-2">
                            {/* Exibe 5 estrelas fixas (apenas visual) */}
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star text-warning"></i>
                          </div>

                          {/* Informações */}
                          <div className="">
                            <p>
                              <strong>Especialidade:</strong>{" "}
                              {cuidador.especialidade}
                            </p>
                            <p>
                              <strong>Disponibilidade:</strong>{" "}
                              {cuidador.disponibilidade}
                            </p>
                            <p>
                              <strong>Valor Diária:</strong>{" "}
                              <span className="badge bg-success">
                                R$ {cuidador.valorHora}
                              </span>
                            </p>
                          </div>

                          {/* Botões */}
                          <div className="mt-3 d-flex justify-content-center gap-2">
                            <a
                              role="button"
                              className="btn btn-primary"
                              href={`/agendamentos/marcar`}
                              onClick={() =>
                                localStorage.setItem("cuidadorId", cuidador.id)
                              }
                            >
                              <i className="bi bi-calendar-check me-2"></i>{" "}
                              Agendar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nenhum cuidador encontrado.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
