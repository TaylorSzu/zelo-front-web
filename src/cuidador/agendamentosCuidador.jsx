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
          start: new Date(agendamento.dataHoraInicio),
          end: new Date(agendamento.dataHoraFim),
          status: agendamento.status,
          especialidade: agendamento.especialidade,
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
      <div
        className="container py-4"
        style={{ minHeight: "100vh", maxWidth: "7680px" }}
      >
        <h2 className="mb-5 mt-3 text-center text-primary fw-bold">
          Meus Agendamentos
        </h2>

        <div className="row justify-content-center g-4">
          {/* Calendário */}
          <div
            className="col-12 col-md-8 bg-white shadow rounded-4 p-4"
            style={{ minHeight: "600px" }}
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
                  especialidade: event.especialidade,
                  telefone: event.telefone,
                  valorHora: event.valorHora,
                  status: event.status,
                  inicio: format(event.start, "HH:mm"),
                  fim: format(event.end, "HH:mm"),
                });
              }}
              eventPropGetter={(event) => {
                let backgroundColor = "#005eff";
                if (event.status === "confirmado") backgroundColor = "#198754";
                else if (event.status === "pendente")
                  backgroundColor = "#ffc107";
                else if (event.status === "cancelado")
                  backgroundColor = "#DC3545";
                return {
                  style: {
                    backgroundColor,
                    color: "black",
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
              formats={{
                weekdayFormat: (date) =>
                  ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                    date.getDay()
                  ],
                dayFormat: (date, culture, localizer) =>
                  localizer.format(date, "D", culture),
                timeGutterFormat: (date, culture, localizer) =>
                  localizer.format(date, "HH:mm", culture),
                dayRangeHeaderFormat: ({ start, end }) => {
                  const meses = [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro",
                  ];
                  const diaInicio = start.getDate();
                  const diaFim = end.getDate();
                  const mesInicio = meses[start.getMonth()];
                  const mesFim = meses[end.getMonth()];
                  const anoInicio = start.getFullYear();
                  const anoFim = end.getFullYear();

                  if (anoInicio !== anoFim) {
                    return `${diaInicio} de ${mesInicio} de ${anoInicio} - ${diaFim} de ${mesFim} de ${anoFim}`;
                  } else if (mesInicio !== mesFim) {
                    return `${diaInicio} de ${mesInicio} - ${diaFim} de ${mesFim} de ${anoInicio}`;
                  } else {
                    return `${diaInicio} - ${diaFim} de ${mesInicio} de ${anoInicio}`;
                  }
                },
                monthHeaderFormat: (date) => {
                  const meses = [
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro",
                  ];
                  return `${meses[date.getMonth()]} de ${date.getFullYear()}`;
                },
                dayHeaderFormat: (date) => {
                  const diasSemana = [
                    "Domingo",
                    "Segunda-feira",
                    "Terça-feira",
                    "Quarta-feira",
                    "Quinta-feira",
                    "Sexta-feira",
                    "Sábado",
                  ];
                  const dia = date.getDate().toString().padStart(2, "0");
                  const mes = (date.getMonth() + 1).toString().padStart(2, "0");
                  return `${diasSemana[date.getDay()]} - ${dia}/${mes}`;
                },
              }}
            />
          </div>

          {/* Detalhes */}
          <div
            className="col-12 col-md-4 bg-white shadow rounded-4 p-4"
            style={{
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
                    <strong>Especialidade:</strong>{" "}
                    {eventoSelecionado.especialidade}
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
                    <strong>Valor Hora:</strong> R${" "}
                    {eventoSelecionado.valorHora}
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2">
                    <i
                      className={`bi ${
                        eventoSelecionado.status === "confirmado"
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
                      className={`badge ${
                        eventoSelecionado.status === "confirmado"
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
                      className="bi bi-calendar-check-fill text-info"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Início:</strong> {eventoSelecionado.inicio}
                  </li>
                  <li className="list-group-item d-flex align-items-center gap-2 mb-5">
                    <i
                      className="bi bi-calendar-x-fill text-secondary"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Fim:</strong> {eventoSelecionado.fim}
                  </li>
                </ul>

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
