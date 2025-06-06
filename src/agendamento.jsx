import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SidebarContratante from "./utils/sidebarContratante";
import moment from "moment";
import "moment/locale/pt-br";
import axios from "axios";

moment.locale("pt-br");

const localizer = momentLocalizer(moment);

const AgendamentosDashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    async function buscarAgendamentos() {
      try {
        const contratanteId = sessionStorage.getItem("contratanteId");
        const resposta = await axios.get(
          `http://localhost:5171/agendamento/listar/contratante/${contratanteId}`,
          { withCredentials: true }
        );
        const dados = await resposta.data;

        const eventosFormatados = dados.map((agendamento) => ({
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
      }
    }

    buscarAgendamentos();
  }, []);

  return (
    <div className="d-flex">
      <SidebarContratante />

      <div className="container-fluid mt-4">
        <h2 className="mb-4">Meus Agendamentos</h2>

        <div className="row" style={{ marginRight: "5%" }}>
          <div className="col-md-8 mb-4">
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              culture="pt-BR"
              messages={{
                today: "Hoje",
                previous: "Voltar",
                next: "Próximo",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Nenhum agendamento neste período",
              }}
              formats={{
                weekdayFormat: (date) =>
                  ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                    date.getDay()
                  ],

                dayFormat: (date, culture, localizer) =>
                  localizer.format(date, "d", culture),

                timeGutterFormat: (date, culture, localizer) =>
                  localizer.format(date, "HH:mm", culture),

                dayRangeHeaderFormat: ({ start, end }) => {
                  const meses = [
                    "janeiro",
                    "fevereiro",
                    "março",
                    "abril",
                    "maio",
                    "junho",
                    "julho",
                    "agosto",
                    "setembro",
                    "outubro",
                    "novembro",
                    "dezembro",
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
              onSelectEvent={(event) => {
                setEventoSelecionado({
                  nome: event.title,
                  especialidade: event.especialidade,
                  telefone: event.telefone,
                  valorHora: event.valorHora,
                  status: event.status,
                  inicio: format(event.start, "dd/MM/yyyy HH:mm"),
                  fim: format(event.end, "dd/MM/yyyy HH:mm"),
                });
              }}
              eventPropGetter={(event) => {
                let backgroundColor = "#6c757d";
                if (event.status === "confirmado") backgroundColor = "#198754";
                else if (event.status === "pendente")
                  backgroundColor = "#ffc107";
                return { style: { backgroundColor, color: "black" } };
              }}
            />
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Detalhes do Agendamento</h5>
                {eventoSelecionado ? (
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Nome:</strong> {eventoSelecionado.nome}
                    </li>
                    <li className="list-group-item">
                      <strong>Especialidade:</strong>{" "}
                      {eventoSelecionado.especialidade}
                    </li>
                    <li className="list-group-item">
                      <strong>Telefone:</strong> {eventoSelecionado.telefone}
                    </li>
                    <li className="list-group-item">
                      <strong>Valor Hora:</strong> R${" "}
                      {eventoSelecionado.valorHora}
                    </li>
                    <li className="list-group-item">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          eventoSelecionado.status === "confirmado"
                            ? "bg-success"
                            : eventoSelecionado.status === "pendente"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {eventoSelecionado.status}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <strong>Início:</strong> {eventoSelecionado.inicio}
                    </li>
                    <li className="list-group-item">
                      <strong>Fim:</strong> {eventoSelecionado.fim}
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted">
                    Clique em um agendamento no calendário para ver detalhes.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendamentosDashboard;
