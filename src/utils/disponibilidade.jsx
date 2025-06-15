import React, { useState, useEffect } from "react";

const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

function formatarDisponibilidade(diasAtivos) {
  if (diasAtivos.length === 7) return "Todos os dias";

  const indices = diasAtivos
    .map((dia) => diasSemana.indexOf(dia))
    .sort((a, b) => a - b);

  let grupos = [];
  let grupoAtual = [indices[0]];

  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) {
      grupoAtual.push(indices[i]);
    } else {
      grupos.push(grupoAtual);
      grupoAtual = [indices[i]];
    }
  }
  grupos.push(grupoAtual);

  const partes = grupos.map((grupo) => {
    if (grupo.length === 1) {
      return diasSemana[grupo[0]];
    } else {
      return `${diasSemana[grupo[0]]} a ${diasSemana[grupo[grupo.length - 1]]}`;
    }
  });

  if (partes.length === 1) return partes[0];
  if (partes.length === 2) return partes.join(" e ");
  return partes.slice(0, -1).join(", ") + " e " + partes[partes.length - 1];
}

export default function CadastroCuidador({ onConfirmar, onCancelar }) {
  const [disponibilidadePorDia, setDisponibilidadePorDia] = useState(
    diasSemana.map((dia) => ({
      dia,
      inicio: "",
      fim: "",
      ativo: false,
    }))
  );

  const [disponibilidadeTexto, setDisponibilidadeTexto] = useState("");

  const handleHorarioChange = (index, campo, valor) => {
    const novaDisponibilidade = [...disponibilidadePorDia];
    novaDisponibilidade[index][campo] = valor;

    novaDisponibilidade[index].ativo =
      novaDisponibilidade[index].inicio !== "" &&
      novaDisponibilidade[index].fim !== "";

    setDisponibilidadePorDia(novaDisponibilidade);
  };

  // Atualiza automaticamente a string de disponibilidade sempre que houver mudança
  useEffect(() => {
    const diasAtivos = disponibilidadePorDia.filter((d) => d.ativo);
    if (diasAtivos.length === 0) {
      setDisponibilidadeTexto("");
      return;
    }

    const primeiroInicio = diasAtivos[0].inicio;
    const primeiroFim = diasAtivos[0].fim;
    const mesmoHorario = diasAtivos.every(
      (d) => d.inicio === primeiroInicio && d.fim === primeiroFim
    );

    if (mesmoHorario) {
      const dias = diasAtivos.map((d) => d.dia);
      const diasFormatados = formatarDisponibilidade(dias);
      setDisponibilidadeTexto(
        `${diasFormatados}: ${primeiroInicio} - ${primeiroFim}`
      );
    } else {
      const texto = diasAtivos
        .map((d) => `${d.dia}: ${d.inicio} - ${d.fim}`)
        .join(" | ");
      setDisponibilidadeTexto(texto);
    }
  }, [disponibilidadePorDia]);

  return (
    <div
      className="modal d-flex align-items-center justify-content-center show"
      style={{
        display: "flex",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-4">
          <h4 className="mb-4 text-center">Atualizar Disponibilidade</h4>

          <div className="row">
            {disponibilidadePorDia.map((diaObj, index) => (
              <div className="col-md-6 mb-3" key={diaObj.dia}>
                <label className="form-label">{diaObj.dia}</label>
                <div className="d-flex gap-2">
                  <input
                    type="time"
                    className="form-control"
                    value={diaObj.inicio}
                    onChange={(e) =>
                      handleHorarioChange(index, "inicio", e.target.value)
                    }
                  />
                  <input
                    type="time"
                    className="form-control"
                    value={diaObj.fim}
                    onChange={(e) =>
                      handleHorarioChange(index, "fim", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Disponibilidade Selecionada</label>
            <input
              type="text"
              className="form-control fw-bold"
              value={disponibilidadeTexto}
              disabled
            />
          </div>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary me-2"
              onClick={() =>
                onConfirmar({ disponibilidade: disponibilidadeTexto })
              }
              disabled={disponibilidadeTexto === ""}
            >
              Confirmar
            </button>
            <button className="btn btn-danger" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
