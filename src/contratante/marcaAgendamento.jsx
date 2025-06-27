import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import DataRestrita from "../utils/limitarData.jsx";
axios.defaults.withCredentials = true;

export default function Dashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [dataHoraInicio, setDataHoraInicio] = useState("");
  const [dataHoraFim, setDataHoraFim] = useState("");
  const [cuidador, setCuidador] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [idosos, setIdosos] = useState([]);
  const [idosoSelecionado, setIdosoSelecionado] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [temIdosos, setTemIdosos] = useState(false);

  useEffect(() => {
    const fetchIdosos = async () => {
      const contratanteId = sessionStorage.getItem("contratanteId");
      try {
        const response = await axios.get(
          `http://localhost:5171/idoso/listar/${contratanteId}`
        );
        if (response.status === 200) {
          setIdosos(response.data);
          setTemIdosos(response.data.length > 0);
        }
      } catch (error) {
        console.error("Erro ao buscar idosos:", error);
      }
    };

    const fetchCuidadorInfo = async () => {
      const id = sessionStorage.getItem("cuidadorId");
      try {
        const response = await axios.get(
          `http://localhost:5171/cuidador/encontrar/${id}`
        );
        if (response.status === 200) {
          setCuidador(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar cuidador:", error);
      }
    };

    fetchIdosos();
    fetchCuidadorInfo();
  }, []);

  const handleAgendar = async (e) => {
    e.preventDefault();

    if (!cuidador) {
      setMensagem("Informações do cuidador não carregadas ainda.");
      return;
    }

    const cuidadorId = cuidador.id;
    const contratanteId = sessionStorage.getItem("contratanteId");

    const inicio = new Date(`${date}T${dataHoraInicio}:00`);
    const fim = new Date(`${date}T${dataHoraFim}:00`);
    const diffMs = fim - inicio;
    const diffHoras = diffMs / (1000 * 60 * 60);

    if (diffHoras > 8) {
      setMensagem("A jornada de trabalho não pode exceder 8 horas.");
      return;
    }
    if (diffHoras <= 0) {
      setMensagem("O horário de fim deve ser após o início.");
      return;
    }

    const agendamento = {
      contratanteId:
        tipoServico === "contratante" ? parseInt(contratanteId) : null,
      cuidadorId: parseInt(cuidadorId),
      idosoId: tipoServico === "idoso" ? parseInt(idosoSelecionado) : null,
      dataHoraInicio: inicio.toISOString(),
      dataHoraFim: fim.toISOString(),
    };

    try {
      const response = await axios.post(
        "http://localhost:5171/agendamento/registrar",
        agendamento
      );
      if (response.status === 201 || response.status === 200) {
        setMensagem("Agendamento realizado com sucesso!");
        setTimeout(() => navigate("/paciente/agendamentos"), 1500);
      }
    } catch (error) {
      console.error("Erro ao agendar cuidador:", error);
      setMensagem("Erro ao realizar o agendamento.");
    }
  };

  return (
    <div
      className="container px-3 px-md-4"
      style={{ minHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white text-center rounded-top-4 d-flex align-items-center justify-content-center gap-2">
          <h3 className="m-0">Agendar Cuidador</h3>
        </div>

        <div className="card-body">
          {mensagem && (
            <div
              className={`alert text-center rounded-4 ${
                mensagem.toLowerCase().includes("sucesso")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {mensagem}
            </div>
          )}

          {!cuidador ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 200 }}
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
            <>
              <div className="card shadow-sm rounded-4 border-0 p-4 mb-4">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center mb-3 mb-md-0">
                    <div
                      className="rounded-circle overflow-hidden border border-3 border-primary shadow-sm mx-auto"
                      style={{ width: "180px", height: "180px" }}
                    >
                      <img
                        src={cuidador.User?.foto || "/src/assets/perfil.png"}
                        alt="Foto do cuidador"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>

                  <div className="col-md-8">
                    <h4 className="fw-bold text-primary">
                      {cuidador?.User?.nome}
                    </h4>
                    <p>
                      <strong>Especialidade:</strong>{" "}
                      {cuidador?.especialidade || "Não informado"}
                    </p>
                    <p>
                      <strong>Disponibilidade:</strong>{" "}
                      {cuidador?.disponibilidade || "Não informada"}
                    </p>
                    <p>
                      <strong>Valor da Diária:</strong>{" "}
                      <span className="badge bg-info">
                        R$ {cuidador?.valorHora || "0,00"}
                      </span>
                    </p>
                    <p>
                      <strong>Avaliação:</strong>{" "}
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={
                            index < (cuidador?.avaliacao || 4)
                              ? "bi bi-star-fill text-warning"
                              : "bi bi-star text-warning"
                          }
                        ></i>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAgendar}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Data</label>
                    <DataRestrita value={date} onChange={setDate} />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Início do Serviço
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={dataHoraInicio}
                      onChange={(e) => setDataHoraInicio(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Fim do Serviço
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={dataHoraFim}
                      onChange={(e) => setDataHoraFim(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">
                      Para quem é o serviço?
                    </label>
                    <select
                      className="form-select"
                      value={tipoServico}
                      onChange={(e) => {
                        setTipoServico(e.target.value);
                        setIdosoSelecionado("");
                        if (e.target.value === "idoso" && !temIdosos) {
                          setMensagem(
                            "Você precisa cadastrar um idoso primeiro."
                          );
                          setTimeout(() => navigate("/paciente/idoso"), 2000);
                        }
                      }}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="contratante">
                        Para mim (Contratante)
                      </option>
                      <option value="idoso">Para um Idoso</option>
                    </select>
                  </div>

                  {tipoServico === "idoso" && temIdosos && (
                    <div className="col-md-12">
                      <label className="form-label fw-semibold">
                        Selecione o Idoso
                      </label>
                      <select
                        className="form-select"
                        value={idosoSelecionado}
                        onChange={(e) => setIdosoSelecionado(e.target.value)}
                        required
                      >
                        <option value="">Selecione um idoso...</option>
                        {idosos.map((idoso) => (
                          <option key={idoso.id} value={idoso.id}>
                            {idoso.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="text-end mt-4">
                  <button type="submit" className="btn btn-primary">
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setDate("");
                      setDataHoraInicio("");
                      setDataHoraFim("");
                      setTipoServico("");
                      setIdosoSelecionado("");
                      setMensagem("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
