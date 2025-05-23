import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
axios.defaults.withCredentials = true;
import SidebarContratante from "./utils/sidebarContratante.jsx";

export default function Dashboard() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [cuidador, setCuidador] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchCuidadorInfo = async () => {
      const id = localStorage.getItem("cuidadorId");
      try {
        const response = await axios.get(
          `https://www.zelloapp.com.br:5173/cuidador/encontrar/${id}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setCuidador(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar as informações do cuidador:", error);
      }
    };

    fetchCuidadorInfo();
  }, []);

  const handleAgendar = async (e) => {
    e.preventDefault();

    const cuidadorId = localStorage.getItem("cuidadorId");
    const contratanteId = localStorage.getItem("contratanteId");

    const dataHoraInicio = new Date(`${date}T${time}:00`);
    const dataHoraFim = new Date(dataHoraInicio);
    dataHoraFim.setHours(dataHoraFim.getHours() + 12); // 12 horas de diária

    const agendamento = {
      contratanteId: parseInt(contratanteId),
      cuidadorId: parseInt(cuidadorId),
      dataHoraInicio: dataHoraInicio.toISOString(),
      dataHoraFim: dataHoraFim.toISOString(),
      valorDiaria: cuidador?.valorDiaria || 0,
    };

    try {
      const response = await axios.post(
        "http://zelloapp.com.br/agendamento/registrar",
        agendamento,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMensagem("Agendamento realizado com sucesso!");
        setDate("");
        setTime("");
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
              {/* Coluna da foto */}
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

              {/* Coluna das informações */}
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
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary">
              Confirmar Agendamento
            </button>
            <button type="reset" className="btn btn-danger ms-2">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </SidebarContratante>
  );
}
