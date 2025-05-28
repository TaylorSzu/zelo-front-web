import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import SidebarContratante from "./utils/sidebarContratante.jsx";

axios.defaults.withCredentials = true;

export default function Dashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cuidador, setCuidador] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [idosos, setIdosos] = useState([]);
  const [idosoSelecionado, setIdosoSelecionado] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [temIdosos, setTemIdosos] = useState(false);

  useEffect(() => {
    const fetchIdosos = async () => {
      const contratanteId = sessionStorage.getItem("contratanteId");
      console.log("contratante id: ",contratanteId);
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
      const id = localStorage.getItem("cuidadorId");
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

    const cuidadorId = localStorage.getItem("cuidadorId");
    const contratanteId = localStorage.getItem("contratanteId");

    const dataHoraInicio = new Date(`${date}T${time}:00`);
    const dataHoraFim = new Date(dataHoraInicio);
    dataHoraFim.setHours(dataHoraFim.getHours() + 12); // diária de 12 horas

    if (!tipoServico) {
      setMensagem("Por favor, selecione para quem é o serviço.");
      return;
    }

    if (tipoServico === "idoso" && !idosoSelecionado) {
      setMensagem("Por favor, selecione um idoso para o agendamento.");
      return;
    }

    const agendamento = {
      contratanteId: parseInt(contratanteId),
      cuidadorId: parseInt(cuidadorId),
      idosoId: tipoServico === "idoso" ? parseInt(idosoSelecionado) : null,
      dataHoraInicio: dataHoraInicio.toISOString(),
      dataHoraFim: dataHoraFim.toISOString(),
      valorDiaria: cuidador?.valorDiaria || 0,
      tipoServico: tipoServico
    };

    try {
      const response = await axios.post(
        "http://localhost:5171/agendamento/registrar",
        agendamento
      );

      if (response.status === 201 || response.status === 200) {
        setMensagem("Agendamento realizado com sucesso!");
        setDate("");
        setTime("");
        setTipoServico("");
        setIdosoSelecionado("");
      }
    } catch (error) {
      console.error("Erro ao agendar cuidador:", error);
      setMensagem("Erro ao realizar o agendamento.");
    }
  };

  return (
    <SidebarContratante>
      <div className="container" style={{ paddingTop: "40px" }}>
        <h2 className="mb-4">Agendar Cuidador</h2>

        {mensagem && (
          <div
            className={`alert ${
              mensagem.includes("sucesso") ? "alert-success" : "alert-danger"
            }`}
          >
            {mensagem}
          </div>
        )}

        {cuidador ? (
          <div className="card shadow mb-4 p-4 rounded-4">
            <div className="row align-items-center">
              <div className="col-md-4 text-center mb-3 mb-md-0">
                <img
                  src={cuidador.User?.foto || "/src/assets/perfil.png"}
                  alt="Foto do cuidador"
                  className="rounded-circle"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    border: "2px solid #0d6efd",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </div>

              <div className="col-md-8">
                <h1 className="text-primary fw-bold">
                  {cuidador?.User?.nome || "Nome não informado"}
                </h1>
                <p>
                  <strong>Especialidade:</strong>{" "}
                  {cuidador?.especialidade || "Não informado"}
                </p>
                <p>
                  <strong>Disponibilidade:</strong>{" "}
                  {cuidador?.disponibilidade || "Não informado"}
                </p>
                <p>
                  <strong>Valor Diária:</strong>{" "}
                  <span className="badge bg-info">
                    R$ {cuidador?.valorHora || "0,00"}
                  </span>
                </p>
                <div className="mb-1">
                  <p>
                    <strong>Avaliação:</strong>
                  </p>
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            Carregando informações do cuidador...
          </div>
        )}

        <form className="card shadow p-4" onSubmit={handleAgendar}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Data</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Hora</label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="col-md-12 mt-3">
            <label className="form-label">Para quem é o serviço?</label>
            <select
              className="form-select mb-3"
              value={tipoServico}
              onChange={(e) => {
                setTipoServico(e.target.value);
                setIdosoSelecionado("");
                if (e.target.value === "idoso" && !temIdosos) {
                  setMensagem("Você precisa cadastrar um idoso primeiro.");
                  setTimeout(() => {
                    navigate("/idoso");
                  }, 2000);
                }
              }}
              required
            >
              <option value="">Selecione...</option>
              <option value="contratante">Para mim (Contratante)</option>
              <option value="idoso">Para um Idoso</option>
            </select>
          </div>

          {tipoServico === "idoso" && temIdosos && (
            <div className="col-md-12">
              <label className="form-label">Selecione o Idoso</label>
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

          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Confirmar Agendamento
            </button>
            <button
              type="button"
              className="btn btn-danger ms-2"
              onClick={() => {
                setDate("");
                setTime("");
                setIdosoSelecionado("");
                setMensagem("");
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </SidebarContratante>
  );
}
