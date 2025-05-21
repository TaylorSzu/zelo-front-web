import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { format, parseISO } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fullcalendar/daygrid";
import SidebarContratante from "./utils/sidebarContratante";

const AgendamentosDashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    async function buscarAgendamentos() {
      try {
        const resposta = await fetch(
          "https://127.0.0.1/agendamento/listar/contratante"
        );
        const dados = await resposta.json();

        const eventosFormatados = dados.map((agendamento) => {
          const nome =
            agendamento?.Contratante?.User?.nome || "Nome não disponível";
          const endereco =
            agendamento?.Contratante?.User?.endereco ||
            "Endereço não disponível";
          const necessidades =
            agendamento?.Contratante?.necessidades || "Não informado";

          return {
            title: `${nome} (${agendamento.status})`,
            start: agendamento.dataHoraInicio,
            end: agendamento.dataHoraFim,
            extendedProps: {
              endereco,
              necessidades,
              status: agendamento.status,
              nome,
            },
          };
        });

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

      <div className="container-fluid mt-4" style={{ marginLeft: "-65%" }}>
        <h2 className="mb-4">Meus Agendamentos</h2>

        <div className="row" style={{ marginRight: "5%" }}>
          <div className="col-md-8 mb-4">
            <FullCalendar
              plugins={[dayGridPlugin, bootstrap5Plugin]}
              initialView="dayGridMonth"
              events={eventos}
              locale={ptBrLocale}
              themeSystem="bootstrap5"
              height="auto"
              eventContent={(info) => (
                <>
                  <b>{info.timeText}</b>
                  <i> {info.event.title}</i>
                </>
              )}
              eventClick={(info) => {
                setEventoSelecionado({
                  nome: info.event.extendedProps.nome,
                  inicio: format(
                    parseISO(info.event.startStr),
                    "dd/MM/yyyy HH:mm"
                  ),
                  fim: format(parseISO(info.event.endStr), "dd/MM/yyyy HH:mm"),
                  endereco: info.event.extendedProps.endereco,
                  necessidades: info.event.extendedProps.necessidades,
                  status: info.event.extendedProps.status,
                });
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
                      <strong>Status:</strong> {eventoSelecionado.status}
                    </li>
                    <li className="list-group-item">
                      <strong>Início:</strong> {eventoSelecionado.inicio}
                    </li>
                    <li className="list-group-item">
                      <strong>Fim:</strong> {eventoSelecionado.fim}
                    </li>
                    <li className="list-group-item">
                      <strong>Endereço:</strong> {eventoSelecionado.endereco}
                    </li>
                    <li className="list-group-item">
                      <strong>Necessidades:</strong>{" "}
                      {eventoSelecionado.necessidades}
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
