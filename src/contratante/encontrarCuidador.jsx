import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EncontrarCuidador() {
  const [cuidadores, setCuidadores] = useState([]);
  const [medias, setMedias] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filtrosDigitados, setFiltrosDigitados] = useState({
    especialidade: "",
    dia: "",
    horaInicio: "",
    horaFim: "",
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    especialidade: "",
    dia: "",
    horaInicio: "",
    horaFim: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCuidadores();
  }, []);

  const fetchCuidadores = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5171/cuidador/listar",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const lista = response.data;
        setCuidadores(lista);

        const mediasTemp = {};
        await Promise.all(
          lista.map(async (c) => {
            try {
              const res = await axios.get(
                `http://localhost:5171/avaliacao/media/${c.id}`,
                { withCredentials: true }
              );
              mediasTemp[c.id] = parseFloat(res.data.media || 0);
            } catch {
              mediasTemp[c.id] = 0;
            }
          })
        );

        setMedias(mediasTemp);
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

  const cuidadoresFiltrados = cuidadores.filter((c) => {
    const { especialidade, dia, horaInicio, horaFim } = filtrosAplicados;

    const matchEspecialidade = c.especialidade
      .toLowerCase()
      .includes(especialidade.toLowerCase());

    const disponibilidade = c.disponibilidade?.toLowerCase() || "";

    const matchDia = dia === "" || disponibilidade.includes(dia.toLowerCase());

    const matchHorario = (() => {
      if (!horaInicio && !horaFim) return true;

      const horarioRegex = /(\d{2}):(\d{2})/g;
      const horariosEncontrados = [...disponibilidade.matchAll(horarioRegex)];

      return horariosEncontrados.some(([hora]) => {
        if (!hora) return false;
        const h = hora.trim();
        return (!horaInicio || h >= horaInicio) && (!horaFim || h <= horaFim);
      });
    })();

    return matchEspecialidade && matchDia && matchHorario;
  });

  return (
    <div className="container-fluid">
      <div className="p-3">
        <div className="container px-2">
          <h2 className="mb-4 text-center fw-bold">Encontre Cuidadores</h2>

          {/* Filtros */}
          <div className="card p-3 shadow-sm mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">
                  <i className="bi bi-search me-2"></i> Especialidade
                </label>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Ex: Alzheimer, Parkinson..."
                  value={filtrosDigitados.especialidade}
                  onChange={(e) =>
                    setFiltrosDigitados({
                      ...filtrosDigitados,
                      especialidade: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  <i className="bi bi-calendar-week me-2"></i> Dia disponível
                </label>
                <select
                  className="form-select"
                  value={filtrosDigitados.dia}
                  onChange={(e) =>
                    setFiltrosDigitados({
                      ...filtrosDigitados,
                      dia: e.target.value,
                    })
                  }
                >
                  <option value="">Todos</option>
                  {[
                    "Segunda",
                    "Terça",
                    "Quarta",
                    "Quinta",
                    "Sexta",
                    "Sábado",
                    "Domingo",
                  ].map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  <i className="bi bi-clock me-2"></i> Início
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={filtrosDigitados.horaInicio}
                  onChange={(e) =>
                    setFiltrosDigitados({
                      ...filtrosDigitados,
                      horaInicio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  <i className="bi bi-clock me-2"></i> Fim
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={filtrosDigitados.horaFim}
                  onChange={(e) =>
                    setFiltrosDigitados({
                      ...filtrosDigitados,
                      horaFim: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-1 d-flex gap-2">
                <button
                  className="btn btn-primary w-50"
                  title="Pesquisar"
                  onClick={() => setFiltrosAplicados(filtrosDigitados)}
                >
                  <i className="bi bi-search"></i>
                </button>
                <button
                  className="btn btn-outline-secondary w-50"
                  title="Limpar filtros"
                  onClick={() => {
                    const vazio = {
                      especialidade: "",
                      dia: "",
                      horaInicio: "",
                      horaFim: "",
                    };
                    setFiltrosDigitados(vazio);
                    setFiltrosAplicados(vazio);
                  }}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Erro */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Loading */}
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
            <div className="row g-3">
              {cuidadoresFiltrados.length > 0 ? (
                cuidadoresFiltrados.map((cuidador) => {
                  const media = medias[cuidador.id] || 0;

                  return (
                    <div className="col-12 col-sm-6 col-lg-4" key={cuidador.id}>
                      <div
                        className="card shadow-sm border-0 h-100 p-3"
                        style={{ borderRadius: "1rem" }}
                      >
                        <div className="card-body d-flex flex-column align-items-center text-center">
                          <img
                            src={
                              cuidador.User?.fotoPerfil ||
                              "/src/assets/perfil.png"
                            }
                            alt="Foto do Cuidador"
                            className="rounded-circle mb-3"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />

                          <h5 className="text-primary fw-bold mb-1">
                            {cuidador.User?.nome}
                          </h5>
                          <p className="text-muted small mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {cuidador.User?.endereco}
                          </p>

                          <div className="mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i
                                key={i}
                                className={`bi ${
                                  i < Math.round(media)
                                    ? "bi-star-fill"
                                    : "bi-star"
                                } text-warning`}
                              ></i>
                            ))}
                            {media > 0 && (
                              <span className="ms-2 text-muted small">
                                {media.toFixed(1)} / 5
                              </span>
                            )}
                          </div>

                          <p className="mb-1 small">
                            <strong>Especialidade:</strong>{" "}
                            {cuidador.especialidade}
                          </p>
                          <p className="mb-1 small">
                            <strong>Disponibilidade:</strong>{" "}
                            {cuidador.disponibilidade}
                          </p>
                          <p className="mb-2 small">
                            <strong>Valor Hora:</strong>{" "}
                            <span className="badge bg-success">
                              R$ {cuidador.valorHora}
                            </span>
                          </p>

                          <a
                            className="btn btn-primary btn-sm w-100 mb-2"
                            href={`/paciente/agendamentos/marcar?cuidadorId=${cuidador.id}`}
                            onClick={() =>
                              sessionStorage.setItem("cuidadorId", cuidador.id)
                            }
                          >
                            <i className="bi bi-calendar-check me-1"></i>{" "}
                            Agendar
                          </a>

                          <button
                            className="btn btn-outline-warning btn-sm w-100"
                            onClick={() =>
                              navigate(
                                `/paciente/cuidador/${cuidador.id}/avaliacoes`
                              )
                            }
                          >
                            <i className="bi bi-star-fill me-1"></i> Avaliações
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center">
                  Nenhum cuidador encontrado com esses filtros.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
