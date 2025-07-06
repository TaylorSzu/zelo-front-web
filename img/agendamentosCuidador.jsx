import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatarTelefone } from "../utils/mascaras.jsx";
import SidebarCuidador from "../utils/sidebarCuidador.jsx";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const AgendamentosDashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    async function buscarAgendamentos() {
      try {
        const cuidadorId = sessionStorage.getItem("cuidadorId");
        const resposta = await axios.get(
          `http://localhost:5171/agendamento/listar/cuidador/${cuidadorId}`,
          { withCredentials: true }
        );
        const dados = resposta.data;

        const eventosFormatados = dados.map((agendamento) => ({
          id: agendamento.id,
          title: agendamento.nome,
          date: new Date(agendamento.data),
          start: new Date(agendamento.dataHoraInicio),
          end: new Date(agendamento.dataHoraFim),
          status: agendamento.status,
          observacoesMedicas: agendamento.observacoesMedicas,
          telefone: agendamento.telefone,
          valorHora: agendamento.valorHora,
        }));

        setEventos(eventosFormatados);
      } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);
        toast.error("Erro ao buscar agendamentos.");
      }
    }

    buscarAgendamentos();
  }, []);


  const cancelar = async (id) => {
    try {
      await axios.put(
        "http://localhost:5171/agendamento/cancelar",
        { id },
        { withCredentials: true }
      );
      toast.success("Agendamento cancelado!");
      // Atualiza lista após cancelar
      setEventos((prev) =>
        prev.map((evento) =>
          evento.id === id ? { ...evento, status: "cancelado" } : evento
        )
      );
      if (eventoSelecionado?.id === id) {
        setEventoSelecionado((prev) => ({ ...prev, status: "cancelado" }));
      }
    } catch (err) {
      toast.error("Erro ao cancelar o agendamento.");
      console.error(err);
    }
  };

  return (
    <SidebarCuidador>

      <div className="container py-4" style={{ minHeight: "100vh", maxWidth: "7680px" }}>
        <h2 className="mb-5 mt-3 text-center text-primary fw-bold">
          Meus Agendamentos
        </h2>

        <div className="d-flex justify-content-center align-items-start gap-4 flex-wrap">
          {/* Calendário */}
          <div
            className="bg-white shadow rounded-4 p-5"
            style={{ flex: "1 1 700px", minWidth: "700px", maxWidth: "1080px" }}
          >
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              culture="pt-BR"
              onSelectEvent={(event) => {
                setEventoSelecionado({
                  id: event.id,
                  nome: event.title,
                  observacoesMedicas: event.observacoesMedicas,
                  telefone: event.telefone,
                  valorHora: event.valorHora,
                  status: event.status,
                  data: format(event.date, "dd/MM/yyyy"),
                  inicio: format(event.start, "HH:mm"),
                  fim: format(event.end, "HH:mm"),
                });
              }}
              eventPropGetter={(event) => {
                let backgroundColor = "#6c757d";
                if (event.status === "confirmado") backgroundColor = "#198754";
                else if (event.status === "pendente") backgroundColor = "#ffc107";
                else if (event.status === "cancelado") backgroundColor = "#DC3545";
                return {
                  style: {
                    backgroundColor,
                    color: "blue",
                    borderRadius: "8px",
                    padding: "2px 4px",
                    border: "none",
                  },
                };
              }}
              messages={{
                today: "Hoje",
                previous: "Anterior",
                next: "Próximo",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Não há eventos neste período.",
                showMore: (total) => `+ Ver mais (${total})`,
              }}
            />
          </div>

          {/* Detalhes */}
          <div
            className="bg-white shadow rounded-4 p-4"
            style={{
              width: "400px",
              minHeight: "600px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
            <h5 className="mb-4 text-primary fw-semibold">
              Detalhes do Agendamento
            </h5>
            {eventoSelecionado ? (
              <>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className="bi bi-person-fill text-primary"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Nome:</strong> {eventoSelecionado.nome}
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className="bi bi-heart-pulse-fill text-danger"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Observacoes Medicas:</strong> {eventoSelecionado.observacoesMedicas}
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className="bi bi-telephone-fill text-success"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Telefone:</strong>{" "}
                    {formatarTelefone(eventoSelecionado.telefone)}
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className="bi bi-currency-dollar text-warning"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Valor Diaria:</strong> R$ {eventoSelecionado.valorHora}
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className={`bi ${eventoSelecionado.status === "confirmado"
                          ? "bi-check-circle-fill text-success"
                          : eventoSelecionado.status === "pendente"
                            ? "bi-clock-fill text-warning"
                            : eventoSelecionado.status === "cancelado"
                              ? "bi-x-circle-fill text-danger"
                              : "bi-info-circle-fill text-primary"
                        }`}
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${eventoSelecionado.status === "confirmado"
                          ? "bg-success"
                          : eventoSelecionado.status === "pendente"
                            ? "bg-warning text-dark"
                            : eventoSelecionado.status === "cancelado"
                              ? "bg-danger"
                              : "bg-primary"
                        }`}
                    >
                      {eventoSelecionado.status}
                    </span>
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className="bi bi-calendar-event text-primary"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Data:</strong> {eventoSelecionado.data}
                  </li>

                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className="bi bi-calendar-check-fill text-info"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Início:</strong> {eventoSelecionado.inicio}
                  </li>
                  <li
                    className="list-group-item d-flex align-items-center gap-2 mb-5"
                  >
                    <i
                      className="bi bi-calendar-x-fill text-secondary"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Fim:</strong> {eventoSelecionado.fim}
                  </li>
                </ul>

                {/* Botão Cancelar */}
                {eventoSelecionado.status !== "cancelado" && (
                  <button
                    className="btn btn-danger mt-5"
                    onClick={() => cancelar(eventoSelecionado.id)}
                  >
                    <i className="bi bi-x-circle me-2"></i>Cancelar Agendamento
                  </button>
                )}
              </>
            ) : (
              <div className="text-center text-muted mt-5">
                <i
                  className="bi bi-calendar-event"
                  style={{ fontSize: "2rem" }}
                ></i>
                <p className="mt-3">
                  Clique em um agendamento no calendário para ver detalhes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </SidebarCuidador>
  );
};

export default AgendamentosDashboard;
